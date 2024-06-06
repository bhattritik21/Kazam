"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_TASKS = exports.REDIS_KEY = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: 'redis://default:dssYpBnYQrl01GbCGVhVq2e4dYvUrKJB@redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com:12675'
});
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
redisClient.connect().then(() => {
    console.log('Connected to Redis');
});
exports.REDIS_KEY = 'FULLSTACK_TASK_RITIK';
exports.MAX_TASKS = 50;
exports.default = redisClient;
