document.addEventListener('DOMContentLoaded', () => {
    const todoTasksContainer = document.getElementById('todo-tasks');
    const inprogressTasksContainer = document.getElementById('inprogress-tasks');
    const completedTasksContainer = document.getElementById('completed-tasks');
    const overdueTasksContainer = document.getElementById('overdue-tasks');
    const token = localStorage.getItem('token');
    const addTaskModal = document.getElementById('add-task-modal');
    const closeAddTaskModalBtn = document.getElementById('close-add-task-modal');
    const addTaskForm = document.getElementById('add-task-form');
    const errorPopup = document.getElementById('error-popup');
    const closeErrorPopup = document.getElementById('close-error-popup');
    const errorMessageDisplay = document.getElementById('error-message');
    const newTaskLink = document.getElementById('new-task-link');
    const calendarLink = document.getElementById('calendar-link');
    const calendarEl = document.getElementById('calendar');
    const kanbanSection = document.getElementById('kanban-section');
    const calendarSection = document.getElementById('calendar-section');

    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    let allTodos = [];//will be used later maybe
    let calendarInitialized = false;

    function fetchAndDisplayTodos() {
        return fetch('http://localhost:3000/api/todos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = 'auth.html';
                    } else {
                        return response.json().then(data => {
                            throw new Error(data.message || 'Failed to load todos');
                        });
                    }
                }
                return response.json();
            }).then(data => {
                if (data && data.todos) {
                    allTodos = data.todos;
                    clearKanbanBoard();
                    data.todos.forEach(todo => {
                        const taskCard = createTaskCard(todo);
                        placeTaskCard(taskCard, todo);
                    });
                    updateKanbanCounts();
                    initializeDragAndDrop();
                    updateCalendarEvents();
                    return data.todos;
                } 
                else{
                    console.log('No todos found for this user.');
                    allTodos = [];
                    clearKanbanBoard();
                    updateKanbanCounts();
                    updateCalendarEvents();
                    return [];
                }
            })
            .catch(error => {
                console.error('Error loading todos:', error);
                showError('Failed to load initial tasks. Please refresh the page.');
            });
    }

    function clearKanbanBoard() {
        if (todoTasksContainer) todoTasksContainer.innerHTML = '';
        if (inprogressTasksContainer) inprogressTasksContainer.innerHTML = '';
        if (completedTasksContainer) completedTasksContainer.innerHTML = '';
        if (overdueTasksContainer) overdueTasksContainer.innerHTML = '';
    }

    function placeTaskCard(taskCard, todo) {
        if (!taskCard) return;
        if (todo.status === 'completed' && completedTasksContainer) {
            completedTasksContainer.appendChild(taskCard);
        } else if (todo.status === 'overdue' && overdueTasksContainer) {
            overdueTasksContainer.appendChild(taskCard);
        } else if (todo.status === 'inprogress' && inprogressTasksContainer) {
            inprogressTasksContainer.appendChild(taskCard);
        } else if (todoTasksContainer) {
            todoTasksContainer.appendChild(taskCard);
        }
    }

    function createTaskCard(todo) {
        const card = document.createElement('div');
        card.classList.add('task-card');
        card.dataset.todoId = todo._id;

        const title = document.createElement('h4');
        title.textContent = todo.title;

        const description = document.createElement('p');
        description.classList.add('description');
        description.textContent = todo.description;

        
        const priorityContainer = document.createElement('div');
        priorityContainer.classList.add('priority-container');

        
        const priorityTag = document.createElement('span');
        priorityTag.classList.add('priority-tag');
        priorityTag.textContent = todo.priority;
        if (todo.priority === 'high') {
            priorityTag.classList.add('priority-high');
        } else if (todo.priority === 'medium') {
            priorityTag.classList.add('priority-medium');
        } else {
            priorityTag.classList.add('priority-low');
        }
        priorityContainer.appendChild(priorityTag);

        const dueDateContainer = document.createElement('div');
        dueDateContainer.classList.add('due-date-container');
        const calendarIcon = document.createElement('img');  
        calendarIcon.classList.add('calendar-icon');
        calendarIcon.src = './assets/icons/calendar2.png'; 
        calendarIcon.alt = 'Due Date'; 

        const dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = todo.dueDate ? moment(todo.dueDate).format('DD-MM-YYYY') : '';

        dueDateContainer.appendChild(calendarIcon);
        dueDateContainer.appendChild(dueDateSpan);

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(priorityContainer);
        card.appendChild(dueDateContainer);

        return card;
    }

    function updateKanbanCounts() {
        const todoCountOverview = document.querySelector('.overview-board .overview-column:nth-child(1) p:nth-child(2)');
        const todoCountKanbanSpan = document.querySelector('.kanban-column.todo .kanban-column-title-container h2 span.todo-count');
        const todoCountKanbanHeader = document.querySelector('.kanban-column.todo .kanban-column-title-container h2');
        const inprogressCountOverview = document.querySelector('.overview-board .overview-column:nth-child(2) p:nth-child(2)');
        const inprogressCountKanbanSpan = document.querySelector('.kanban-column.inprogress .kanban-column-title-container h2 span.in-progress-count');
        const inprogressCountKanbanHeader = document.querySelector('.kanban-column.inprogress .kanban-column-title-container h2');
        const completedCountOverview = document.querySelector('.overview-board .overview-column:nth-child(3) p:nth-child(2)');
        const completedCountKanbanSpan = document.querySelector('.kanban-column.completed .kanban-column-title-container h2 span.completed-count');
        const completedCountKanbanHeader = document.querySelector('.kanban-column.completed .kanban-column-title-container h2');
        const overdueCountOverview = document.querySelector('.overview-board .overview-column:nth-child(4) p:nth-child(2)');
        const overdueCountKanbanSpan = document.querySelector('.kanban-column.overdue .kanban-column-title-container h2 span.overdue-count');
        const overdueCountKanbanHeader = document.querySelector('.kanban-column.overdue .kanban-column-title-container h2');

        if (todoCountOverview) todoCountOverview.textContent = todoTasksContainer ? todoTasksContainer.children.length : 0;
        if (todoCountKanbanSpan) todoCountKanbanSpan.textContent = todoTasksContainer ? todoTasksContainer.children.length : 0;
        if (todoCountKanbanHeader) todoCountKanbanHeader.textContent = todoTasksContainer ? `To Do (${todoTasksContainer.children.length})` : 'To Do (0)';
        if (inprogressCountOverview) inprogressCountOverview.textContent = inprogressTasksContainer ? inprogressTasksContainer.children.length : 0;
        if (inprogressCountKanbanSpan) inprogressCountKanbanSpan.textContent = inprogressTasksContainer ? inprogressTasksContainer.children.length : 0;
        if (inprogressCountKanbanHeader) inprogressCountKanbanHeader.textContent = inprogressTasksContainer ? `In Progress (${inprogressTasksContainer.children.length})` : 'In Progress (0)';
        if (completedCountOverview) completedCountOverview.textContent = completedTasksContainer ? completedTasksContainer.children.length : 0;
        if (completedCountKanbanSpan) completedCountKanbanSpan.textContent = completedTasksContainer ? completedTasksContainer.children.length : 0;
        if (completedCountKanbanHeader) completedCountKanbanHeader.textContent = completedTasksContainer ? `Completed (${completedTasksContainer.children.length})` : 'Completed (0)';
        if (overdueCountOverview) overdueCountOverview.textContent = overdueTasksContainer ? overdueTasksContainer.children.length : 0;
        if (overdueCountKanbanSpan) overdueCountKanbanSpan.textContent = overdueTasksContainer ? overdueTasksContainer.children.length : 0;
        if (overdueCountKanbanHeader) overdueCountKanbanHeader.textContent = overdueTasksContainer ? `Overdue (${overdueTasksContainer.children.length})` : 'Overdue (0)';
    }

    function checkOverdueTasks() {
        const now = moment();
        if (allTodos) {
            allTodos.forEach(todo => {
                if (todo.dueDate && moment(todo.dueDate).isBefore(now, 'day') && todo.status !== 'completed' && todo.status !== 'overdue') {
                    updateTaskStatus(todo._id, 'overdue');
                }
            });
        }
    }

    function updateTaskStatus(todoId, newStatus) {
        fetch(`http://localhost:3000/api/todos/${todoId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Failed to fetch task details');
                    });
                }
                return response.json();
            }).then(data => {
                if (data && data.todo) {
                    const currentTodoData = data.todo;
                    const updatedTodoData = {
                        ...currentTodoData,
                        status: newStatus
                    };
                    fetch(`http://localhost:3000/api/todos/${todoId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedTodoData)
                    }).then(response => {
                            if (!response.ok) {
                                return response.json().then(data => {
                                    throw new Error(data.message || 'Failed to update task status');
                                });
                            }
                            return response.json();
                        }).then(data => {
                            if (data && data.todo) {
                                const updatedTodo = data.todo;
                                const index = allTodos.findIndex(t => t._id === todoId);
                                if (index !== -1) {
                                    allTodos[index] = updatedTodo;
                                }
                                const taskCard = document.querySelector(`[data-todo-id="${todoId}"]`);
                                if (taskCard) {
                                    taskCard.remove();
                                    placeTaskCard(taskCard, updatedTodo);
                                    updateKanbanCounts();
                                }
                                updateCalendarEvents();
                            }
                        })
                        .catch(error => {
                            console.error('Error updating task status:', error);
                            showError('Failed to update task status. Please try again.');
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching task details:', error);
                showError('Failed to fetch task details. Please try again.');
            });
    }

    function showError(message) {
        errorMessageDisplay.textContent = message;
        errorPopup.style.display = "block";
    }

    closeErrorPopup.addEventListener('click', () => {
        errorPopup.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target === errorPopup) {
            errorPopup.style.display = "none";
        }
    });

    newTaskLink.addEventListener('click', () => {
        addTaskModal.style.display = 'flex';
    });

    closeAddTaskModalBtn.addEventListener('click', () => {
        addTaskModal.style.display = 'none';
        addTaskForm.reset();
    });

    window.addEventListener('click', (event)=>{
        if (event.target === addTaskModal) {
            addTaskModal.style.display = 'none';
            addTaskForm.reset();
        }
    });

    addTaskForm.addEventListener('submit', (event)=>{
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const category = document.getElementById('category').value.trim();
        const priority = document.getElementById('priority').value;
        const dueDate = document.getElementById('dueDate').value;
        const status = 'todo';

        if (!title) {
            showError('Please enter a title for the task.');
            return;
        }
        if (!description) {
            showError('Please enter a description for the task.');
            return;
        }

        const newTodoData = {
            title,
            description,
            category,
            priority,
            dueDate,
            status,
        };

        fetch('http://localhost:3000/api/todos', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodoData),
        }).then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Failed to create new task');
                    });
                }
                return response.json();
            }).then(data => {
                if (data && data.todo) {
                    const newTodo = data.todo;
                    allTodos.push(newTodo);
                    const newTaskCard = createTaskCard(newTodo);
                    placeTaskCard(newTaskCard, newTodo);
                    updateKanbanCounts();
                    addTaskModal.style.display = 'none';
                    addTaskForm.reset();
                    updateCalendarEvents();
                } else {
                    showError('Failed to create new task.  Please try again.');
                }
            }).catch(error => {
                console.error('Error creating new task:', error);
                showError('An error occurred while creating the task. Please try again.');
            });
    });

    function initializeDragAndDrop() {
        if (!todoTasksContainer || !inprogressTasksContainer || !completedTasksContainer || !overdueTasksContainer) return;
        Sortable.create(todoTasksContainer, {
            group: 'shared',
            onEnd: handleDragEnd,
        });

        Sortable.create(inprogressTasksContainer, {
            group: 'shared',
            onEnd: handleDragEnd,
        });

        Sortable.create(completedTasksContainer, {
            group: 'shared',
            onEnd: handleDragEnd,
        });

        Sortable.create(overdueTasksContainer, {
            group: 'shared',
            onEnd: handleDragEnd,
        });

        function handleDragEnd(event) {
            const itemEl = event.item;
            const toEl = event.to;
            const todoId = itemEl.dataset.todoId;

            let newStatus = '';
            if (toEl === todoTasksContainer) {
                newStatus = 'todo';
            } else if (toEl === inprogressTasksContainer) {
                newStatus = 'inprogress';
            } else if (toEl === completedTasksContainer) {
                newStatus = 'completed';
            } else if (toEl === overdueTasksContainer) {
                newStatus = 'overdue';
            }
            updateTaskStatus(todoId, newStatus);
        }
    }

    function formatEvents() {
        return allTodos
            .filter(todo => todo.dueDate)
            .map(todo => ({
                title: todo.title,
                start: todo.dueDate,
                end: todo.dueDate,
                description: todo.description,
                color: getPriorityColor(todo.priority),
            }));
    }

    function getPriorityColor(priority) {
        switch (priority) {
            case 'high':
                return '#490000';
            case 'medium':
                return '#F9A825';
            case 'low':
                return '#8BC34A';
            default:
                return '#607D8B';
        }
    }

    function initializeCalendar() {
        $(document).ready(function () {
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                navLinks: true,
                editable: false,
                eventLimit: true,

            });
            calendarInitialized = true;
            fetchAndDisplayTodos()
                .then(todos => {
                    $('#calendar').fullCalendar('removeEvents');
                    $('#calendar').fullCalendar('addEventSource', formatEvents());
                    $('#calendar').fullCalendar('rerenderEvents');
                })
                .catch(error => {
                    console.error("Error initializing calendar:", error);
                    showError("Failed to initialize the calendar. Please try again.");
                });
        });
    }



    function updateCalendarEvents() {
        $(document).ready(function () {
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('addEventSource', formatEvents());
            $('#calendar').fullCalendar('rerenderEvents');
        });
    }

    // Event listener for the calendar link
    calendarLink.addEventListener('click', () => {
        if (!calendarInitialized) {
            initializeCalendar();
            calendarSection.style.display = 'block';
            kanbanSection.style.display = 'none';
        } else {
            updateCalendarEvents();
            calendarSection.style.display = 'block';
            kanbanSection.style.display = 'none';
        }
    });


    initializeCalendar();
    kanbanSection.style.display = 'block';
    calendarSection.style.display = 'none';

    setInterval(checkOverdueTasks, 1800000);
});
