// data.js

// Категории для поступлений и расходов
export const categories = {
    income: ['Зарплата', 'Дивиденды', 'Подарки'],
    expense: ['Продукты', 'Транспорт', 'Развлечения', 'ЖКХ', 'Одежда', 'Медицина'],
};

const loadData = () => {
    const savedData = localStorage.getItem('transactions');
    if (savedData) {
        return JSON.parse(savedData);
    }
    // Если данных нет, возвращаем дефолтные значения
    return {
        income: [],
        expense: [],
    };
};

export const transactions = loadData()

// Функция для добавления новой транзакции
export const addTransaction = (newTransaction, type) => {
    transactions[type].push(newTransaction);
    console.log(transactions)
};

// Функция для получения транзакций по категории
export const getTransactionsByCategory = (category, type) => {
    return transactions[type].filter(transaction => transaction.category === category);
};
