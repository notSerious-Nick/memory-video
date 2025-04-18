import "./db";
import "./models/Video";
import express from "express"; // node_modules include express file
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express(); // application(server) has to listent request from client, server turn on all the time
const logger = morgan("dev"); // method path statuscode duration time

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); // origin is process.cwd() +/views
app.use(express.urlencoded({extended: true}));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

app.use(logger);

const handleListening = () => console.log(`listening! http://localhost:${PORT}`);

app.listen(PORT, handleListening); // ex) button.addEventListener("click", handleClick)