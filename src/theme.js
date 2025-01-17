import { createTheme } from '@mui/material/styles';

let isDarkMode = localStorage.getItem('isDarkMode');

const theme = createTheme({
    palette: {
        primary: {
            main: '#4CAF50',
        },
        secondary: {
            main: '#FF9800',
        },
        background: {
            default: isDarkMode == 'true' ? '#000000d9' : '#F5F5F5',
        },
        text: {
            primary: isDarkMode == 'true' ? '#fff' : '#212121',
            secondary: '#757575',
        },
    },
});

export default theme;
