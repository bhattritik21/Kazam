import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { FaCirclePlus } from "react-icons/fa6";
import { MdEventNote } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
const socket = io('http://localhost:5000');

function App() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [editTask, setEditTask] = useState<string>('');
  const [isEditing, setIsEditing] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('taskAdded', (task: string) => {
      console.log('Added task ' + task);
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    socket.on('taskRemoved', (task: string) => {
      setTasks((prevTasks) => prevTasks.filter((t) => t !== task));
    });

    socket.on('taskUpdated', ({ oldTask, newTask }: { oldTask: string; newTask: string }) => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t === oldTask ? newTask : t))
      );
    });

    return () => {
      socket.off('taskAdded');
      socket.off('taskRemoved');
      socket.off('taskUpdated');
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<string[]>('http://localhost:5000/fetchAllTasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      socket.emit('add', newTask);
      setNewTask('');
    }
  };
  const removeTask = (task: string) => {
    socket.emit('remove', task);
  };

  const startEditing = (index: number, task: string) => {
    setIsEditing(index);
    setEditTask(task);
  };

  const saveTask = (oldTask: string) => {
    if (editTask.trim() !== '') {
      socket.emit('update', { oldTask, newTask: editTask });
      setIsEditing(null);
      setEditTask('');
    }
  };

  return (
    <div className='Container h-screen w-70vw mx-auto flex-column items-center justify-center p-10'>
      <h1 className='ml-6 flex items-center text-2xl font-bold'><MdEventNote className='mr-2'/>Note App</h1>
      <div className='Main my-5'>
        <div className="inputTask flex justify-center flex-end">
          <input
            className='inputText p-2 mr-5 w-5/6 border border-gray-200 rounded'
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New Note..."
          />
          <button className='inputBtn px-5 bg-amber-900 text-white rounded flex items-center justify-center' onClick={addTask}> <FaCirclePlus className='mr-2' /> Add</button>
        </div>
        <div className="notes p-6">
          <h1 className='text-lg p-2 border-b-2 border-grey-200 font-bold'>Notes</h1>
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className="Note flex p-2 justify-between items-center border-b-2 border-grey-200">
              {isEditing === index ? (
                <input
                  className='p-2 mr-5 w-5/6 border border-gray-200 rounded'
                  type="text"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                />
              ) : (
                <span>{task}</span>
              )}
              <div>
                {isEditing === index ? (
                  <button className='text-green-500 mr-5' onClick={() => saveTask(task)}><FaSave/></button>
                ) : (
                  <button className='text-blue-500 mr-5' onClick={() => startEditing(index, task)}><MdEdit/></button>
                )}
                <button className='text-red-500' onClick={() => removeTask(task)}><FaTrashAlt/></button>
              </div>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
