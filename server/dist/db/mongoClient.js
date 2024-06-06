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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskInMongo = exports.removeTaskFromMongo = exports.storeTasksInMongo = exports.initializeMongo = exports.mongoClient = void 0;
const mongodb_1 = require("mongodb");
exports.mongoClient = new mongodb_1.MongoClient('mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@testcluster.6f94f5o.mongodb.net/');
function initializeMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.mongoClient.connect();
        console.log('Connected to MongoDB');
    });
}
exports.initializeMongo = initializeMongo;
function storeTasksInMongo(tasks) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = exports.mongoClient.db('assignment');
        const collection = db.collection('assignment_ritik');
        yield collection.insertMany(tasks.map(task => ({ task })));
        console.log('Tasks moved to MongoDB');
    });
}
exports.storeTasksInMongo = storeTasksInMongo;
function removeTaskFromMongo(task) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = exports.mongoClient.db('assignment');
        const collection = db.collection('assignment_ritik');
        yield collection.deleteOne({ task });
        console.log(`Task "${task}" removed from MongoDB`);
    });
}
exports.removeTaskFromMongo = removeTaskFromMongo;
function updateTaskInMongo(oldTask, newTask) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = exports.mongoClient.db('assignment');
        const collection = db.collection('assignment_ritik');
        yield collection.updateOne({ task: oldTask }, { $set: { task: newTask } });
        console.log(`Task "${oldTask}" updated to "${newTask}" in MongoDB`);
    });
}
exports.updateTaskInMongo = updateTaskInMongo;
