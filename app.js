require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors")
const morgan = require("morgan")

//import routes
const userRoute = require("./routes/userRoute")
const branchRoute = require("./routes/branchRoute")
const courtRoute = require("./routes/courtRoute")




app.use(cors())
app.use(express.json());
app.use(morgan("dev"))

//use routes
app.use("/api/branch", branchRoute)
app.use("/api/user", userRoute)
app.use("/api/court", courtRoute)










app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)

})