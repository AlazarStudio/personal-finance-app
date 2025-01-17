import React, { useState, useEffect } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import theme from '../../theme';

const BottomNav = () => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();

    // Восстанавливаем выбранную вкладку из localStorage при монтировании компонента
    useEffect(() => {
        const savedValue = localStorage.getItem('bottomNavValue');
        if (savedValue) {
            setValue(Number(savedValue)); // Преобразуем значение в число
        }
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // Сохраняем выбранную вкладку в localStorage
        localStorage.setItem('bottomNavValue', newValue);

        switch (newValue) {
            case 0:
                navigate('/'); // Главная страница
                break;
            case 1:
                navigate('/analytics'); // Аналитика
                break;
            case 2:
                navigate('/settings'); // Настройки
                break;
            default:
                break;
        }
    };

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
            }}
            elevation={3}
        >
            <BottomNavigation value={value} onChange={handleChange}>
                <BottomNavigationAction label="Главная" icon={<RestoreIcon />} sx={{ background: theme.palette.background.default }} />
                <BottomNavigationAction label="Аналитика" icon={<PieChartIcon />} sx={{ background: theme.palette.background.default }} />
                <BottomNavigationAction label="Настройки" icon={<SettingsIcon />} sx={{ background: theme.palette.background.default }} />
            </BottomNavigation>
        </Paper>
    );
};

export default BottomNav;
