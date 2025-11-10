"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = exports.CacheService = void 0;
var CacheService = /** @class */ (function () {
    function CacheService() {
        this.cache = new Map();
        this.startCleanupInterval();
    }
    CacheService.prototype.set = function (key, data, ttlMinutes) {
        if (ttlMinutes === void 0) { ttlMinutes = 5; }
        this.cache.set(key, {
            data: data,
            timestamp: Date.now(),
            ttl: ttlMinutes * 60 * 1000,
        });
        console.log("[Cache] Set: ".concat(key, " (TTL: ").concat(ttlMinutes, "m)"));
    };
    CacheService.prototype.get = function (key) {
        var item = this.cache.get(key);
        if (!item) {
            console.log("[Cache] Miss: ".concat(key));
            return null;
        }
        var now = Date.now();
        var age = now - item.timestamp;
        if (age > item.ttl) {
            console.log("[Cache] Expired: ".concat(key, " (age: ").concat(Math.floor(age / 1000), "s)"));
            this.cache.delete(key);
            return null;
        }
        console.log("[Cache] Hit: ".concat(key, " (age: ").concat(Math.floor(age / 1000), "s)"));
        return item.data;
    };
    CacheService.prototype.has = function (key) {
        var data = this.get(key);
        return data !== null;
    };
    CacheService.prototype.delete = function (key) {
        this.cache.delete(key);
        console.log("[Cache] Deleted: ".concat(key));
    };
    CacheService.prototype.clear = function () {
        this.cache.clear();
        console.log('[Cache] Cleared all entries');
    };
    CacheService.prototype.getStats = function () {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    };
    CacheService.prototype.startCleanupInterval = function () {
        var _this = this;
        setInterval(function () {
            var now = Date.now();
            var cleaned = 0;
            for (var _i = 0, _a = _this.cache.entries(); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], item = _b[1];
                var age = now - item.timestamp;
                if (age > item.ttl) {
                    _this.cache.delete(key);
                    cleaned++;
                }
            }
            if (cleaned > 0) {
                console.log("[Cache] Cleanup: removed ".concat(cleaned, " expired entries"));
            }
        }, 60 * 1000);
    };
    return CacheService;
}());
exports.CacheService = CacheService;
exports.cacheService = new CacheService();
