const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan"); // Logging library
require("dotenv").config();

const app = express();

/**
 * ============================
 * Global Configurations - For future use
 * ============================
 */

// const configs = require("./lib/configs"); // Uncomment if needed
// global.configs = configs; // Avoid using global variables
// Instead, consider passing configs as needed
// const { getConfig } = require("./lib/configs"); // Uncomment if needed
// const config = getConfig(); // Uncomment if needed

/**
 * ============================
 * Middleware Configuration
 * ============================
 */

/**
 * Security Middlewares
 * - helmet: Adds security headers to protect against common vulnerabilities.
 * - cors: Enables Cross-Origin Resource Sharing for external requests.
 */
app.use(helmet());
app.use(cors());

/**
 * Logging Middleware
 * - morgan: Logs HTTP requests in a detailed "combined" format.
 */
app.use(morgan("combined"));

/**
 * Body Parsing Middleware
 * - express.json(): Parses incoming JSON request bodies.
 * - express.urlencoded(): Parses URL-encoded request bodies (e.g., form submissions).
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Static File Serving
 * - Serves static files (e.g., CSS, JS, images) from the "public" directory.
 */
app.use(express.static("public"));

/**
 * ============================
 * Application Configuration
 * ============================
 */

/**
 * View Engine
 * - pug: Sets Pug as the template engine for rendering dynamic HTML.
 */
app.set("view engine", "pug");

/**
 * ============================
 * Routes
 * ============================
 */

/**
 * Redirect Root Route
 * - Redirects the root URL ("/") to the "/collect" route.
 */
app.get("/", (_req, res) => {
  res.redirect("/collect");
});

/**
 * Routes
 * - /link: Handles requests related to "link" functionality.
 * - /collect: Handles requests related to "collect" functionality.
 */
app.use("/link", require("./routes/link"));
app.use("/collect", require("./routes/collect"));

/**
 * Error Messages
 * - A dictionary of common HTTP status codes and their corresponding error messages.
 */
const errorMessages = {
  200: "OK",
  201: "Created",
  202: "Accepted",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  409: "Conflict",
  410: "Gone",
  415: "Unsupported Media Type",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

/**
 * 404 Error Handler
 * - Handles requests to undefined routes and returns a 404 error in JSON format.
 */
app.use((_req, res) => {
  res.status(404).json({ error: errorMessages[404] });
});

/**
 * General Error Handler
 * - Handles all other errors and returns a JSON response with the appropriate status code and message.
 * - Logs the error stack to the console for debugging purposes.
 */
app.use((err, _req, res, _next) => {
  console.error(err.stack); // Logs error stack to the console
  const statusCode = err.status || 500;
  const message = errorMessages[statusCode] || "An unknown error occurred";
  res.status(statusCode).json({ error: message });
});

/**
 * ============================
 * Server Initialization
 * ============================
 */

/**
 * Start Server
 * - Starts the Express server on the specified port (default: 3000).
 * - Uncomment the console.log statement for debugging purposes.
 */
const port = process.env.PORT || 3000; // Development-friendly default
app.listen(port, () => {
  // console.log(`Sellbot listening at http://localhost:${port}`); // Uncomment for debugging
});