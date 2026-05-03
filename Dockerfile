# ใช้ Node image
FROM node:20

# ตั้ง working directory
WORKDIR /app

# copy package ก่อนเพื่อ cache
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install --production

# copy ทั้งโปรเจกต์
COPY . .

# เปิดพอร์ต
EXPOSE 3000

# รัน server
CMD ["node", "app.js"]
