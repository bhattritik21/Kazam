import { Socket } from 'socket.io';
import redisClient, { REDIS_KEY, MAX_TASKS } from '../db/redisClient';
import { storeTasksInMongo, removeTaskFromMongo, updateTaskInMongo } from '../db/mongoClient';

export default function taskHandlers(socket: Socket) {
  console.log('New client connected');
  
  socket.on('add', async (task: string) => {
    console.log(`Add task: ${task}`);
    const redisValue = await redisClient.get(REDIS_KEY);
    const tasks: string[] = redisValue ? JSON.parse(redisValue) : [];

    tasks.push(task);

    if (tasks.length > MAX_TASKS) {
      await storeTasksInMongo(tasks);
      await redisClient.del(REDIS_KEY);
    } else {
      await redisClient.set(REDIS_KEY, JSON.stringify(tasks));
    }

    socket.emit('taskAdded', task);
  });

  socket.on('remove', async (task: string) => {
    console.log(`Remove task: ${task}`);
    const redisValue = await redisClient.get(REDIS_KEY);
    let tasks: string[] = redisValue ? JSON.parse(redisValue) : [];

    tasks = tasks.filter(t => t !== task);

    await redisClient.set(REDIS_KEY, JSON.stringify(tasks));
    await removeTaskFromMongo(task);

    socket.emit('taskRemoved', task);
  });

  socket.on('update', async ({ oldTask, newTask }) => {
    console.log(`Update task: ${oldTask} to ${newTask}`);
    const redisValue = await redisClient.get(REDIS_KEY);
    let tasks: string[] = redisValue ? JSON.parse(redisValue) : [];

    const taskIndex = tasks.indexOf(oldTask);
    if (taskIndex !== -1) {
      tasks[taskIndex] = newTask;
      await redisClient.set(REDIS_KEY, JSON.stringify(tasks));
    } 
    await updateTaskInMongo(oldTask, newTask);

    socket.emit('taskUpdated', { oldTask, newTask });
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
}
