import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App() {
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [editIndex, setEditIndex] = useState("");
  const [editedTask, setEditedTask] = useState("");
  const [taskWIP, setTaskWIP] = useState('');
  const [taskUpdate, setTaskUpdate] = useState('');

  const handleAddTask = () => {
    let newTask = {
      title: taskTitle,
      description: taskDescription,
      wip: taskWIP,
      update: taskUpdate,
      priority: taskList.length + 1,
    };

    let updatedTaskList = [...taskList, newTask];
    setTaskList(updatedTaskList);
    localStorage.setItem('taskList', JSON.stringify(updatedTaskList));
    setTaskTitle('');
    setTaskDescription('');
    setTaskWIP('');
    setTaskUpdate('');
  };

  const handleDeleteTask = index => {
    let updatedTasks = [...taskList];
    updatedTasks.splice(index, 1);
    updatedTasks = updatedTasks.map((item, idx) => ({ ...item, priority: idx + 1 }));

    localStorage.setItem('taskList', JSON.stringify(updatedTasks));
    setTaskList(updatedTasks);
  };

  const handleCompleteTask = index => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = `${dd}-${mm}-${yyyy} at ${h}:${m}:${s}`;

    let completedTask = {
      ...taskList[index],
      completedOn: completedOn,
    };

    let updatedCompletedTasks = [...completedTasks, completedTask];
    setCompletedTasks(updatedCompletedTasks);
    handleDeleteTask(index);
    localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));
  };

  const handleDeleteCompletedTask = index => {
    let updatedTasks = [...completedTasks];
    updatedTasks.splice(index, 1);

    localStorage.setItem('completedTasks', JSON.stringify(updatedTasks));
    setCompletedTasks(updatedTasks);
  };

  useEffect(() => {
    let savedTasks = JSON.parse(localStorage.getItem('taskList'));
    let savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks'));
    if (savedTasks) {
      setTaskList(savedTasks);
    }

    if (savedCompletedTasks) {
      setCompletedTasks(savedCompletedTasks);
    }
  }, []);

  const handleEditTask = (index, task) => {
    setEditIndex(index);
    setEditedTask(task);
  };

  const handleUpdateTaskTitle = value => {
    setEditedTask(prev => {
      return { ...prev, title: value };
    });
  };

  const handleUpdateTaskDescription = value => {
    setEditedTask(prev => {
      return { ...prev, description: value };
    });
  };

  const handleUpdateTaskWIP = value => {
    setEditedTask(prev => {
      return { ...prev, wip: value };
    });
  };

  const handleUpdateTaskUpdate = value => {
    setEditedTask(prev => {
      return { ...prev, update: value };
    });
  };

  const handleSaveUpdatedTask = () => {
    let updatedTasks = [...taskList];
    updatedTasks[editIndex] = editedTask;
    setTaskList(updatedTasks);
    setEditIndex("");
  };

  const moveTask = (index, direction) => {
    const newTasks = [...taskList];
    const [movedTask] = newTasks.splice(index, 1);
    newTasks.splice(index + direction, 0, movedTask);
    setTaskList(newTasks.map((task, idx) => ({ ...task, priority: idx + 1 })));
  };

  return (
    <div className="App">
      <h1>Track-Tasks</h1>

      <div className="task-wrapper">
        <div className="task-input">
          <div className="task-input-item">
            <label>Title</label>
            <input
              type="text"
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="task-input-item">
            <label>Description</label>
            <input
              type="text"
              value={taskDescription}
              onChange={e => setTaskDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="task-input-item">
            <label>WIP</label>
            <input
              type="text"
              value={taskWIP}
              onChange={e => setTaskWIP(e.target.value)}
              placeholder="What's the work in progress?"
            />
          </div>
          <div className="task-input-item">
            <label>Update</label>
            <input
              type="text"
              value={taskUpdate}
              onChange={e => setTaskUpdate(e.target.value)}
              placeholder="Any updates?"
            />
          </div>
          <div className="task-input-item">
            <button
              type="button"
              onClick={handleAddTask}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondaryBtn ${showCompletedTasks === false && 'active'}`}
            onClick={() => setShowCompletedTasks(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${showCompletedTasks === true && 'active'}`}
            onClick={() => setShowCompletedTasks(true)}
          >
            Completed
          </button>
        </div>

        <div className="task-list">
          {showCompletedTasks === false &&
            taskList.map((task, index) => {
              if (editIndex === index) {
                return (
                  <div className="edit__wrapper" key={index}>
                    <input
                      placeholder="Updated Title"
                      onChange={(e) => handleUpdateTaskTitle(e.target.value)}
                      value={editedTask.title}
                    />
                    <textarea
                      placeholder="Updated Description"
                      rows={4}
                      onChange={(e) => handleUpdateTaskDescription(e.target.value)}
                      value={editedTask.description}
                    />
                    <input
                      placeholder="Updated WIP"
                      onChange={(e) => handleUpdateTaskWIP(e.target.value)}
                      value={editedTask.wip}
                    />
                    <input
                      placeholder="Updated Update"
                      onChange={(e) => handleUpdateTaskUpdate(e.target.value)}
                      value={editedTask.update}
                    />
                    <button
                      type="button"
                      onClick={handleSaveUpdatedTask}
                      className="primaryBtn"
                    >
                      Update
                    </button>
                  </div>
                );
              } else {
                return (
                  <div className="task-list-item" key={index}>
                    <div>
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      <p><strong>WIP:</strong> {task.wip}</p>
                      <p><strong>Update:</strong> {task.update}</p>
                      <p><strong>Priority:</strong> {task.priority}</p>
                    </div>

                    <div>
                      <AiOutlineArrowUp
                        className="icon"
                        onClick={() => moveTask(index, -1)}
                        title="Move Up?"
                      />
                      <AiOutlineArrowDown
                        className="icon"
                        onClick={() => moveTask(index, 1)}
                        title="Move Down?"
                      />
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTask(index)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleCompleteTask(index)}
                        title="Complete?"
                      />
                      <AiOutlineEdit
                        className="check-icon"
                        onClick={() => handleEditTask(index, task)}
                        title="Edit?"
                      />
                    </div>
                  </div>
                );
              }
            })}

          {showCompletedTasks === true &&
            completedTasks.map((task, index) => {
              return (
                <div className="task-list-item" key={index}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p><strong>WIP:</strong> {task.wip}</p>
                    <p><strong>Update:</strong> {task.update}</p>
                    <p className="completed-on">Completed on: {task.completedOn}</p>
                  </div>

                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTask(index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
