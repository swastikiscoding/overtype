import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.get("/", (_, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Overtype API",
    });
});


export {app};