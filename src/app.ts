import express from "express";
import session from "express-session";
import cors from "cors";
import errorhandler from "errorhandler";
import fileUpload from "express-fileupload";
import compression from "compression";
import http from "http";
import { Server } from "socket.io";
import { startSeed } from "./utils/seeder";
import { isProduction } from "./utils/constants";
import { controllers } from "./controllers";
import dotenv from "dotenv";
/**
 * Server Initialization.
 */
const app = express();
const server = http.createServer(app);
dotenv.config();
const port = process.env.PORT || 3002;

/**
 * Create socket.io server.
 */

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

/**
 * Setup muddlewares.
 */

app.use(cors());

app.set("port", process.env.PORT || 3001);
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(compression());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "conduit",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

if (!isProduction) {
  app.use(errorhandler());
}

app.use(express.static("public"));

app.use((_req, _res, next) => {
  next();
});

/**
 * Seeding services
 */

startSeed();

/**
 * Routes declaration
 */

app.get("/api/dashboard-info", controllers.getDashboardInfo);

app.delete("/api/device/:id", controllers.deleteDevice);
app.get("/api/device", controllers.getDevices);
app.get("/api/device/:id", controllers.getDeviceDetail);
app.post("/api/device", controllers.postCreateDevice);
app.post("/api/device/switch/:id", controllers.postSwitchDevice);
app.post(
  "/api/device/update-temperature/:id",
  controllers.postUpdateTemperature
);

app.get("/api/room", controllers.getRooms);
app.get("/api/room/:id", controllers.getRoomDetail);
app.post("/api/room", controllers.postCreateRoom);
app.put("/api/room/:id", controllers.putUpdateRoom);
app.delete("/api/room/:id", controllers.deleteRoom);

app.get("/api/user", controllers.getUsers);
app.get("/api/user/:id", controllers.getUserDetail);
app.delete("/api/user/:id", controllers.deleteUser);
app.put("/api/user/:id", controllers.putUpdateUser);
app.post("/api/user", controllers.postCreateUser);

app.post("/api/auth/login", controllers.postLogin);

/**
 * Server listening to process.env.PORT / 3002
 */

server.listen(port, () => console.log(`Listening on port ${port}`));
