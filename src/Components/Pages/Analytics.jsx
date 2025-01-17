import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Массив цветов для категорий (для доходов и расходов)
const incomeColors = [
    '#4caf50', '#81c784', '#388e3c', '#1976d2', '#42a5f5', '#0288d1', '#ffb300', '#ff9800'
];

const expenseColors = [
    '#f44336', '#e57373', '#d32f2f', '#ff5722', '#f44336', '#e53935', '#d32f2f', '#c62828'
];

// Функция для подсчета суммы по категориям
const calculateCategoryTotals = (transactions, isExpense = false) => {
    const categoryTotals = {};

    transactions.forEach((transaction) => {
        if (transaction.category) {
            const amount = Math.abs(transaction.amount); // Преобразуем отрицательные значения в положительные
            if (categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] += amount;
            } else {
                categoryTotals[transaction.category] = amount;
            }
        }
    });

    return Object.entries(categoryTotals).map(([category, amount], index) => ({
        name: category,
        value: amount,
        fill: isExpense ? expenseColors[index % expenseColors.length] : incomeColors[index % incomeColors.length] // Используем красные оттенки для расходов
    }));
};

// Функция для фильтрации транзакций по времени
const filterTransactionsByDate = (transactions = [], timeFilter) => {
    if (!transactions || transactions.length === 0) return []; // Защита от пустых данных

    const today = new Date();
    return transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        if (timeFilter === 'today') {
            return transactionDate.toDateString() === today.toDateString(); // Сравниваем только по дате (без времени)
        }
        if (timeFilter === 'month') {
            return transactionDate.getMonth() === today.getMonth() && transactionDate.getFullYear() === today.getFullYear();
        }
        if (timeFilter === 'year') {
            return transactionDate.getFullYear() === today.getFullYear();
        }
        return true; // Фильтр "все время"
    });
};

// Функция для загрузки данных из LocalStorage
const loadDataFromLocalStorage = () => {
    const savedIncomeTransactions = localStorage.getItem('incomeTransactions');
    const savedExpenseTransactions = localStorage.getItem('expenseTransactions');
    return {
        incomeTransactions: savedIncomeTransactions ? JSON.parse(savedIncomeTransactions) : [],
        expenseTransactions: savedExpenseTransactions ? JSON.parse(savedExpenseTransactions) : [],
    };
};

const Analytics = () => {
    const [incomeTransactions, setIncomeTransactions] = useState([]);
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0); // Состояние для табов: 0 - доходы, 1 - расходы
    const [timeFilter, setTimeFilter] = useState(localStorage.getItem('selectedFilter') ? localStorage.getItem('selectedFilter') : 'month'); // Фильтр по времени: 'today', 'month', 'year', 'all'

    // Загружаем данные при монтировании компонента
    useEffect(() => {
        const { incomeTransactions, expenseTransactions } = loadDataFromLocalStorage();
        setIncomeTransactions(incomeTransactions);
        setExpenseTransactions(expenseTransactions);
    }, []);

    // Фильтрация транзакций
    const filteredIncomeTransactions = filterTransactionsByDate(incomeTransactions, timeFilter);
    const filteredExpenseTransactions = filterTransactionsByDate(expenseTransactions, timeFilter);

    // Подсчитываем суммы по категориям для поступлений и расходов
    const incomeData = calculateCategoryTotals(filteredIncomeTransactions, false); // false для доходов
    const expenseData = calculateCategoryTotals(filteredExpenseTransactions, true); // true для расходов

    // Функция для подсчета общей суммы
    const getTotalAmount = (transactions) => {
        return transactions.reduce((total, transaction) => total + transaction.amount, 0);
    };

    // Функция для смены вкладки
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" align="center" sx={{ mb: 3 }}>
                Аналитика
            </Typography>

            {/* Кнопки для фильтрации по времени */}
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mb: 2, gap: '4px' }}>
                <Button
                    sx={{ fontSize: '10px', width: '48%', color: timeFilter === 'today' ? '#fff' : 'primary' }}
                    variant={timeFilter === 'today' ? 'contained' : 'outlined'}
                    onClick={() => setTimeFilter('today')}
                >
                    Сегодня
                </Button>
                <Button
                    sx={{ fontSize: '10px', width: '48%', color: timeFilter === 'month' ? '#fff' : 'primary' }}
                    variant={timeFilter === 'month' ? 'contained' : 'outlined'}
                    onClick={() => setTimeFilter('month')}
                >
                    За месяц
                </Button>
                <Button
                    sx={{ fontSize: '10px', width: '48%', color: timeFilter === 'year' ? '#fff' : 'primary' }}
                    variant={timeFilter === 'year' ? 'contained' : 'outlined'}
                    onClick={() => setTimeFilter('year')}
                >
                    За год
                </Button>
                <Button
                    sx={{ fontSize: '10px', width: '48%', color: timeFilter === 'all' ? '#fff' : 'primary' }}
                    variant={timeFilter === 'all' ? 'contained' : 'outlined'}
                    onClick={() => setTimeFilter('all')}
                >
                    Все время
                </Button>
            </Box>

            {/* Таб для доходов и расходов */}
            <Tabs value={selectedTab} onChange={handleTabChange} centered>
                <Tab label="Доходы" />
                <Tab label="Расходы" />
            </Tabs>

            {/* Контент для выбранного таба */}
            <Box sx={{ mt: 3 }}>
                {selectedTab === 0 && ( // Доходы
                    <>
                        <Box sx={{ mt: 3 }}>
                            <Typography sx={{ textAlign: 'center' }}>Общая сумма доходов: {getTotalAmount(filteredIncomeTransactions).toLocaleString()} ₽</Typography>
                        </Box>
                        <Box>
                            {incomeData.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={incomeData} dataKey="value" nameKey="name" outerRadius={100}>
                                                {incomeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </>
                            ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>Доходов по категориям нет.</Typography>
                            )}
                        </Box>

                    </>
                )}

                {selectedTab === 1 && ( // Расходы
                    <>
                        <Box>
                            <Box sx={{ mt: 3 }}>
                                <Typography sx={{ textAlign: 'center' }}>Общая сумма расходов: {getTotalAmount(filteredExpenseTransactions).toLocaleString()} ₽</Typography>
                            </Box>
                            {expenseData.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={100}>
                                                {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </>
                            ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>Расходов по категориям нет.</Typography>
                            )}
                        </Box>
                    </>
                )}
            </Box>

            {/* Сумма поступлений и расходов */}

        </Box>
    );
};

export default Analytics;
