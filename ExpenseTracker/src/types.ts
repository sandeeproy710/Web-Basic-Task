export type Category = 'food' | 'transport' | 'medicine' | 'shopping' | 'grocery' | 'entertainment' | 'utilities' | 'miscellaneous';

export interface Expense {
    id: string;
    amount: number;
    category: Category;
    description: string;
    date: string;
    createdAt: number;
}

export interface AppState {
    expenses: Expense[];
    initialBalance: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
    food: '🍔 Food',
    transport: '🚗 Transport',
    medicine: '💊 Medicine',
    shopping: '🛍️ Shopping',
    grocery: '🛒 Grocery',
    entertainment: '🎬 Entertainment',
    utilities: '💡 Utilities',
    miscellaneous: '📦 Miscellaneous',
};
