require("dotenv").config();
const express = require("express");
const dbConnection = require("./lib/db.service");
dbConnection().catch(() => process.exit(1));
const app = express();
const cookieParser = require("cookie-parser");
const mainRouter = require("./router/main.routes");
app.use(express.json());
app.use(cookieParser());
app.use("/api", mainRouter)
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
