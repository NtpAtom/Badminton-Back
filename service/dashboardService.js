const db = require("../DB/db");

/**
 * Get dashboard statistics with filter support
 */
exports.getDashboardData = async (startDate, endDate, branchIds) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = end.getTime() - start.getTime();

        // Calculate previous period for comparison
        const prevStart = new Date(start.getTime() - duration - (24 * 60 * 60 * 1000));
        const prevEnd = new Date(start.getTime() - (24 * 60 * 60 * 1000));

        const branchFilter = branchIds && branchIds.length > 0 ? branchIds : null;

        // 1. Summary Stats (Overall + Branch Breakdown)
        const summaryStats = await this.getSummaryStats(startDate, endDate, prevStart.toISOString().split('T')[0], prevEnd.toISOString().split('T')[0], branchFilter);

        // 2. Revenue Trend (Daily)
        const revenueTrend = await this.getRevenueTrend(startDate, endDate, branchFilter);

        // 3. Branch Performance (Ranking)
        const branchPerformance = await this.getBranchPerformance(startDate, endDate, branchFilter);

        // 4. Peak Hour Analysis (Multi-series)
        const peakHours = await this.getPeakHours(startDate, endDate, branchFilter);

        // 5. Peak Day Analysis (Multi-series)
        const peakDays = await this.getPeakDays(startDate, endDate, branchFilter);

        return {
            status: true,
            data: {
                summary: summaryStats,
                revenueTrend,
                branchPerformance,
                peakHours,
                peakDays
            }
        };
    } catch (error) {
        console.error("getDashboardData ERROR:", error);
        throw new Error(`Analytics failed: ${error.message}`);
    }
};

exports.getSummaryStats = async (currStart, currEnd, prevStart, prevEnd, branchFilter) => {
    const buildOverallQuery = (start, end, branches) => {
        let query = `
            SELECT 
                COALESCE(SUM(total_price), 0) as total_revenue,
                COUNT(*) as total_bookings,
                COUNT(DISTINCT user_id) as active_users
            FROM booking b
            JOIN court c ON b.court_id = c.court_id
            WHERE b.status = 'Confirmed'
            AND b.booking_date BETWEEN $1 AND $2
        `;
        const params = [start, end];
        if (branches) {
            query += ` AND c.branch_id = ANY($3)`;
            params.push(branches);
        }
        return { query, params };
    };

    const currOverall = buildOverallQuery(currStart, currEnd, branchFilter);
    const prevOverall = buildOverallQuery(prevStart, prevEnd, branchFilter);

    const currRes = await db.query(currOverall.query, currOverall.params);
    const prevRes = await db.query(prevOverall.query, prevOverall.params);

    const c = currRes.rows[0];
    const p = prevRes.rows[0];

    const calculateGrowth = (current, previous) => {
        if (parseFloat(previous) === 0) return parseFloat(current) > 0 ? 100 : 0;
        return ((parseFloat(current) - parseFloat(previous)) / parseFloat(previous)) * 100;
    };

    // Branch Breakdown
    let branchQuery = `
        SELECT 
            br.branch_name,
            COALESCE(SUM(b.total_price), 0) as revenue,
            COUNT(b.booking_id) as bookings
        FROM branch br
        LEFT JOIN court c ON br.branch_id = c.branch_id
        LEFT JOIN booking b ON c.court_id = b.court_id AND b.status = 'Confirmed' AND b.booking_date BETWEEN $1 AND $2
        WHERE br.is_active = true
    `;
    const bParams = [currStart, currEnd];
    if (branchFilter) {
        branchQuery += ` AND br.branch_id = ANY($3)`;
        bParams.push(branchFilter);
    }
    branchQuery += ` GROUP BY br.branch_id, br.branch_name ORDER BY revenue DESC`;
    const branchRes = await db.query(branchQuery, bParams);

    return {
        revenue: { value: parseFloat(c.total_revenue), growth: calculateGrowth(c.total_revenue, p.total_revenue) },
        bookings: { value: parseInt(c.total_bookings), growth: calculateGrowth(c.total_bookings, p.total_bookings) },
        users: { value: parseInt(c.active_users), growth: calculateGrowth(c.active_users, p.active_users) },
        branchBreakdown: branchRes.rows.map(r => ({
            name: r.branch_name,
            revenue: parseFloat(r.revenue),
            bookings: parseInt(r.bookings)
        }))
    };
};

