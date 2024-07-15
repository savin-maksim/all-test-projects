import React, { useState, useRef, useEffect } from 'react';
import { Container, Grid, Button, Box, Typography, Card, CardContent, TextField, Slider  } from '@mui/material';
import { create, all, evaluate } from 'mathjs';

// configure the default type of numbers as BigNumbers
const initialConfig  = {
   // Default type of number
   // Available options: 'number' (default), 'BigNumber', or 'Fraction'
   number: 'BigNumber',

   // Number of significant digits for BigNumbers
   precision: 19
};

const math = create(all, initialConfig);

function ComplexCalc() {
   const [input, setInput] = useState('');
   const [lastExpression, setLastExpression] = useState('');
   const [history, setHistory] = useState([]);
   const [precision, setPrecision] = useState(initialConfig.precision);
   const inputRef = useRef(null);

   useEffect(() => {
      if (inputRef.current) {
         inputRef.current.scrollLeft = inputRef.current.scrollWidth; // прокручиваем в самый конец
      }
   }, [input]);

   useEffect(() => {
      const newConfig = { ...initialConfig, precision };
      math.config(newConfig);
   }, [precision]);

   const extraButtons = ['(', ')', 'clear', '<-', 'i', ' angl ', 'x^', 'sqrt', '%', '/', '*', '-'];
   const numberButtons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];

   const addToInput = val => {
      if (input === 'Error') {
         setInput(val);
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
      } else {
         setInput(input.slice(0, -1));
      }
   };

   const calculateResult = () => {
      try {
         const result = input.replace(/(\d+(\.\d+)?) angl (\d+(\.\d+)?)/g, (_, r, _1, phi) => {
            const a = math.evaluate(`${r}*cos(${phi}*pi/180)`);
            const b = math.evaluate(`${r}*sin(${phi}*pi/180)`);
            return `${a} + ${b}i`;
         });

         const evaluatedResult = math.evaluate(result);
         const handleHistory = [...history, input];

         setLastExpression(input);
         setHistory(handleHistory);

         console.log(handleHistory);
         console.log(evaluatedResult);

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
      const absValue = math.abs(evaluate(input)); // Вычисляем модуль
      const angleValue = math.arg(evaluate(input)); // Вычисляем аргумент в радианах
      const polarResult = String(`${absValue} angl ${evaluate(`${angleValue}*180/pi`)}`);
      setInput(`(${polarResult})`);
   };

   const convertToAlgebraic = (input) => {
      const result = input.replace(/(\d+(\.\d+)?) angl (\d+(\.\d+)?)/g, (_, r, _1, phi) => {
         const a = math.evaluate(`${r}*cos(${phi}*pi/180)`);
         const b = math.evaluate(`${r}*sin(${phi}*pi/180)`);
         return `${a} + ${b}i`;
      });
      const evaluatedResult = math.evaluate(result);

      if (math.isComplex(evaluatedResult)) {
         setInput(`(${evaluatedResult})`);
      } else {
         setInput(`${evaluatedResult}`);
      }
   };




   return (
      <Container sx={{ height: { xs: '86vh', md: '88vh', lg: '92vh', xl: '93vh' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <Card sx={{ width: { xs: '100%', md: '60%', lg: '60%', xl: '60%' }, minWidth: '300px', maxWidth: '500px', height: { xs: '90%', md: '90%', lg: '90%', xl: '90%' }, minHeight: '550px', padding: 0.5, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
               <Box sx={{ flex: '1 0 auto', padding: 1 }}>
                  <Typography variant="h5" component="div" sx={{ textAlign: 'center', marginBottom: 1 }}>
                     Calculator
                  </Typography>
                  <TextField
                     fullWidth
                     variant="standard"
                     sx={{ marginTop: 1 }}
                     inputProps={{ style: { textAlign: 'right', marginRight: '2%' } }}
                     value={lastExpression}
                     disabled
                  />
                  <TextField
                     fullWidth
                     variant="outlined"
                     inputRef={inputRef}
                     sx={{ marginBottom: 0, overflowX: 'auto' }}
                     inputProps={{ style: { textAlign: 'right' } }}
                     onChange={(e) => setInput(e.target.value)}
                     value={input}
                  />
               </Box>
               <Box sx={{ marginBottom: 1 }}>
                  <Typography gutterBottom>
                     Precision: {precision}
                  </Typography>
                  <Slider
                     value={precision}
                     min={0}
                     max={19}
                     step={1}
                     onChange={(e, newValue) => setPrecision(newValue)}
                     valueLabelDisplay="auto"
                  />
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
                              val === 'clear'
                                 ? clearInput
                                 : val === '<-'
                                    ? handleBackspace
                                    : val === 'x^'
                                       ? () => addToInput('^')
                                       : val === 'sqrt'
                                          ? () => addToInput('sqrt(')
                                          : () => addToInput(val)}>
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
                              <Button fullWidth variant="contained" style={{ height: '100%' }} onClick={() => addToInput(val)}>
                                 {val}
                              </Button>
                           </Grid>
                        ))}
                     </Grid>
                  </Box>
                  <Box sx={{ width: '25.5%', display: 'flex' }}>
                     <Grid container spacing='10'>
                        {['+', '='].map((val) => (
                           <Grid item xs={12} key={val} marginLeft='10px'>
                              <Button fullWidth variant="outlined" style={{ height: '100%' }} onClick={
                                 val === '+'
                                    ? () => addToInput(val)
                                    : calculateResult
                              }>
                                 {val}
                              </Button>
                           </Grid>
                        ))}
                     </Grid>
                  </Box>
               </Box>
            </CardContent>
         </Card>
      </Container>
   );
}

export default ComplexCalc;
