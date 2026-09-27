const express = require("express");
const cors = require("cors");
const app = express();

// 1. Import Swagger Setup
const setupSwagger = require("./src/config/swagger");

// Import Rute & Middleware
const authRoutes = require("./src/routes/auth.routes");
const todoRoutes = require("./src/routes/todo.routes");
const apiKeyMiddleware = require("./src/middlewares/apiKey.middleware");
const notFound = require("./src/middlewares/notFound.middleware");
const errorHandler = require("./src/middlewares/errorHandler.middleware");

app.use(cors());
app.use(express.json());

// 2. Halaman root: penanda API hidup (sebelumnya tidak ada dan tersangkut API Key)
app.get("/", (req, res) => {
  res.json({ message: "Todo API is running" });
});

// 3. Pasang Swagger Docs (Akses publik tanpa terhalang API Key)
setupSwagger(app);

// 4. RUTE AUTH (Tanpa API Key)
app.use("/api/auth", authRoutes);

// 5. API KEY MIDDLEWARE DI BAWAH SWAGGER & AUTH
app.use(apiKeyMiddleware);

// 6. RUTE TODO DI BAWAH API KEY
app.use("/api/todos", todoRoutes);

// 7. Error handling (sudah ada filenya, tinggal dipasang)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
