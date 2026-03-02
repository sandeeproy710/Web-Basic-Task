import { CATEGORY_LABELS } from './types.js';
class ExpenseManager {
    constructor() {
        this.editingExpenseId = null;
        this.state = this.loadState();
        this.initializeDate();
        this.setupEventListeners();
        this.render();
    }
    loadState() {
        const saved = localStorage.getItem('expenseManagerState');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            expenses: [],
            initialBalance: 5000,
        };
    }
    saveState() {
        localStorage.setItem('expenseManagerState', JSON.stringify(this.state));
    }
    initializeDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('addDate');
        if (dateInput) {
            dateInput.value = today;
        }
    }
    setupEventListeners() {
        const form = document.getElementById('addExpenseForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleAddExpense(e));
        }
        const topUpBtn = document.getElementById('topUpBtn');
        if (topUpBtn) {
            topUpBtn.addEventListener('click', () => this.handleAddBalance());
        }
        const editForm = document.getElementById('updateExpenseForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleUpdateExpense(e));
        }
        const filterSelect = document.getElementById('categoryFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', () => this.render());
        }
        const closeModal = document.getElementById('closePopup');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
        const modal = document.getElementById('updatePopup');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }
    handleAddBalance() {
        const topUpInput = document.getElementById('topUpAmount');
        if (!topUpInput)
            return;
        const amount = parseFloat(topUpInput.value);
        if (!amount || amount <= 0) {
            alert('Enter a valid balance amount');
            return;
        }
        this.state.initialBalance += amount;
        this.saveState();
        topUpInput.value = '';
        this.render();
    }
    handleAddExpense(e) {
        e.preventDefault();
        const amountInput = document.getElementById('addAmount');
        const categorySelect = document.getElementById('addCategory');
        const descriptionInput = document.getElementById('addDescription');
        const dateInput = document.getElementById('addDate');
        const amount = parseFloat(amountInput.value);
        const category = categorySelect.value;
        const description = descriptionInput.value.trim();
        const date = dateInput.value;
        if (!amount || !category || !description || !date) {
            alert('Please fill in all fields');
            return;
        }
        if (amount <= 0) {
            alert('Amount must be greater than 0');
            return;
        }
        const expense = {
            id: this.generateId(),
            amount,
            category,
            description,
            date,
            createdAt: Date.now(),
        };
        this.state.expenses.push(expense);
        this.saveState();
        this.clearForm();
        this.render();
    }
    handleUpdateExpense(e) {
        e.preventDefault();
        if (!this.editingExpenseId)
            return;
        const amountInput = document.getElementById('updateAmount');
        const categorySelect = document.getElementById('updateCategory');
        const descriptionInput = document.getElementById('updateDescription');
        const dateInput = document.getElementById('updateDate');
        const amount = parseFloat(amountInput.value);
        const category = categorySelect.value;
        const description = descriptionInput.value.trim();
        const date = dateInput.value;
        if (!amount || !category || !description || !date) {
            alert('Please fill in all fields');
            return;
        }
        if (amount <= 0) {
            alert('Amount must be greater than 0');
            return;
        }
        const expenseIndex = this.state.expenses.findIndex(e => e.id === this.editingExpenseId);
        if (expenseIndex !== -1) {
            this.state.expenses[expenseIndex] = Object.assign(Object.assign({}, this.state.expenses[expenseIndex]), { amount,
                category,
                description,
                date });
            this.saveState();
            this.closeModal();
            this.render();
        }
    }
    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.state.expenses = this.state.expenses.filter(e => e.id !== id);
            this.saveState();
            this.render();
        }
    }
    openEditModal(id) {
        const expense = this.state.expenses.find(e => e.id === id);
        if (!expense)
            return;
        this.editingExpenseId = id;
        const amountInput = document.getElementById('updateAmount');
        const categorySelect = document.getElementById('updateCategory');
        const descriptionInput = document.getElementById('updateDescription');
        const dateInput = document.getElementById('updateDate');
        amountInput.value = expense.amount.toString();
        categorySelect.value = expense.category;
        descriptionInput.value = expense.description;
        dateInput.value = expense.date;
        const modal = document.getElementById('updatePopup');
        if (modal) {
            modal.classList.add('show');
        }
    }
    closeModal() {
        const modal = document.getElementById('updatePopup');
        if (modal) {
            modal.classList.remove('show');
        }
        this.editingExpenseId = null;
    }
    clearForm() {
        const form = document.getElementById('addExpenseForm');
        if (form) {
            form.reset();
            this.initializeDate();
        }
    }
    calculateTotalExpenditure() {
        return this.state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }
    getAvailableBalance() {
        return this.state.initialBalance - this.calculateTotalExpenditure();
    }
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    }
    formatDate(dateString) {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    getFilteredExpenses() {
        const filterSelect = document.getElementById('categoryFilter');
        const selectedCategory = (filterSelect === null || filterSelect === void 0 ? void 0 : filterSelect.value) || '';
        if (!selectedCategory) {
            return [...this.state.expenses].sort((a, b) => b.createdAt - a.createdAt);
        }
        return this.state.expenses
            .filter(expense => expense.category === selectedCategory)
            .sort((a, b) => b.createdAt - a.createdAt);
    }
    render() {
        this.updateStats();
        this.renderTransactions();
    }
    updateStats() {
        const balanceDisplay = document.getElementById('balanceValue');
        const expenditureDisplay = document.getElementById('spentValue');
        const balance = this.getAvailableBalance();
        const expenditure = this.calculateTotalExpenditure();
        if (balanceDisplay) {
            balanceDisplay.textContent = this.formatCurrency(balance);
        }
        if (expenditureDisplay) {
            expenditureDisplay.textContent = this.formatCurrency(expenditure);
        }
    }
    renderTransactions() {
        const list = document.getElementById('historyList');
        if (!list)
            return;
        const filteredExpenses = this.getFilteredExpenses();
        if (filteredExpenses.length === 0) {
            list.innerHTML = '<p class="empty-text">No transactions yet. Add your first expense!</p>';
            return;
        }
        list.innerHTML = filteredExpenses
            .map(expense => this.createTransactionElement(expense))
            .join('');
        // Attach event listeners to buttons
        filteredExpenses.forEach(expense => {
            const editBtn = document.querySelector(`[data-edit="${expense.id}"]`);
            const deleteBtn = document.querySelector(`[data-delete="${expense.id}"]`);
            if (editBtn) {
                editBtn.addEventListener('click', () => this.openEditModal(expense.id));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteExpense(expense.id));
            }
        });
    }
    createTransactionElement(expense) {
        const categoryLabel = CATEGORY_LABELS[expense.category];
        const formattedAmount = this.formatCurrency(expense.amount);
        const formattedDate = this.formatDate(expense.date);
        return `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-head">
                        <div class="history-desc">${this.escapeHtml(expense.description)}</div>
                        <div class="history-date">${formattedDate}</div>
                    </div>
                    <div class="history-tag">${categoryLabel}</div>
                </div>
                <div class="history-amount">-${formattedAmount}</div>
                <div class="history-actions">
                    <button class="edit-btn" data-edit="${expense.id}">Edit</button>
                    <button class="delete-btn" data-delete="${expense.id}">Delete</button>
                </div>
            </div>
        `;
    }
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
        };
        return text.replace(/[&<>"']/g, char => map[char]);
    }
}
// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExpenseManager();
});
