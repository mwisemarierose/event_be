import express from "express";
import cors from "cors";
import database from "./Database/Database.js";
import { userRouter } from "./Routers/UserRouter.js";
import { eventRouter } from "./Routers/EventRouter.js";
import { bookingRouter } from "./Routers/BookingRouter.js";

const app = express();
app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

database();

app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/booking", bookingRouter);

app.get("/", (req, res) => {
  res.send("Hello from server");
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
