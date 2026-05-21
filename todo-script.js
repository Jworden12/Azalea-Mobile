// To-Do List Application with Local Storage
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageKey = 'todoList';
        
        // DOM Elements
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        
        // Initialize
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // Add task
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Clear buttons
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.filter-btn').classList.add('active');
                this.currentFilter = e.target.closest('.filter-btn').dataset.filter;
                this.render();
            });
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (!text) {
            this.showNotification('Please enter a task');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: 'medium',
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.todoInput.value = '';
        this.saveToStorage();
        this.render();
        this.showNotification('Task added successfully!');
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToStorage();
        this.render();
        this.showNotification('Task deleted');
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    togglePriority(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const priorities = ['low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(todo.priority);
            todo.priority = priorities[(currentIndex + 1) % priorities.length];
            this.saveToStorage();
            this.render();
        }
    }

    clearCompleted() {
        if (confirm('Clear all completed tasks?')) {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveToStorage();
            this.render();
            this.showNotification('Completed tasks cleared');
        }
    }

    clearAll() {
        if (confirm('Are you sure? This will delete ALL tasks permanently!')) {
            this.todos = [];
            this.saveToStorage();
            this.render();
            this.showNotification('All tasks cleared');
        }
    }

    getFilteredTodos() {
        switch(this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('remainingTasks').textContent = remaining;

        // Update filter counts
        document.getElementById('countAll').textContent = total;
        document.getElementById('countActive').textContent = this.todos.filter(t => !t.completed).length;
        document.getElementById('countCompleted').textContent = completed;
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        // Clear list
        this.todoList.innerHTML = '';

        // Render todos
        if (filteredTodos.length === 0) {
            this.emptyState.classList.remove('hidden');
        } else {
            this.emptyState.classList.add('hidden');
            
            filteredTodos.forEach(todo => {
                const li = this.createTodoElement(todo);
                this.todoList.appendChild(li);
            });
        }

        // Update stats
        this.updateStats();
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                ${todo.completed ? 'checked' : ''}
            >
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <span class="priority-badge priority-${todo.priority}">${this.capitalize(todo.priority)}</span>
            <button class="delete-btn">Delete</button>
        `;

        // Add event listeners
        const checkbox = li.querySelector('.checkbox');
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

        const priorityBadge = li.querySelector('.priority-badge');
        priorityBadge.addEventListener('click', () => {
            this.togglePriority(todo.id);
        });
        priorityBadge.style.cursor = 'pointer';

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        return li;
    }

    // Local Storage Methods
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving to storage:', error);
            this.showNotification('Error saving tasks');
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.todos = JSON.parse(stored);
                // Validate data
                if (!Array.isArray(this.todos)) {
                    this.todos = [];
                    throw new Error('Invalid data format');
                }
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
            this.todos = [];
            localStorage.removeItem(this.storageKey);
            this.showNotification('Restored to empty list (corrupted data)');
        }
    }

    // Utility Methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});