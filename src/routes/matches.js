"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var hltv_1 = require("../scraper/hltv");
var analyzer_1 = require("../services/analyzer");
var cache_1 = require("../services/cache");
var router = (0, express_1.Router)();
var hltvScraper = new hltv_1.HLTVScraper();
var analyzer = new analyzer_1.MatchAnalyzer();
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cached, matches, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('[API] GET /matches - Fetching all matches');
                cached = cache_1.cacheService.get('all_matches');
                if (cached) {
                    console.log('[API] Returning cached matches');
                    return [2 /*return*/, res.json({
                            success: true,
                            data: cached,
                            cached: true,
                            timestamp: new Date().toISOString(),
                        })];
                }
                return [4 /*yield*/, hltvScraper.getMatches()];
            case 1:
                matches = _a.sent();
                cache_1.cacheService.set('all_matches', matches, 2);
                console.log("[API] Returning ".concat(matches.length, " matches"));
                res.json({
                    success: true,
                    data: matches,
                    cached: false,
                    timestamp: new Date().toISOString(),
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('[API] Error fetching matches:', error_1);
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch matches',
                    message: error_1 instanceof Error ? error_1.message : 'Unknown error',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, cacheKey, cached, matches, match, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id_1 = req.params.id;
                console.log("[API] GET /matches/".concat(id_1, " - Fetching match details"));
                cacheKey = "match_".concat(id_1);
                cached = cache_1.cacheService.get(cacheKey);
                if (cached) {
                    console.log('[API] Returning cached match');
                    return [2 /*return*/, res.json({
                            success: true,
                            data: cached,
                            cached: true,
                        })];
                }
                return [4 /*yield*/, hltvScraper.getMatches()];
            case 1:
                matches = _a.sent();
                match = matches.find(function (m) { return m.id === id_1; });
                if (!match) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            error: 'Match not found',
                        })];
                }
                cache_1.cacheService.set(cacheKey, match, 2);
                res.json({
                    success: true,
                    data: match,
                    cached: false,
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('[API] Error fetching match:', error_2);
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch match',
                    message: error_2 instanceof Error ? error_2.message : 'Unknown error',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/:id/analyze', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_2, cacheKey, cached, matches, match, analysis, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id_2 = req.params.id;
                console.log("[API] POST /matches/".concat(id_2, "/analyze - Analyzing match"));
                cacheKey = "analysis_".concat(id_2);
                cached = cache_1.cacheService.get(cacheKey);
                if (cached) {
                    console.log('[API] Returning cached analysis');
                    return [2 /*return*/, res.json({
                            success: true,
                            data: cached,
                            cached: true,
                        })];
                }
                return [4 /*yield*/, hltvScraper.getMatches()];
            case 1:
                matches = _a.sent();
                match = matches.find(function (m) { return m.id === id_2; });
                if (!match) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            error: 'Match not found',
                        })];
                }
                return [4 /*yield*/, analyzer.analyzeMatch(match)];
            case 2:
                analysis = _a.sent();
                cache_1.cacheService.set(cacheKey, analysis, 10);
                res.json({
                    success: true,
                    data: analysis,
                    cached: false,
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('[API] Error analyzing match:', error_3);
                res.status(500).json({
                    success: false,
                    error: 'Failed to analyze match',
                    message: error_3 instanceof Error ? error_3.message : 'Unknown error',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