exports.getRevenueTrend = async (startDate, endDate, branchFilter) => {
    let query = `
        SELECT 
            b.booking_date as date,
            br.branch_name,
            SUM(b.total_price) as revenue
        FROM booking b
        JOIN court c ON b.court_id = c.court_id
        JOIN branch br ON c.branch_id = br.branch_id
        WHERE b.status = 'Confirmed'
        AND b.booking_date BETWEEN $1 AND $2
    `;
    const params = [startDate, endDate];
    if (branchFilter) {
        query += ` AND c.branch_id = ANY($3)`;
        params.push(branchFilter);
    }
    query += ` GROUP BY b.booking_date, br.branch_name ORDER BY b.booking_date ASC`;

    const result = await db.query(query, params);
    
    const trendMap = {};
    result.rows.forEach(row => {
        const dateStr = new Date(row.date).toISOString().split('T')[0];
        if (!trendMap[dateStr]) trendMap[dateStr] = { date: dateStr };
        trendMap[dateStr][row.branch_name] = parseFloat(row.revenue);
    });

    return Object.values(trendMap);
};

exports.getBranchPerformance = async (startDate, endDate, branchFilter) => {
    let query = `
        SELECT 
            br.branch_id,
            br.branch_name,
            SUM(b.total_price) as revenue,
            COUNT(*) as bookings
        FROM branch br
        LEFT JOIN court c ON br.branch_id = c.branch_id
        LEFT JOIN booking b ON c.court_id = b.court_id AND b.status = 'Confirmed' AND b.booking_date BETWEEN $1 AND $2
        WHERE br.is_active = true
    `;
    const params = [startDate, endDate];
    if (branchFilter) {
        query += ` AND br.branch_id = ANY($3)`;
        params.push(branchFilter);
    }
    query += ` GROUP BY br.branch_id, br.branch_name ORDER BY revenue DESC`;

    const result = await db.query(query, params);
    return result.rows.map(r => ({
        id: r.branch_id,
        name: r.branch_name,
        revenue: parseFloat(r.revenue || 0),
        bookings: parseInt(r.bookings || 0)
    }));
};

exports.getPeakHours = async (startDate, endDate, branchFilter) => {
    let query = `
        SELECT 
            EXTRACT(HOUR FROM b.start_time) as hour,
            br.branch_name,
            COUNT(*) as counts
        FROM booking b
        JOIN court c ON b.court_id = c.court_id
        JOIN branch br ON c.branch_id = br.branch_id
        WHERE b.status = 'Confirmed'
        AND b.booking_date BETWEEN $1 AND $2
    `;
    const params = [startDate, endDate];
    if (branchFilter) {
        query += ` AND c.branch_id = ANY($3)`;
        params.push(branchFilter);
    }
    query += ` GROUP BY hour, br.branch_name ORDER BY hour ASC`;

    const result = await db.query(query, params);
    
    const hourMap = {};
    result.rows.forEach(row => {
        const hLabel = `${String(parseInt(row.hour)).padStart(2, '0')}:00`;
        if (!hourMap[hLabel]) hourMap[hLabel] = { hour: hLabel };
        hourMap[hLabel][row.branch_name] = parseInt(row.counts);
    });

    return Object.values(hourMap);
};

exports.getPeakDays = async (startDate, endDate, branchFilter) => {
    let query = `
        SELECT 
            EXTRACT(DOW FROM b.booking_date) as dow,
            br.branch_name,
            COUNT(*) as counts
        FROM booking b
        JOIN court c ON b.court_id = c.court_id
        JOIN branch br ON c.branch_id = br.branch_id
        WHERE b.status = 'Confirmed'
        AND b.booking_date BETWEEN $1 AND $2
    `;
    const params = [startDate, endDate];
    if (branchFilter) {
        query += ` AND c.branch_id = ANY($3)`;
        params.push(branchFilter);
    }
    query += ` GROUP BY dow, br.branch_name ORDER BY dow ASC`;

    const result = await db.query(query, params);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const dayMap = {};
    result.rows.forEach(row => {
        const dName = dayNames[parseInt(row.dow)];
        if (!dayMap[dName]) dayMap[dName] = { day: dName };
        dayMap[dName][row.branch_name] = parseInt(row.counts);
    });

    // Ensure order Sun-Sat
    return dayNames.map(d => dayMap[d] || { day: d });
};
