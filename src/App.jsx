import React from 'react';
import NavBar from './components/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SimpleCalc from './pages/SimpleCalc';
import OldCalc from './pages/OldCalc';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body, #root, .MuiContainer-root {
          margin: 0;
          padding: 0;
        }
      `,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<div>Home</div>}></Route>
          <Route path="/simple-calc" element={<SimpleCalc />}></Route>
          <Route path="/old-calc" element={<OldCalc />}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
