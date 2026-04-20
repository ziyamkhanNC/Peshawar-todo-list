const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskCount = document.getElementById('taskCount');
const clearCompleted = document.getElementById('clearCompleted');

let tasks = [];
let currentFilter = 'all';

// Load tasks from localStorage
function loadTasks() {
  const savedTasks = localStorage.getItem('peshawarTodos');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  renderTasks();
}

// Save tasks
function saveTasks() {
  localStorage.setItem('peshawarTodos', JSON.stringify(tasks));
}

// Render tasks on screen
function renderTasks() {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // all
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <span class="task-text">${task.title}</span>
      <button class="delete-btn">Delete</button>
    `;

    // Toggle complete
    li.querySelector('input').addEventListener('change', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Delete task
    li.querySelector('.delete-btn').addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  updateTaskCount();
}

// Update count
function updateTaskCount() {
  const remaining = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${remaining} tasks left`;
}

// Add new task
function addTask() {
  const title = taskInput.value.trim();
  if (title === '') return;

  tasks.push({
    id: Date.now(),
    title: title,
    completed: false
  });

  taskInput.value = '';
  saveTasks();
  renderTasks();
}

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Clear all completed
clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

// Event Listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Start the app
loadTasks();