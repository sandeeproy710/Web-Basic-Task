import { Expense, Category, CATEGORY_LABELS, AppState } from './types.js';

class ExpenseManager {
    private state: AppState;
    private editingExpenseId: string | null = null;

    constructor() {
        this.state = this.loadState();
        this.initializeDate();
        this.setupEventListeners();
        this.render();
    }

    private loadState(): AppState {
        const saved = localStorage.getItem('expenseManagerState');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            expenses: [],
            initialBalance: 5000,
        };
    }

    private saveState(): void {
        localStorage.setItem('expenseManagerState', JSON.stringify(this.state));
    }

    private initializeDate(): void {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('addDate') as HTMLInputElement;
        if (dateInput) {
            dateInput.value = today;
        }
    }

    private setupEventListeners(): void {
        const form = document.getElementById('addExpenseForm') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', (e) => this.handleAddExpense(e));
        }

        const topUpBtn = document.getElementById('topUpBtn') as HTMLButtonElement;
        if (topUpBtn) {
            topUpBtn.addEventListener('click', () => this.handleAddBalance());
        }

        const editForm = document.getElementById('updateExpenseForm') as HTMLFormElement;
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleUpdateExpense(e));
        }

        const filterSelect = document.getElementById('categoryFilter') as HTMLSelectElement;
        if (filterSelect) {
            filterSelect.addEventListener('change', () => this.render());
        }

        const closeModal = document.getElementById('closePopup') as HTMLElement;
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        const modal = document.getElementById('updatePopup') as HTMLElement;
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    private handleAddBalance(): void {
        const topUpInput = document.getElementById('topUpAmount') as HTMLInputElement;
        if (!topUpInput) return;

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

    private handleAddExpense(e: Event): void {
        e.preventDefault();

        const amountInput = document.getElementById('addAmount') as HTMLInputElement;
        const categorySelect = document.getElementById('addCategory') as HTMLSelectElement;
        const descriptionInput = document.getElementById('addDescription') as HTMLInputElement;
        const dateInput = document.getElementById('addDate') as HTMLInputElement;

        const amount = parseFloat(amountInput.value);
        const category = categorySelect.value as Category;
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

        const expense: Expense = {
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

    private handleUpdateExpense(e: Event): void {
        e.preventDefault();

        if (!this.editingExpenseId) return;

        const amountInput = document.getElementById('updateAmount') as HTMLInputElement;
        const categorySelect = document.getElementById('updateCategory') as HTMLSelectElement;
        const descriptionInput = document.getElementById('updateDescription') as HTMLInputElement;
        const dateInput = document.getElementById('updateDate') as HTMLInputElement;

        const amount = parseFloat(amountInput.value);
        const category = categorySelect.value as Category;
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
            this.state.expenses[expenseIndex] = {
                ...this.state.expenses[expenseIndex],
                amount,
                category,
                description,
                date,
            };
            this.saveState();
            this.closeModal();
            this.render();
        }
    }

    private deleteExpense(id: string): void {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.state.expenses = this.state.expenses.filter(e => e.id !== id);
            this.saveState();
            this.render();
        }
    }

    private openEditModal(id: string): void {
        const expense = this.state.expenses.find(e => e.id === id);
        if (!expense) return;

        this.editingExpenseId = id;

        const amountInput = document.getElementById('updateAmount') as HTMLInputElement;
        const categorySelect = document.getElementById('updateCategory') as HTMLSelectElement;
        const descriptionInput = document.getElementById('updateDescription') as HTMLInputElement;
        const dateInput = document.getElementById('updateDate') as HTMLInputElement;

        amountInput.value = expense.amount.toString();
        categorySelect.value = expense.category;
        descriptionInput.value = expense.description;
        dateInput.value = expense.date;

        const modal = document.getElementById('updatePopup') as HTMLElement;
        if (modal) {
            modal.classList.add('show');
        }
    }

    private closeModal(): void {
        const modal = document.getElementById('updatePopup') as HTMLElement;
        if (modal) {
            modal.classList.remove('show');
        }
        this.editingExpenseId = null;
    }

    private clearForm(): void {
        const form = document.getElementById('addExpenseForm') as HTMLFormElement;
        if (form) {
            form.reset();
            this.initializeDate();
        }
    }

    private calculateTotalExpenditure(): number {
        return this.state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    private getAvailableBalance(): number {
        return this.state.initialBalance - this.calculateTotalExpenditure();
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    }

    private formatDate(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private getFilteredExpenses(): Expense[] {
        const filterSelect = document.getElementById('categoryFilter') as HTMLSelectElement;
        const selectedCategory = filterSelect?.value || '';

        if (!selectedCategory) {
            return [...this.state.expenses].sort((a, b) => b.createdAt - a.createdAt);
        }

        return this.state.expenses
            .filter(expense => expense.category === selectedCategory)
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    private render(): void {
        this.updateStats();
        this.renderTransactions();
    }

    private updateStats(): void {
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

    private renderTransactions(): void {
        const list = document.getElementById('historyList');
        if (!list) return;

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

    private createTransactionElement(expense: Expense): string {
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

    private escapeHtml(text: string): string {
        const map: Record<string, string> = {
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
