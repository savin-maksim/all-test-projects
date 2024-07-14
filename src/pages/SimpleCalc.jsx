import React, { useState } from 'react';
import { Container, Grid, Button, Box, Typography, Card, CardContent, TextField } from '@mui/material';
import { create, all } from 'mathjs';

const math = create(all);

function SimpleCalc() {
   const [input, setInput] = useState('');

   const extraButtons = ['(', ')', 'clear', '<-', 'i', 'ang', 'x^', 'sqrt', '%', '/', '*', '-']
   const numberButtons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];

   const addToInput = val => {
      setInput(input + val);
   };

   const clearInput = () => {
      setInput('');
   };

   const calculateResult = () => {
      try {
         const result = input.replace(/(\d+(\.\d+)?)ang(\d+(\.\d+)?)/g, (_, r, _1, phi) => {
            const radians = math.unit(phi, 'deg').toNumber('rad');
            return `complex({ r: ${r}, phi: ${radians} })`;
         });

         setInput(String(math.evaluate(result)));
      } catch (error) {
         setInput('Error');
      }
   };


   return (
      <Container sx={{ height: { xs: '86vh', md: '88vh', lg: '92vh', xl: '93vh' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <Card sx={{ width: { xs: '100%', md: '60%', lg: '60%', xl: '60%' }, minWidth: '300px', height: { xs: '90%', md: '90%', lg: '90%', xl: '90%' }, padding: 0.5, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
               <Box sx={{ flex: '1 0 auto', padding: 1 }}>
                  <Typography variant="h5" component="div" sx={{ textAlign: 'center', marginBottom: 1 }}>
                     Calculator
                  </Typography>
                  <TextField
                     fullWidth
                     variant="outlined"
                     sx={{ marginTop: 1 }}
                     inputProps={{ style: { textAlign: 'right' } }}
                     onChange={(e) => setInput(e.target.value)}
                     value={input}
                  />
               </Box>
               <Box sx={{ flex: '2 0 auto', display: 'flex', padding: 0.5 }}>
                  <Grid container spacing='10'>
                     {extraButtons.map((val) => (
                        <Grid item xs={3}>
                           <Button key={val} fullWidth variant='outlined' style={{ height: '100%' }} onClick={
                              val === 'clear'
                                 ? clearInput
                                 : val === '<-'
                                    ? () => setInput(input.slice(0, -1))
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
                           <Grid item xs={(val === '0') ? 8 : 4}>
                              <Button key={val} fullWidth variant="contained" style={{ height: '100%' }} onClick={() => addToInput(val)}>
                                 {val}
                              </Button>
                           </Grid>
                        ))}
                     </Grid>
                  </Box>
                  <Box sx={{ width: '25.5%', display: 'flex' }}>
                     <Grid container spacing='10'>
                        {['+', '='].map((val) => (
                           <Grid item xs={12} marginLeft='10px'>
                              <Button key={val} fullWidth variant="outlined" style={{ height: '100%' }} onClick={
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

export default SimpleCalc;


