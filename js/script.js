document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const dateDisplay = document.getElementById('date-display');

    // Mostrar fecha actual en formato local
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const today = new Date();
    dateDisplay.textContent = today.toLocaleDateString('es-ES', options);

    // Arreglo para almacenar tareas (opcionalmente podrías conectar LocalStorage aquí)
    let tasks = [];

    // Función para renderizar las tareas en el HTML
    function renderTasks() {
        taskList.innerHTML = '';
        
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" data-index="${index}">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            `;

            // Evento para marcar como completada al hacer click en el texto
            li.querySelector('.task-text').addEventListener('click', () => {
                toggleTask(index);
            });

            // Evento para eliminar la tarea
            li.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // Evita conflictos con el click del contenedor
                deleteTask(index);
            });

            taskList.appendChild(li);
        });
    }

    // Agregar nueva tarea
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        
        if (text !== '') {
            tasks.push({ text: text, completed: false });
            taskInput.value = '';
            renderTasks();
        }
    });

    // Cambiar estado de la tarea
    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }

    // Eliminar tarea
    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }
});