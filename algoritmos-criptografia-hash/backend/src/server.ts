import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import { AppDataSource } from "./config/data-source";



const app = express();

const port = Number(process.env.PORT);
const frontEndOrigin = process.env.FRONTEND_ORIGIN;

if (!frontEndOrigin) {
    throw new Error("FRONTEND_ORIGIN must be defined in the .env file");
}

app.use(cookieParser());

//configuradno csp para que apenas frontend possa acessas a api
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        connectSrc: ["'self'", frontEndOrigin]
      }
    }
  })
);

const initializeDatabase = async (): Promise<void> => {
    await AppDataSource.initialize();
    console.log("Database initialized");

    app.use(cors({
        origin: frontEndOrigin,
        credentials: true
    }))
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Front-end origin: ${frontEndOrigin}`);
    })

}

initializeDatabase().catch((error: unknown) => {
    console.error("Error initializing database:", error);
    process.exit(1);
});
