import { MongoClient } from 'mongodb';

export const mongoClient = new MongoClient('mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@testcluster.6f94f5o.mongodb.net/');

export async function initializeMongo(): Promise<void> {
  await mongoClient.connect();
  console.log('Connected to MongoDB');
}

export async function storeTasksInMongo(tasks: string[]): Promise<void> {
  const db = mongoClient.db('assignment');
  const collection = db.collection('assignment_ritik');
  await collection.insertMany(tasks.map(task => ({ task })));
  console.log('Tasks moved to MongoDB');
}

export async function removeTaskFromMongo(task: string): Promise<void> {
  const db = mongoClient.db('assignment');
  const collection = db.collection('assignment_ritik');
  await collection.deleteOne({ task });
  console.log(`Task "${task}" removed from MongoDB`);
}

export async function updateTaskInMongo(oldTask: string, newTask: string): Promise<void> {
  const db = mongoClient.db('assignment');
  const collection = db.collection('assignment_ritik');
  await collection.updateOne({ task: oldTask }, { $set: { task: newTask } });
  console.log(`Task "${oldTask}" updated to "${newTask}" in MongoDB`);
}
