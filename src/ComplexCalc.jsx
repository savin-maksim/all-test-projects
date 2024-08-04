import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container, Grid, Button, Box, Typography, Card, CardContent, TextField, Slider, Snackbar } from '@mui/material';
import { create, all } from 'mathjs';

import './index.css'

// configure the default type of numbers as BigNumbers
const initialConfig = {
   // Default type of number
   // Available options: 'number' (default), 'BigNumber', or 'Fraction'
   number: 'BigNumber',

   // Number of significant digits for BigNumbers
   precision: 20
};

const math = create(all, initialConfig);

function ComplexCalc() {
   const [input, setInput] = useState('');
   const [lastExpression, setLastExpression] = useState('');
   const [history, setHistory] = useState([]);
   const [historyRes, setHistoryRes] = useState([]);
   const [precision, setPrecision] = useState(3);
   const [showHistory, setShowHistory] = useState(false);
   const [snackbarOpen, setSnackbarOpen] = useState(false);
   const [snackbarMessage, setSnackbarMessage] = useState('');
   const inputRef = useRef(null);

   const copyToClipboard = useCallback((text) => {
      navigator.clipboard.writeText(text)
         .then(() => {
            setInput(text);
            setSnackbarMessage(`Copied: ${text}`);
            setSnackbarOpen(true);
         })
         .catch((err) => {
            setSnackbarMessage('Failed to copy');
            setSnackbarOpen(true);
         });
      setShowHistory(false);
   }, []);


   const clearHistory = () => {
      setHistory([]);
      setHistoryRes([]);
      setLastExpression('')
   };


   useEffect(() => {
      if (inputRef.current) {
         inputRef.current.scrollLeft = inputRef.current.scrollWidth; // прокручиваем в самый конец
      }
   }, [input]);

   const extraButtons = ['(', ')', 'ac', '<-', 'i', ' ∠ ', 'x^', '√', '%', ' / ', ' * ', ' - '];
   const numberButtons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];

   const addToInputNumber = val => {
      if (input === 'Error') {
         setInput(val);
      } else {
         setInput(input + val);
      }
   };

   const addToInputExtra = val => {
      if (input === 'Error') {
         setInput(val);
      } else if (['/', '*', '-', '+'].includes(input[input.length - 2])) {
         setInput(input.slice(0, -3) + val);
      } else {
         setInput(input + val);
      }
   };

   const clearInput = () => {
      setInput('');
   };

   const handleBackspace = () => {
      if (input === 'Error') {
         setInput('');
      } else if (['/', '*', '-', '+'].includes(input[input.length - 2])) {
         setInput(input.slice(0, -3));
      }
      else {
         setInput(input.slice(0, -1));
      }
   };

   const calculateResult = () => {
      try {
         const result = input.replace(/(-?\d+(\.\d+)?) ∠ (-?\d+(\.\d+)?)/g, (_, r, _1, phi) => {
            const a = math.evaluate(`${r}*cos(${phi}*pi/180)`);
            const b = math.evaluate(`${r}*sin(${phi}*pi/180)`);
            return `${a} + ${b}i`;
         });

         const evaluatedResult = math.round(math.evaluate(result), precision);
         const handleHistory = [...history, input];
         const handleHistoryRes = [...historyRes, String(evaluatedResult)];

         setLastExpression(`${handleHistory[handleHistory.length - 1]} = ${handleHistoryRes[handleHistoryRes.length - 1]}`);
         setHistory(handleHistory);
         setHistoryRes(handleHistoryRes);


         if (math.isComplex(evaluatedResult)) {
            setInput(`(${evaluatedResult})`);
         } else {
            setInput(`${evaluatedResult}`);
         }
      } catch (error) {
         console.log(error)
         setInput('Error');
      }
   };

   const convertToPolar = (input) => {
      try {
         const result = input.replace(/\(?\s*(-?\d+(\.\d+)?)\s*[\+\-]\s*(-?\d+(\.\d+)?)i\s*\)?/gi, (_, real, _1, imaginary) => {
            const absValue = math.evaluate(`sqrt(${real}^2+${imaginary}^2)`);
            const angleValue = math.evaluate(`atan2(${imaginary}, ${real})*180/pi`);
            return `(${math.round(absValue, precision)} ∠ ${math.round(angleValue, precision)})`;
         });

         setInput(`${result}`);
      } catch (error) {
         console.log(error);
         setInput('Error');
      }
   };


   const convertToAlgebraic = () => {
      const result = input.replace(/(-?\d+(\.\d+)?) ∠ (-?\d+(\.\d+)?)/g, (_, r, _1, phi) => {
         const a = math.evaluate(`${r}*cos(${phi}*pi/180)`);
         const b = math.evaluate(`${r}*sin(${phi}*pi/180)`);
         return `${math.round(a, precision)} + ${math.round(b, precision)}i`;
      });
      const evaluatedResult = math.evaluate(result);

      if (math.isComplex(evaluatedResult)) {
         setInput(`(${evaluatedResult})`);
      } else {
         setInput(`${evaluatedResult}`);
      }
   };

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         calculateResult();
      }
   };




   return (
      <Container sx={{ height: { xs: '97vh', md: '95vh', lg: '95vh', xl: '95vh' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <Card sx={{ width: { xs: '100%', md: '100%', lg: '100%', xl: '100%' }, minWidth: '330px', maxWidth: '500px', height: { xs: '95%', md: '100%', lg: '80%', xl: '80%' }, minHeight: 'auto', padding: 0.5, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
               {showHistory ? (
                  <Box sx={{ flex: '1 1 auto', overflowY: 'auto', position: 'relative' }}>
                     <Button
                        variant='outlined'
                        onClick={clearHistory}
                        sx={{ position: 'absolute', top: '10px', right: '90px' }}
                     >
                        Clear History
                     </Button>
                     <Button
                        variant='outlined'
                        onClick={() => setShowHistory(false)}
                        sx={{ position: 'absolute', top: '10px', right: '10px' }}
                     >
                        ✖
                     </Button>
                     <Box sx={{ position: 'absolute', top: '60px', left: '10px', width: '96%' }}>
                        {history.map((expr, index) => (
                           <Card sx={{ mb: 2 }} key={index}>
                              <CardContent sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                 <Typography marginTop={'8px'}>
                                    {expr} = {historyRes[index]}
                                 </Typography>
                                 <Box sx={{ mt: '8px', justifyContent: 'center' }}>
                                    <Button variant='outlined' size="small" onClick={() => copyToClipboard(expr)}>Copy Input</Button>
                                    <Button variant='outlined' size="small" onClick={() => copyToClipboard(historyRes[index])}>Copy Result</Button>
                                 </Box>
                                 <Snackbar
                                    open={snackbarOpen}
                                    autoHideDuration={3000}
                                    onClose={() => setSnackbarOpen(false)}
                                    message={snackbarMessage}
                                 />
                              </CardContent>
                           </Card>
                        ))}
                     </Box>
                  </Box>
               ) : (<>
                  <Box sx={{ flex: '0 0 auto' }}>
                     <Button fullWidth variant='text' onClick={() => setShowHistory(!showHistory)}>
                        history
                     </Button>
                     <TextField
                        fullWidth
                        variant="standard"
                        inputProps={{ style: { textAlign: 'right', marginRight: '2%' } }}
                        value={lastExpression}
                        disabled
                     />
                     <TextField
                        fullWidth
                        variant="outlined"
                        inputRef={inputRef}
                        sx={{ overflowX: 'auto' }}
                        inputProps={{ style: { textAlign: 'right' } }}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        value={input}
                     />
                  </Box>
                  <Box sx={{ padding: 0.5 }}>
                     <Grid container spacing='10'>
                        <Grid item xs={6} display='flex' sx={{ alignItems: 'center', justifyContent: 'center' }}>
                           <Typography>
                              Precision:{precision}
                           </Typography>
                        </Grid>
                        <Grid item xs={6}>
                           <Slider
                              value={precision}
                              min={1}
                              max={20}
                              step={1}
                              onChange={(e, newValue) => setPrecision(newValue)}
                              valueLabelDisplay="auto"
                              sx={{ mr: '10%' }}
                           />
                        </Grid>
                     </Grid>
                  </Box>
                  <Box sx={{ flex: '1 0 auto', display: 'flex', padding: 0.5 }}>
                     <Grid container spacing='10'>
                        <Grid item xs={6}>
                           <Button fullWidth variant="contained" onClick={() => convertToPolar(input)}>
                              to Polar
                           </Button>
                        </Grid>
                        <Grid item xs={6}>
                           <Button fullWidth variant="contained" onClick={() => convertToAlgebraic(input)}>
                              to Algebraic
                           </Button>
                        </Grid>
                     </Grid>
                  </Box>
                  <Box sx={{ flex: '2 0 auto', display: 'flex', padding: 0.5 }}>
                     <Grid container spacing='10'>
                        {extraButtons.map((val) => (
                           <Grid item xs={3} key={val}>
                              <Button fullWidth variant='outlined' style={{ height: '100%' }} onClick={
                                 val === 'ac'
                                    ? clearInput
                                    : val === '<-'
                                       ? handleBackspace
                                       : val === 'x^'
                                          ? () => addToInputExtra('^')
                                          : val === '√'
                                             ? () => addToInputExtra('sqrt(')
                                             : () => addToInputExtra(val)}>
                                 {val}
                              </Button>
                           </Grid>
                        ))}
                     </Grid>
                  </Box>
                  <Box sx={{ flex: '4 0 auto', display: 'flex', padding: 0.5 }}>
                     <Box sx={{ width: '74.5%', display: 'flex' }}>
                        <Grid container spacing='10'>
                           {numberButtons.map((val) => (
                              <Grid item xs={(val === '0') ? 8 : 4} key={val}>
                                 <Button fullWidth color='primary' variant="contained" style={{ height: '100%' }} onClick={() => addToInputNumber(val)}>
                                    {val}
                                 </Button>
                              </Grid>
                           ))}
                        </Grid>
                     </Box>
                     <Box sx={{ width: '25.5%', display: 'flex' }} >
                        <Grid container spacing='10'>
                           {[' + ', '='].map((val) => (
                              <Grid item xs={12} key={val} marginLeft='10px'>
                                 <Button fullWidth variant="outlined" style={{ height: '100%' }} onClick={
                                    val === ' + '
                                       ? () => addToInputExtra(val)
                                       : calculateResult
                                 }>
                                    {val}
                                 </Button>
                              </Grid>
                           ))}
                        </Grid>
                     </Box>
                  </Box>
               </>
               )}
            </CardContent>
         </Card>
      </Container>
   );
}

export default ComplexCalc;
