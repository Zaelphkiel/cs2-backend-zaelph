"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var compression_1 = require("compression");
var helmet_1 = require("helmet");
var config_1 = require("./config");
var matches_1 = require("./routes/matches");
var health_1 = require("./routes/health");
var app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    console.log("[".concat(new Date().toISOString(), "] ").concat(req.method, " ").concat(req.path));
    next();
});
app.get('/', function (req, res) {
    res.json({
        name: 'CS2 Analytics Backend',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/health',
            matches: '/api/matches',
            matchDetails: '/api/matches/:id',
            analyze: '/api/matches/:id/analyze',
        },
    });
});
app.use('/health', health_1.default);
app.use('/api/matches', matches_1.default);
app.use(function (req, res) {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path,
    });
});
app.use(function (err, req, res, next) {
    console.error('[Error]', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: config_1.config.nodeEnv === 'development' ? err.message : 'Something went wrong',
    });
});
var PORT = config_1.config.port;
app.listen(PORT, function () {
    console.log('='.repeat(60));
    console.log('CS2 Analytics Backend Server');
    console.log('='.repeat(60));
    console.log("Environment: ".concat(config_1.config.nodeEnv));
    console.log("Server running on port: ".concat(PORT));
    console.log("Health check: http://localhost:".concat(PORT, "/health"));
    console.log("API endpoint: http://localhost:".concat(PORT, "/api/matches"));
    console.log("Browserless: ".concat(config_1.config.browserlessApiKey ? 'Configured ✓' : 'Not configured ✗'));
    console.log("ScraperAPI: ".concat(config_1.config.scraperApiKey ? 'Configured ✓' : 'Not configured ✗'));
    console.log('='.repeat(60));
});
exports.default = app;
