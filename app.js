const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const handleError = require("./utils/handleError");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));

app.use("/api/v1/users", userRouter)

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(handleError)

module.exports = app;


