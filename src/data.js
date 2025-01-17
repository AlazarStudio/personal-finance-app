// data.js

// Категории для поступлений и расходов
export const categories = {
    income: ['Зарплата', 'Дивиденды', 'Подарки'],
    expense: ['Продукты', 'Транспорт', 'Развлечения', 'ЖКХ', 'Одежда', 'Медицина'],
};

// Массив транзакций (разделён на расходы и поступления)
export const transactions = {
    income: [
        {
            "description": "Зарплата",
            "amount": 20000,
            "category": "Зарплата",
            "date": "2025-01-17",
            "time": "16:09:45",
            "id": 1
        },
        {
            "description": "Дивиденды",
            "amount": 2000,
            "category": "Дивиденды",
            "date": "2025-01-16",
            "time": "16:13:02",
            "id": 2
        },
        {
            "description": "Зарплата",
            "amount": 1,
            "category": "Зарплата",
            "date": "2025-01-17",
            "time": "16:13:17",
            "id": 3
        },
        {
            "description": "Зарплата",
            "amount": 12,
            "category": "Зарплата",
            "date": "2025-01-17",
            "time": "16:13:46",
            "id": 4
        },
        {
            "description": "Зарплата",
            "amount": 12,
            "category": "Зарплата",
            "date": "2025-01-17",
            "time": "16:13:49",
            "id": 5
        },
        {
            "description": "Зарплата",
            "amount": 12,
            "category": "Зарплата",
            "date": "2025-01-17",
            "time": "16:13:52",
            "id": 6
        }
    ],
    expense: [],
};

// Функция для добавления новой транзакции
export const addTransaction = (newTransaction, type) => {
    transactions[type].push(newTransaction);
};

// Функция для получения транзакций по категории
export const getTransactionsByCategory = (category, type) => {
    return transactions[type].filter(transaction => transaction.category === category);
};
