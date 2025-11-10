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
exports.HLTVScraper = void 0;
var cheerio = require("cheerio");
var browserless_1 = require("./browserless");
var scraperapi_1 = require("./scraperapi");
var HLTVScraper = /** @class */ (function () {
    function HLTVScraper() {
        this.browserless = new browserless_1.BrowserlessScraper();
        this.scraperApi = new scraperapi_1.ScraperApiClient();
    }
    HLTVScraper.prototype.getMatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            var html, $_1, matches_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('[HLTV] Fetching matches...');
                        return [4 /*yield*/, this.scraperApi.scrape('https://www.hltv.org/matches')];
                    case 1:
                        html = _a.sent();
                        $_1 = cheerio.load(html);
                        matches_1 = [];
                        $_1('.upcomingMatch, .liveMatch').each(function (_, element) {
                            try {
                                var $match = $_1(element);
                                var matchUrl = $match.find('a.match').attr('href');
                                var matchId = (matchUrl === null || matchUrl === void 0 ? void 0 : matchUrl.split('/')[2]) || "match_".concat(Date.now(), "_").concat(Math.random());
                                var team1Name = $match.find('.matchTeam:first .matchTeamName').text().trim();
                                var team2Name = $match.find('.matchTeam:last .matchTeamName').text().trim();
                                var team1Logo = $match.find('.matchTeam:first img').attr('src') || '';
                                var team2Logo = $match.find('.matchTeam:last img').attr('src') || '';
                                var event_1 = $match.find('.matchEvent').text().trim();
                                var timeElement = $match.find('.matchTime, .matchMeta').text().trim();
                                var isLive = $match.hasClass('liveMatch');
                                var format = $match.find('.matchMeta').text().includes('bo3') ? 'BO3' :
                                    $match.find('.matchMeta').text().includes('bo1') ? 'BO1' : 'BO3';
                                var match = {
                                    id: matchId,
                                    team1: {
                                        id: "team_".concat(team1Name.toLowerCase().replace(/\s/g, '_')),
                                        name: team1Name || 'TBD',
                                        logo: team1Logo.startsWith('http') ? team1Logo : "https://www.hltv.org".concat(team1Logo),
                                        ranking: 0,
                                        winRate: 0,
                                        recentForm: [],
                                    },
                                    team2: {
                                        id: "team_".concat(team2Name.toLowerCase().replace(/\s/g, '_')),
                                        name: team2Name || 'TBD',
                                        logo: team2Logo.startsWith('http') ? team2Logo : "https://www.hltv.org".concat(team2Logo),
                                        ranking: 0,
                                        winRate: 0,
                                        recentForm: [],
                                    },
                                    status: isLive ? 'live' : 'upcoming',
                                    startTime: _this.parseMatchTime(timeElement),
                                    event: event_1 || 'Unknown Event',
                                    format: format,
                                    hltvUrl: matchUrl ? "https://www.hltv.org".concat(matchUrl) : undefined,
                                };
                                if (isLive) {
                                    var score1 = $match.find('.matchTeam:first .matchTeamScore').text().trim();
                                    var score2 = $match.find('.matchTeam:last .matchTeamScore').text().trim();
                                    if (score1 && score2) {
                                        match.currentScore = {
                                            team1: parseInt(score1) || 0,
                                            team2: parseInt(score2) || 0,
                                        };
                                    }
                                }
                                if (match.team1.name && match.team2.name) {
                                    matches_1.push(match);
                                }
                            }
                            catch (error) {
                                console.error('[HLTV] Error parsing match:', error);
                            }
                        });
                        console.log("[HLTV] Found ".concat(matches_1.length, " matches"));
                        return [2 /*return*/, matches_1];
                    case 2:
                        error_1 = _a.sent();
                        console.error('[HLTV] Error fetching matches:', error_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HLTVScraper.prototype.getMatchDetails = function (matchUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $_2, details_1, streamLink, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("[HLTV] Fetching match details: ".concat(matchUrl));
                        return [4 /*yield*/, this.scraperApi.scrape(matchUrl)];
                    case 1:
                        html = _a.sent();
                        $_2 = cheerio.load(html);
                        details_1 = {
                            maps: [],
                            stream: '',
                            vetos: [],
                        };
                        $_2('.mapholder .mapname').each(function (_, el) {
                            var mapName = $_2(el).text().trim();
                            if (mapName) {
                                details_1.maps.push(mapName);
                            }
                        });
                        streamLink = $_2('.stream-box a').attr('href');
                        if (streamLink) {
                            details_1.stream = streamLink;
                        }
                        return [2 /*return*/, details_1];
                    case 2:
                        error_2 = _a.sent();
                        console.error('[HLTV] Error fetching match details:', error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HLTVScraper.prototype.getTeamStats = function (teamName) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, html, $, teamUrl, teamHtml, $team_1, stats_1, rankingText, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log("[HLTV] Fetching team stats: ".concat(teamName));
                        searchUrl = "https://www.hltv.org/search?term=".concat(encodeURIComponent(teamName));
                        return [4 /*yield*/, this.scraperApi.scrape(searchUrl)];
                    case 1:
                        html = _a.sent();
                        $ = cheerio.load(html);
                        teamUrl = $('.search-result .teams a').first().attr('href');
                        if (!teamUrl) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.scraperApi.scrape("https://www.hltv.org".concat(teamUrl))];
                    case 2:
                        teamHtml = _a.sent();
                        $team_1 = cheerio.load(teamHtml);
                        stats_1 = {
                            ranking: 0,
                            winRate: 0,
                            recentForm: [],
                            roster: [],
                            mapStats: [],
                        };
                        rankingText = $team_1('.profile-team-stat .ranking').text();
                        stats_1.ranking = parseInt(rankingText.replace(/[^0-9]/g, '')) || 0;
                        $team_1('.bodyshot-team a').each(function (_, el) {
                            var playerName = $team_1(el).find('.text-ellipsis').text().trim();
                            if (playerName) {
                                stats_1.roster.push(playerName);
                            }
                        });
                        $team_1('.past-matches .result').each(function (_, el) {
                            var result = $team_1(el).hasClass('won') ? 'W' : 'L';
                            stats_1.recentForm.push(result);
                        });
                        return [2 /*return*/, stats_1];
                    case 3:
                        error_3 = _a.sent();
                        console.error("[HLTV] Error fetching team stats for ".concat(teamName, ":"), error_3);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    HLTVScraper.prototype.getNews = function (teamNames) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $_3, news_1, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('[HLTV] Fetching news...');
                        return [4 /*yield*/, this.scraperApi.scrape('https://www.hltv.org/news')];
                    case 1:
                        html = _a.sent();
                        $_3 = cheerio.load(html);
                        news_1 = [];
                        $_3('.news-item').each(function (_, element) {
                            try {
                                var $item = $_3(element);
                                var title_1 = $item.find('.newstext').text().trim();
                                var link = $item.find('a').attr('href');
                                var timestamp = $item.find('.newsrecent').text().trim();
                                var isRelevant = teamNames.some(function (team) {
                                    return title_1.toLowerCase().includes(team.toLowerCase());
                                });
                                if (isRelevant && title_1 && link) {
                                    news_1.push({
                                        id: link.split('/').pop() || "news_".concat(Date.now()),
                                        timestamp: _this.parseNewsTime(timestamp),
                                        title: title_1,
                                        content: title_1,
                                        importance: _this.calculateImportance(title_1),
                                        source: 'HLTV',
                                    });
                                }
                            }
                            catch (error) {
                                console.error('[HLTV] Error parsing news item:', error);
                            }
                        });
                        console.log("[HLTV] Found ".concat(news_1.length, " relevant news items"));
                        return [2 /*return*/, news_1.slice(0, 10)];
                    case 2:
                        error_4 = _a.sent();
                        console.error('[HLTV] Error fetching news:', error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HLTVScraper.prototype.parseMatchTime = function (timeStr) {
        try {
            var now = new Date();
            if (timeStr.includes(':')) {
                var _a = timeStr.split(':').map(Number), hours = _a[0], minutes = _a[1];
                var matchDate = new Date(now);
                matchDate.setHours(hours, minutes, 0, 0);
                if (matchDate < now) {
                    matchDate.setDate(matchDate.getDate() + 1);
                }
                return matchDate.toISOString();
            }
            return now.toISOString();
        }
        catch (error) {
            return new Date().toISOString();
        }
    };
    HLTVScraper.prototype.parseNewsTime = function (timeStr) {
        try {
            var now = new Date();
            if (timeStr.includes('hour')) {
                var hours = parseInt(timeStr);
                return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
            }
            if (timeStr.includes('minute')) {
                var minutes = parseInt(timeStr);
                return new Date(now.getTime() - minutes * 60 * 1000).toISOString();
            }
            return now.toISOString();
        }
        catch (error) {
            return new Date().toISOString();
        }
    };
    HLTVScraper.prototype.calculateImportance = function (title) {
        var highKeywords = ['roster', 'change', 'signs', 'leaves', 'benched', 'standin'];
        var mediumKeywords = ['practice', 'bootcamp', 'interview', 'statement'];
        var titleLower = title.toLowerCase();
        if (highKeywords.some(function (keyword) { return titleLower.includes(keyword); })) {
            return 'high';
        }
        if (mediumKeywords.some(function (keyword) { return titleLower.includes(keyword); })) {
            return 'medium';
        }
        return 'low';
    };
    return HLTVScraper;
}());
exports.HLTVScraper = HLTVScraper;
