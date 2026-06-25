document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskList = document.getElementById('task-list');
    const dateDisplay = document.getElementById('date-display');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Elementos de estadísticas adicionados
    const totalCount = document.getElementById('total-count');
    const pendingCount = document.getElementById('pending-count');
    const completedCount = document.getElementById('completed-count');
    const progressBar = document.getElementById('progress-bar');
    
    const body = document.body;

    // Mostrar fecha de hoy
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const today = new Date();
    dateDisplay.textContent = today.toLocaleDateString('es-ES', options);

    let tasks = [];

    // --- Cambio de Tema ---
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.className = body.classList.contains('dark-mode') ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });

    // --- Lógica de Estadísticas ---
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;

        // Inyectar valores en el HTML
        totalCount.textContent = total;
        pendingCount.textContent = pending;
        completedCount.textContent = completed;

        // Calcular porcentaje de la barra de progreso
        const progressPercentage = total === 0 ? 0 : (completed / total) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    // --- Formateador de Fecha de Tarea ---
    function formatTaskDate(dateTimeString) {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toLocaleString('es-ES', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    // --- Renderizar Tareas ---
    function renderTasks() {
        taskList.innerHTML = '';
        const now = new Date();
        
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            const isOverdue = new Date(task.date) < now;
            
            li.className = `task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
            
            li.innerHTML = `
                <div class="task-content" data-index="${index}">
                    <span class="task-text">${task.text}</span>
                    <span class="task-time">
                        <i class="fa-regular fa-clock"></i> ${formatTaskDate(task.date)}
                    </span>
                </div>
                <button class="delete-btn" data-index="${index}">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            `;

            li.querySelector('.task-content').addEventListener('click', () => {
                toggleTask(index);
            });

            li.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(index);
            });

            taskList.appendChild(li);
        });

        // Ejecutar actualización de estadísticas cada vez que se renderizan cambios
        updateStats();
    }

    // --- Guardar Tarea ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        const date = taskDate.value;
        
        if (text !== '' && date !== '') {
            tasks.push({ 
                text: text, 
                date: date, 
                completed: false 
            });
            
            taskInput.value = '';
            taskDate.value = '';
            
            renderTasks();
        }
    });

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    // Refrescar para estados vencidos
    setInterval(renderTasks, 60000);
});