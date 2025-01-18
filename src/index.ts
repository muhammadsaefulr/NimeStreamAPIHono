import { Hono } from "hono";
import animeRoutes from "routes/animeRoutes";
import { logger } from "hono/logger";
import { errorHandler } from "middleware/middleware";
import { cors } from "hono/cors";
import mainRoutes from "routes/mainRoutes";
import { swaggerUI } from "@hono/swagger-ui";

const app = new Hono();

// CORS untuk akses publik - letakkan di awal
app.use('*', cors({
  origin: '*',  // Mengizinkan semua origin
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['*'],  // Mengizinkan semua headers
}));

// Middleware lain
app.use('*', logger());
app.onError(errorHandler);

// Routes
app.get("/", (c) => c.json({ message: "Service Is Up !" }, 200));
app.route("/", animeRoutes);
app.route("/main/api", mainRoutes);

// Swagger
app.get('/doc', (c) => {
  return c.json({
    openapi: '3.0.0',
    info: {
      title: 'Hono API',
      version: '1.0.0',
    },
  });
});

app.get('/ui', swaggerUI({ url: '/doc' }));

export default {
  port: 8020,
  fetch: app.fetch,
};