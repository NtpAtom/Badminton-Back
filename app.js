require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors")
const userRoute = require("./routes/userRoute")
const morgan = require("morgan")

app.use(cors())
app.use(express.json());
app.use(morgan("dev"))

app.use("/api/user", userRoute)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)

})