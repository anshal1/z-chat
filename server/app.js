import express from "express";

import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";
import { createUser } from "./seeders/user.js";

dotenv.config({
    path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

// Connect to the database
connectDB(mongoURI);



const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user', userRoute);
app.use('/chat', chatRoute);

app.get("/", (req, res) => {
    res.send("Hello World");
});
    app.use(errorMiddleware);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
