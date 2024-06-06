import { Router, Request, Response } from 'express';
import redisClient, { REDIS_KEY } from '../db/redisClient';
import { mongoClient } from '../db/mongoClient';

const router = Router();

router.get('/fetchAllTasks', async (req: Request, res: Response) => {
  try {
    const redisValue = await redisClient.get(REDIS_KEY);
    const tasksInCache: string[] = redisValue ? JSON.parse(redisValue) : [];

    const db = mongoClient.db('assignment');
    const collection = db.collection('assignment_ritik');
    const tasksInDB = await collection.find().toArray();   
    const allTasks = tasksInCache.concat(tasksInDB.map(doc => doc.task));
    res.json(allTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'An error occurred while fetching tasks.' });
  }
});

export default router;
