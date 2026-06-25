const STORAGE_KEY = 'tasks';
const form = document.querySelector('#taskForm');
const list = document.querySelector('#tasks');
const filterButtons = document.querySelectorAll('[data-filter]');

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let filter = 'all';

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function visibleTasks() {
  if (filter === 'active') return tasks.filter(task => !task.done);
  if (filter === 'completed') return tasks.filter(task => task.done);
  return tasks;
}

function render() {
  list.innerHTML = visibleTasks().map(task => `
    <article class="task ${task.done ? 'done' : ''}">
      <div>
        <h3>${task.title}</h3>
        <div class="meta">${task.priority} priority${task.due ? ` · Due ${task.due}` : ''}</div>
      </div>
      <button data-id="${task.id}">${task.done ? 'Reopen' : 'Complete'}</button>
    </article>
  `).join('') || '<p>No tasks here yet.</p>';
}

form.addEventListener('submit', event => {
  event.preventDefault();
  tasks.unshift({
    id: crypto.randomUUID(),
    title: form.title.value.trim(),
    priority: form.priority.value,
    due: form.due.value,
    done: false
  });
  save();
  form.reset();
  render();
});

list.addEventListener('click', event => {
  const id = event.target.dataset.id;
  if (!id) return;
  tasks = tasks.map(task => task.id === id ? {...task, done: !task.done} : task);
  save();
  render();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    filter = button.dataset.filter;
    render();
  });
});

render();
