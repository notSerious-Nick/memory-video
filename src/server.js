

import express from "express"; // node_modules include express file
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";



const app = express(); // application(server) has to listent request from client, server turn on all the time
const logger = morgan("dev"); // method path statuscode duration time

app.use(express.static(__dirname));
app.use(express.json());
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); // origin is process.cwd() +/views
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    }),
);

app.use(localsMiddleware);
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

app.use(logger);

export default app;