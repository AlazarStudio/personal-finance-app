import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, List, ListItem, ListItemText, Tabs, Tab, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { categories } from '../../data'; // Импортируем категории
import AddTransactionModal from '../Blocks/AddTransactionModal';
import theme from '../../theme';

// Функция для подсчета суммы
const getTotalAmount = (transactions) => {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0);
};

const Main_Page = () => {
  const [balance, setBalance] = useState(0);
  const [incomeTransactions, setIncomeTransactions] = useState([]); // Поступления
  const [expenseTransactions, setExpenseTransactions] = useState([]); // Расходы
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('income'); // 'income' или 'expense'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTab, setSelectedTab] = useState(0); // Для табов: 0 - Поступления, 1 - Расходы
  const [timeFilter, setTimeFilter] = useState(localStorage.getItem('selectedFilter') ? localStorage.getItem('selectedFilter') : 'month'); // Фильтр по времени: 'today', 'month', 'year'
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Для модального окна подтверждения удаления
  const [transactionToDelete, setTransactionToDelete] = useState(null); // Транзакция для удаления

  // Функция для загрузки данных из LocalStorage
  const loadDataFromLocalStorage = () => {
    const savedIncomeTransactions = localStorage.getItem('incomeTransactions');
    const savedExpenseTransactions = localStorage.getItem('expenseTransactions');
    return {
      incomeTransactions: savedIncomeTransactions ? JSON.parse(savedIncomeTransactions) : [],
      expenseTransactions: savedExpenseTransactions ? JSON.parse(savedExpenseTransactions) : [],
    };
  };

  // Функция для сохранения данных в LocalStorage
  const saveDataToLocalStorage = (incomeTransactions, expenseTransactions) => {
    localStorage.setItem('incomeTransactions', JSON.stringify(incomeTransactions));
    localStorage.setItem('expenseTransactions', JSON.stringify(expenseTransactions));
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    const { incomeTransactions, expenseTransactions } = loadDataFromLocalStorage();
    setIncomeTransactions(incomeTransactions);
    setExpenseTransactions(expenseTransactions);

    // Пересчитываем баланс
    const totalBalance = getTotalAmount(incomeTransactions) + getTotalAmount(expenseTransactions);
    setBalance(totalBalance);
  }, []);

  // Фильтрация транзакций по времени
  const filterTransactionsByDate = (transactions) => {
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
      return true;
    });
  };

  // Фильтрация транзакций для поступлений и расходов
  const filteredIncomeTransactions = filterTransactionsByDate(incomeTransactions);
  const filteredExpenseTransactions = filterTransactionsByDate(expenseTransactions);

  // Перерасчет баланса относительно выбранного фильтра
  const filteredBalance = getTotalAmount(filteredIncomeTransactions) + getTotalAmount(filteredExpenseTransactions);

  // Функция для смены вкладки
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: modalType === 'income' ? incomeTransactions.length + 1 : expenseTransactions.length + 1,
    };

    // Добавляем транзакцию в состояние
    if (modalType === 'income') {
      const updatedIncomeTransactions = [...incomeTransactions, newTransaction];
      setIncomeTransactions(updatedIncomeTransactions);
      saveDataToLocalStorage(updatedIncomeTransactions, expenseTransactions);
    } else {
      const updatedExpenseTransactions = [...expenseTransactions, newTransaction];
      setExpenseTransactions(updatedExpenseTransactions);
      saveDataToLocalStorage(incomeTransactions, updatedExpenseTransactions);
    }

    // Обновляем баланс
    setBalance((prevBalance) => prevBalance + transaction.amount);

    // Закрываем модальное окно
    setIsModalOpen(false);
  };

  // Открытие модального окна для удаления
  const handleOpenDeleteDialog = (transaction) => {
    setTransactionToDelete(transaction);
    setOpenDeleteDialog(true);
  };

  // Закрытие модального окна для удаления
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setTransactionToDelete(null);
  };

  // Удаление транзакции
  const handleDeleteTransaction = () => {
    if (!transactionToDelete) return;

    const { id, type } = transactionToDelete;

    if (type === 'income') {
      const updatedIncomeTransactions = incomeTransactions.filter((transaction) => transaction.id !== id);
      setIncomeTransactions(updatedIncomeTransactions);
      saveDataToLocalStorage(updatedIncomeTransactions, expenseTransactions);
    } else {
      const updatedExpenseTransactions = expenseTransactions.filter((transaction) => transaction.id !== id);
      setExpenseTransactions(updatedExpenseTransactions);
      saveDataToLocalStorage(incomeTransactions, updatedExpenseTransactions);
    }

    // Обновляем баланс
    setBalance((prevBalance) => prevBalance - transactionToDelete.amount);

    // Закрываем диалог
    setOpenDeleteDialog(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Блок баланса */}
      <Card sx={{ mb: 2, background: theme.palette.background.default }}>
        <CardContent>
          <Typography variant="h5" align="center" color="primary">
            Текущий баланс
          </Typography>
          <Typography variant="h4" align="center" color="primary" sx={{ mt: 1 }}>
            {filteredBalance.toLocaleString()} ₽
          </Typography>

          {/* Кнопки для добавления транзакций */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2, gap: '10px' }}>
            <Button sx={{ width: '50%' }} variant="contained" color="success" onClick={() => { setModalType('income'); setIsModalOpen(true); }}>
              Поступление
            </Button>
            <Button sx={{ width: '50%' }} variant="contained" color="error" onClick={() => { setModalType('expense'); setIsModalOpen(true); }}>
              Расход
            </Button>
          </Box>

          {/* Кнопки для фильтрации по времени */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2, gap: '10px' }}>
            <Button sx={{ width: '33%', fontSize: '12px', color: timeFilter === 'today' ? '#fff' : 'success' }} variant={timeFilter === 'today' ? 'contained' : 'outlined'} onClick={() => setTimeFilter('today')}>
              Сегодня
            </Button>
            <Button sx={{ width: '33%', fontSize: '12px', color: timeFilter === 'month' ? '#fff' : 'success' }} variant={timeFilter === 'month' ? 'contained' : 'outlined'} onClick={() => setTimeFilter('month')}>
              За месяц
            </Button>
            <Button sx={{ width: '33%', fontSize: '12px', color: timeFilter === 'year' ? '#fff' : 'success' }} variant={timeFilter === 'year' ? 'contained' : 'outlined'} onClick={() => setTimeFilter('year')}>
              За год
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Таб для Поступлений и Расходов */}
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Поступления" />
        <Tab label="Расходы" />
      </Tabs>

      {/* Контент в зависимости от выбранной вкладки */}
      <Box sx={{ mt: 3 }}>
        {selectedTab === 0 && ( // Поступления
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Сумма поступлений: {getTotalAmount(filteredIncomeTransactions).toLocaleString()} ₽
            </Typography>
            {filteredIncomeTransactions.length > 0 ? (
              <Box sx={{ maxHeight: 'calc(100dvh - 445px)', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: 'background.paper' }}>
                <List>
                  {filteredIncomeTransactions.reverse().map((transaction) => (
                    <ListItem key={transaction.id}>
                      <ListItemText primary={transaction.description} secondary={`${transaction.amount > 0 ? '+' : ''}${transaction.amount.toLocaleString()} ₽`} />
                      <Button variant="outlined" color="error" onClick={() => handleOpenDeleteDialog({ ...transaction, type: 'income' })}>
                        Удалить
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">Поступлений еще не было</Typography>
            )}
          </Box>
        )}

        {selectedTab === 1 && ( // Расходы
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Сумма расходов: {getTotalAmount(filteredExpenseTransactions).toLocaleString()} ₽
            </Typography>
            {filteredExpenseTransactions.length > 0 ? (
              <Box sx={{ maxHeight: 'calc(100dvh - 445px)', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: 'background.paper' }}>
                <List>
                  {filteredExpenseTransactions.reverse().map((transaction) => (
                    <ListItem key={transaction.id}>
                      <ListItemText primary={transaction.description} secondary={`${transaction.amount > 0 ? '+' : ''}${transaction.amount.toLocaleString()} ₽`} />
                      <Button variant="outlined" color="error" onClick={() => handleOpenDeleteDialog({ ...transaction, type: 'expense' })}>
                        Удалить
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">Расходов еще не было</Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Модальное окно подтверждения удаления */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить эту транзакцию?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleDeleteTransaction} color="primary">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно добавления транзакции */}
      <AddTransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
        transactionType={modalType}
        categories={categories[modalType]} // Категории для данного типа
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory} // Передаем функцию для изменения категории
      />
    </Box>
  );
};

export default Main_Page;
