"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisClient_1 = __importStar(require("../db/redisClient"));
const mongoClient_1 = require("../db/mongoClient");
function taskHandlers(socket) {
    console.log('New client connected');
    socket.on('add', (task) => __awaiter(this, void 0, void 0, function* () {
        console.log(`Add task: ${task}`);
        const redisValue = yield redisClient_1.default.get(redisClient_1.REDIS_KEY);
        const tasks = redisValue ? JSON.parse(redisValue) : [];
        tasks.push(task);
        if (tasks.length > redisClient_1.MAX_TASKS) {
            yield (0, mongoClient_1.storeTasksInMongo)(tasks);
            yield redisClient_1.default.del(redisClient_1.REDIS_KEY);
        }
        else {
            yield redisClient_1.default.set(redisClient_1.REDIS_KEY, JSON.stringify(tasks));
        }
        socket.emit('taskAdded', task);
    }));
    socket.on('remove', (task) => __awaiter(this, void 0, void 0, function* () {
        console.log(`Remove task: ${task}`);
        const redisValue = yield redisClient_1.default.get(redisClient_1.REDIS_KEY);
        let tasks = redisValue ? JSON.parse(redisValue) : [];
        tasks = tasks.filter(t => t !== task);
        yield redisClient_1.default.set(redisClient_1.REDIS_KEY, JSON.stringify(tasks));
        yield (0, mongoClient_1.removeTaskFromMongo)(task);
        socket.emit('taskRemoved', task);
    }));
    socket.on('update', (_a) => __awaiter(this, [_a], void 0, function* ({ oldTask, newTask }) {
        console.log(`Update task: ${oldTask} to ${newTask}`);
        const redisValue = yield redisClient_1.default.get(redisClient_1.REDIS_KEY);
        let tasks = redisValue ? JSON.parse(redisValue) : [];
        const taskIndex = tasks.indexOf(oldTask);
        if (taskIndex !== -1) {
            tasks[taskIndex] = newTask;
            yield redisClient_1.default.set(redisClient_1.REDIS_KEY, JSON.stringify(tasks));
        }
        yield (0, mongoClient_1.updateTaskInMongo)(oldTask, newTask);
        socket.emit('taskUpdated', { oldTask, newTask });
    }));
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
}
exports.default = taskHandlers;
