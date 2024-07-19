import React from 'react';
import ReactDOM from 'react-dom/client';
import ComplexCalc from './ComplexCalc';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css'

const theme = createTheme({
  typography: {
    fontFamily: 'Space Mono, monospace',
    fontWeightBold: 700,
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ComplexCalc />
    </ThemeProvider>
  </React.StrictMode>,
);
