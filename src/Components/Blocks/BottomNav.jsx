import React, { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
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
                <BottomNavigationAction label="Главная" icon={<RestoreIcon />} />
                <BottomNavigationAction label="Аналитика" icon={<PieChartIcon />} />
                <BottomNavigationAction label="Настройки" icon={<SettingsIcon />} />
            </BottomNavigation>
        </Paper>
    );
};

export default BottomNav;
