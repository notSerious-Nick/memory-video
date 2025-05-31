
import express from "express"; // node_modules include express file
import morgan from "morgan";
import session from "express-session";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";


const app = express(); // application(server) has to listent request from client, server turn on all the time
const logger = morgan("dev"); // method path statuscode duration time

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); // origin is process.cwd() +/views
app.use(express.urlencoded({extended: true}));
app.use(
    session({
        secret: "Hello!",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(localsMiddleware);
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

app.use(logger);

export default app;