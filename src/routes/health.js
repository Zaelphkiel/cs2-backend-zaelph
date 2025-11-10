"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cache_1 = require("../services/cache");
var router = (0, express_1.Router)();
router.get('/', function (req, res) {
    var cacheStats = cache_1.cacheService.getStats();
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cache: cacheStats,
    });
});
exports.default = router;
