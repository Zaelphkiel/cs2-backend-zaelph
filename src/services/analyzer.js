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
exports.MatchAnalyzer = void 0;
var hltv_1 = require("../scraper/hltv");
var liquidpedia_1 = require("../scraper/liquidpedia");
var MatchAnalyzer = /** @class */ (function () {
    function MatchAnalyzer() {
        this.hltvScraper = new hltv_1.HLTVScraper();
        this.liquidpediaScraper = new liquidpedia_1.LiquidpediaScraper();
    }
    MatchAnalyzer.prototype.analyzeMatch = function (match) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, team1Stats, team2Stats, team1MapStats, team2MapStats, team1Players, team2Players, h2h, news, mapPredictions, overallPrediction, analysis;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("[Analyzer] Starting analysis for match: ".concat(match.team1.name, " vs ").concat(match.team2.name));
                        return [4 /*yield*/, Promise.all([
                                this.hltvScraper.getTeamStats(match.team1.name),
                                this.hltvScraper.getTeamStats(match.team2.name),
                                this.liquidpediaScraper.getTeamMapStats(match.team1.name),
                                this.liquidpediaScraper.getTeamMapStats(match.team2.name),
                                this.liquidpediaScraper.getPlayerStats(match.team1.name),
                                this.liquidpediaScraper.getPlayerStats(match.team2.name),
                                this.liquidpediaScraper.getH2HHistory(match.team1.name, match.team2.name),
                                this.hltvScraper.getNews([match.team1.name, match.team2.name]),
                            ])];
                    case 1:
                        _a = _b.sent(), team1Stats = _a[0], team2Stats = _a[1], team1MapStats = _a[2], team2MapStats = _a[3], team1Players = _a[4], team2Players = _a[5], h2h = _a[6], news = _a[7];
                        if (team1Stats) {
                            match.team1.ranking = team1Stats.ranking;
                            match.team1.recentForm = team1Stats.recentForm.slice(0, 5);
                        }
                        if (team2Stats) {
                            match.team2.ranking = team2Stats.ranking;
                            match.team2.recentForm = team2Stats.recentForm.slice(0, 5);
                        }
                        mapPredictions = this.generateMapPredictions(match.maps || ['TBD', 'TBD', 'TBD'], team1MapStats, team2MapStats);
                        overallPrediction = this.generateOverallPrediction(match, team1MapStats, team2MapStats, mapPredictions);
                        analysis = {
                            teamAnalysis: {
                                team1: {
                                    strengths: this.generateStrengths(team1MapStats, team1Players),
                                    weaknesses: this.generateWeaknesses(team1MapStats, team1Players),
                                    mapPool: team1MapStats,
                                    keyPlayers: team1Players,
                                },
                                team2: {
                                    strengths: this.generateStrengths(team2MapStats, team2Players),
                                    weaknesses: this.generateWeaknesses(team2MapStats, team2Players),
                                    mapPool: team2MapStats,
                                    keyPlayers: team2Players,
                                },
                            },
                            h2h: h2h,
                            mapPredictions: mapPredictions,
                            overallPrediction: overallPrediction,
                            news: news,
                            lastUpdated: new Date().toISOString(),
                        };
                        console.log("[Analyzer] Analysis complete for match: ".concat(match.team1.name, " vs ").concat(match.team2.name));
                        return [2 /*return*/, analysis];
                }
            });
        });
    };
    MatchAnalyzer.prototype.generateMapPredictions = function (maps, team1Stats, team2Stats) {
        return maps
            .filter(function (map) { return map !== 'TBD'; })
            .map(function (mapName) {
            var team1Map = team1Stats.find(function (m) { return m.name === mapName; });
            var team2Map = team2Stats.find(function (m) { return m.name === mapName; });
            var team1WinRate = (team1Map === null || team1Map === void 0 ? void 0 : team1Map.winRate) || 50;
            var team2WinRate = (team2Map === null || team2Map === void 0 ? void 0 : team2Map.winRate) || 50;
            var totalRate = team1WinRate + team2WinRate;
            var team1Probability = (team1WinRate / totalRate) * 100;
            var team2Probability = 100 - team1Probability;
            var winner = team1Probability > team2Probability ? 'Team 1' : 'Team 2';
            var probability = Math.max(team1Probability, team2Probability);
            var expectedRounds = Math.floor(Math.random() * 7) + 23;
            var overUnderLine = 26.5;
            return {
                mapName: mapName,
                winner: winner,
                probability: probability,
                totalRounds: expectedRounds,
                overUnder: {
                    line: overUnderLine,
                    prediction: expectedRounds > overUnderLine ? 'over' : 'under',
                    confidence: Math.abs(expectedRounds - overUnderLine) * 10 + 50,
                },
            };
        });
    };
    MatchAnalyzer.prototype.generateOverallPrediction = function (match, team1Stats, team2Stats, mapPredictions) {
        var team1Wins = mapPredictions.filter(function (p) { return p.winner === 'Team 1'; }).length;
        var team2Wins = mapPredictions.length - team1Wins;
        var winner = team1Wins > team2Wins ? match.team1.name : match.team2.name;
        var winnerMaps = Math.max(team1Wins, team2Wins);
        var loserMaps = Math.min(team1Wins, team2Wins);
        var totalMaps = winnerMaps + loserMaps;
        var probability = (winnerMaps / totalMaps) * 100;
        return {
            winner: winner,
            probability: probability,
            totalMaps: totalMaps,
            over2Maps: totalMaps > 2,
            confidence: probability > 60 ? 75 + Math.random() * 15 : 55 + Math.random() * 15,
        };
    };
    MatchAnalyzer.prototype.generateStrengths = function (mapStats, players) {
        var strengths = [];
        var bestMaps = mapStats
            .filter(function (m) { return m.winRate > 60; })
            .sort(function (a, b) { return b.winRate - a.winRate; })
            .slice(0, 2);
        if (bestMaps.length > 0) {
            strengths.push("Strong performance on ".concat(bestMaps.map(function (m) { return m.name; }).join(' and ')));
        }
        var topPlayer = players.sort(function (a, b) { return b.rating - a.rating; })[0];
        if (topPlayer && topPlayer.rating > 1.1) {
            strengths.push("".concat(topPlayer.name, " in excellent form (").concat(topPlayer.rating.toFixed(2), " rating)"));
        }
        var ctMaps = mapStats.filter(function (m) { return m.bestSide === 'CT' && m.ctWinRate > 55; });
        if (ctMaps.length >= 3) {
            strengths.push('Excellent CT-side fundamentals across multiple maps');
        }
        if (strengths.length === 0) {
            strengths.push('Consistent team performance');
            strengths.push('Good map diversity in pool');
        }
        return strengths;
    };
    MatchAnalyzer.prototype.generateWeaknesses = function (mapStats, players) {
        var weaknesses = [];
        var weakMaps = mapStats
            .filter(function (m) { return m.winRate < 45; })
            .sort(function (a, b) { return a.winRate - b.winRate; })
            .slice(0, 2);
        if (weakMaps.length > 0) {
            weaknesses.push("Struggles on ".concat(weakMaps.map(function (m) { return m.name; }).join(' and ')));
        }
        var weakPlayer = players.sort(function (a, b) { return a.rating - b.rating; })[0];
        if (weakPlayer && weakPlayer.rating < 0.95) {
            weaknesses.push("".concat(weakPlayer.name, " needs to improve performance"));
        }
        var tMaps = mapStats.filter(function (m) { return m.bestSide === 'T' && m.tWinRate < 45; });
        if (tMaps.length >= 2) {
            weaknesses.push('T-side execution needs work on several maps');
        }
        if (weaknesses.length === 0) {
            weaknesses.push('Minor inconsistencies in pistol rounds');
            weaknesses.push('Can struggle against aggressive playstyles');
        }
        return weaknesses;
    };
    return MatchAnalyzer;
}());
exports.MatchAnalyzer = MatchAnalyzer;
