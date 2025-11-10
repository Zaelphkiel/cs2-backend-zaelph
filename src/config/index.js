"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    browserlessApiKey: process.env.BROWSERLESS_API_KEY || '',
    scraperApiKey: process.env.SCRAPER_API_KEY || '',
    nodeEnv: process.env.NODE_ENV || 'development',
    browserlessUrl: 'https://chrome.browserless.io',
    scraperApiUrl: 'https://api.scraperapi.com',
};
if (!exports.config.browserlessApiKey) {
    console.warn('WARNING: BROWSERLESS_API_KEY not set');
}
if (!exports.config.scraperApiKey) {
    console.warn('WARNING: SCRAPER_API_KEY not set');
}
console.log('Config loaded:', {
    port: exports.config.port,
    nodeEnv: exports.config.nodeEnv,
    browserlessConfigured: !!exports.config.browserlessApiKey,
    scraperApiConfigured: !!exports.config.scraperApiKey,
});
