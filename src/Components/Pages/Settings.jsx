import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Switch, FormControlLabel, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('isDarkMode') ? localStorage.getItem('isDarkMode') : false);
    const [selectedFilter, setSelectedFilter] = useState(localStorage.getItem('selectedFilter') ? localStorage.getItem('selectedFilter') : 'month');
    const navigate = useNavigate();

    // Загрузка настроек из localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('isDarkMode');
        const savedFilter = localStorage.getItem('selectedFilter');

        if (savedTheme !== null) {
            setIsDarkMode(JSON.parse(savedTheme));
        }

        if (savedFilter) {
            setSelectedFilter(savedFilter);
        }
    }, []);

    // Переключение темы
    const handleThemeChange = (event) => {
        const theme = event.target.checked;
        setIsDarkMode(theme);
        localStorage.setItem('isDarkMode', theme);
        window.location.reload();
    };

    // Изменение фильтра
    const handleFilterChange = (event) => {
        const filter = event.target.value;
        setSelectedFilter(filter);
        localStorage.setItem('selectedFilter', filter);
    };

    // Сброс данных
    const handleResetData = () => {
        const confirmReset = window.confirm("Вы уверены, что хотите сбросить все данные?");
        if (confirmReset) {
            localStorage.clear();
            alert("Все данные сброшены!");
            navigate('/'); // Перенаправляем на главную страницу
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Настройки приложения</Typography>

            {/* Переключение темы */}
            <FormControlLabel
                control={<Switch checked={isDarkMode} onChange={handleThemeChange} />}
                label="Темная тема"
                sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            {/* Настройка фильтра */}
            <Typography sx={{ mb: 2 }}>Фильтрация транзакций по умолчанию</Typography>
            <Button
                variant={selectedFilter === 'today' ? 'contained' : 'outlined'}

                onClick={handleFilterChange}
                value="today"
                sx={{ mr: 1, color: selectedFilter === 'today' ? '#fff' : 'primary' }}
            >
                Сегодня
            </Button>
            <Button
                variant={selectedFilter === 'month' ? 'contained' : 'outlined'}

                onClick={handleFilterChange}
                value="month"
                sx={{ mr: 1, color: selectedFilter === 'month' ? '#fff' : 'primary' }}
            >
                За месяц
            </Button>
            <Button
                variant={selectedFilter === 'year' ? 'contained' : 'outlined'}

                onClick={handleFilterChange}
                value="year"
                sx={{ mr: 1, color: selectedFilter === 'year' ? '#fff' : 'primary' }}
            >
                За год
            </Button>

            <Divider sx={{ my: 2 }} />

            {/* Сброс данных */}
            <Typography sx={{ mb: 2 }}>
                Вы можете сбросить все данные (транзакции и настройки) из приложения.
            </Typography>
            <Button
                variant="outlined"
                color="error"
                onClick={handleResetData}
            >
                Сбросить все данные
            </Button>
        </Box>
    );
};

export default Settings;
