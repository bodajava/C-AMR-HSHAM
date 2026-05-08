import { configService } from './common/services/config.service.js';
import express, { Request, Response, NextFunction } from "express";
import { authRouter, userRouter, subscriptionRouter, workoutRouter, mealRouter, performanceMetricsRouter, weeklyPlanRouter } from "./modules/index.js";
import { globalErrorHandler } from "./middleware/index.js";
import { NotFoundException } from "./common/exception/index.js";
import connectDB from "./DB/connection.DB.js";
import { redisService } from './common/services/redis.service.js';
import cors from 'cors';
import { successResponse } from './common/res/success.response.js';
import { s3Service } from './common/services/s3.service.js';
import { asyncHandler } from './common/utils/async-handler.util.js';
import { notificationService } from './common/services/notification.service.js';

const bootstrap = async (): Promise<express.Express> => {
  const app: express.Express = express();

  app.use(express.json({
    verify: (req: any, res, buf) => {
      if (req.originalUrl?.startsWith('/subscription/webhook')) {
        req.rawBody = buf;
      }
    }
  }));
  app.use(cors({
    origin: true, // Reflect request origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  }));

  // Request Logging Middleware
  app.use((req, res, next) => {
    console.log(`[Backend] ${req.method} ${req.originalUrl}`);
    next();
  });

  // Serve static files (Frontend Page)
  app.use(express.static('public'));

  // Database connections
  await connectDB();
  await redisService.connect();

  // Root route
  app.get("/", (req: Request, res: Response) => {
    return successResponse({ res, message: "Server is healthy and running 🚀" });
  });

  app.post("/send-notification", asyncHandler(async (req: Request, res: Response): Promise<express.Response> => {
    try {
      console.log(" Received FCM Token:", req.body.token);
      await notificationService.sendNotification({
        token: req.body.token,
        data: {
          title: "Welcome to our app",
          body: "You have been successfully logged in."
        }
      });
    } catch (error) {
      console.error("Notification send failed:", error);
    }
    return successResponse({ res, message: "FCM Token received successfully by backend", data: req.body });
  }));

  // Module routers
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/subscription", subscriptionRouter);
  app.use("/workout", workoutRouter);
  app.use("/meal", mealRouter);
  app.use("/metrics", performanceMetricsRouter);
  app.use("/weekly-plan", weeklyPlanRouter);


  // S3 Routes (kept in bootstrap as per user request)
  app.get(/^\/upload\/(.*)/, asyncHandler(async (req, res, next) => {
    const { download, fileName } = req.query as {
      download: string;
      fileName: string;
    };
    
    const path = (req.params as any)[0];
    if (!path) {
      return next(new NotFoundException('Path is required'));
    }

    const Key = decodeURIComponent(path);
    console.log(`[S3 Proxy] Fetching: ${Key}`);

    try {
      const { Body, ContentType } = await s3Service.getImage({ Key });

      if (!Body) {
        return res.status(404).json({ message: "File not found" });
      }

      res.setHeader("Content-Type", ContentType || "application/octet-stream");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");

      if (download === "true") {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fileName || Key.split("/").pop()}"`
        );
      }

      // Robust stream handling
      if (typeof (Body as any).pipe === 'function') {
        (Body as any).pipe(res);
      } else if (typeof (Body as any).transformToByteArray === 'function') {
        const buffer = await (Body as any).transformToByteArray();
        res.send(Buffer.from(buffer));
      } else {
        res.send(Body);
      }
    } catch (error: any) {
      if (error.name === 'NoSuchKey' || error.code === 'NoSuchKey') {
        res.status(404).json({ message: "File not found" });
      } else {
        console.error(`[S3 Proxy] Error:`, error);
        res.status(500).json({ message: "Error fetching from S3" });
      }
    }
    return;
  }));

  app.get(/^\/pre-signed\/(.*)/, asyncHandler(async (req, res, next) => {
    const { download, fileName } = req.query as {
      download: string;
      fileName: string;
    };

    const path = (req.params as any)[0];
    if (!path) {
      return next(new NotFoundException('Path is required'));
    }
    const Key = path;

    const url = await s3Service.createPresignedFetchLink({ Key, download, fileName });

    return successResponse({ res, data: { url } });
  }));

  // 404 Handler
  app.all('/*dummy', (req: Request, res: Response, next: NextFunction) => {
    console.warn(`[BACKEND] 404 Not Found: ${req.method} ${req.originalUrl}`);
    return next(new NotFoundException(`Route [${req.method}] ${req.originalUrl} not found`));
  });
  // Global Error Handler
  app.use(globalErrorHandler);

  // Server setup
  if (!process.env.VERCEL) {
    const PORT = configService.get('PORT') || 3001;
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} ✅`);
      console.log(`Application bootstrapped successfully in ${configService.get('NODE_ENV')} mode 🚀`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port or kill the existing process.`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
      }
    });
  }

  return app;
};

export default bootstrap;