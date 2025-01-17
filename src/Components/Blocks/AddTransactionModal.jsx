import React, { useState } from 'react';
import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    Autocomplete,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddTransactionModal = ({ open, onClose, onAdd, transactionType, categories, selectedCategory, setSelectedCategory }) => {
    const [amount, setAmount] = useState('');
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]); // Устанавливаем текущую дату
    const [transactionTime, setTransactionTime] = useState(new Date().toLocaleTimeString()); // Устанавливаем текущее время
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false); // Состояние для открытия диалога
    const [newCategory, setNewCategory] = useState(''); // Состояние для новой категории

    const handleSubmit = () => {
        if (selectedCategory && amount) {
            const parsedAmount = parseFloat(amount);
            const finalAmount = transactionType === 'income' ? parsedAmount : -parsedAmount;

            const newTransaction = {
                description: selectedCategory,
                amount: finalAmount,
                category: selectedCategory,
                date: transactionDate, // Добавляем дату
                time: transactionTime, // Добавляем время
            };

            onAdd(newTransaction);
            setAmount('');
            setSelectedCategory('');
            setTransactionDate(new Date().toISOString().split('T')[0]); // сбрасываем на текущую дату
            setTransactionTime(new Date().toLocaleTimeString()); // сбрасываем на текущее время
            onClose();
        }
    };

    const handleAddCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            categories.push(newCategory); // Добавляем новую категорию в список
            setSelectedCategory(newCategory); // Устанавливаем выбранную категорию
            setNewCategory('');
        }
        setIsCategoryDialogOpen(false); // Закрываем диалог после добавления категории
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="add-transaction-modal">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={2}>
                    {transactionType === 'income' ? 'Добавить поступление' : 'Добавить расход'}
                </Typography>

                {/* Поле категории с иконкой плюса */}
                <Box sx={{ position: 'relative', mb: 3, display: 'flex', width: '100%', gap: '5px' }}>
                    <Autocomplete
                        freeSolo
                        options={categories}
                        value={selectedCategory}
                        onChange={(event, newValue) => setSelectedCategory(newValue)}
                        onInputChange={(event, newInputValue) => setSelectedCategory(newInputValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Категория"
                                variant="outlined"
                                fullWidth
                                sx={{ width: '100%' }}
                            />
                        )}
                        sx={{ width: '85%' }}
                    />
                    <IconButton
                        sx={{
                            width: '15%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'background.paper',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: '4px',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                        onClick={() => setIsCategoryDialogOpen(true)}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>

                {/* Поле суммы */}
                <TextField
                    fullWidth
                    label="Сумма"
                    variant="outlined"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={{ mb: 3 }}
                />

                {/* Поле даты */}
                <TextField
                    fullWidth
                    label="Дата"
                    variant="outlined"
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    sx={{ mb: 3 }}
                />

                {/* Поле времени */}
                <TextField
                    fullWidth
                    label="Время"
                    variant="outlined"
                    type="time"
                    value={transactionTime}
                    onChange={(e) => setTransactionTime(e.target.value)}
                    sx={{ mb: 3 }}
                />

                {/* Кнопки */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ width: '48%' }}
                    >
                        Добавить
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                        sx={{ width: '48%' }}
                    >
                        Отмена
                    </Button>
                </Box>

                {/* Диалог добавления категории */}
                <Dialog open={isCategoryDialogOpen} onClose={() => setIsCategoryDialogOpen(false)}>
                    <DialogTitle>Добавить новую категорию</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Название категории"
                            variant="outlined"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsCategoryDialogOpen(false)} color="secondary">
                            Отмена
                        </Button>
                        <Button onClick={handleAddCategory} color="primary">
                            Добавить
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Modal>
    );
};

export default AddTransactionModal;
