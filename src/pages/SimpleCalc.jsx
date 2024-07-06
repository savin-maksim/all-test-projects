import React, { useState } from 'react';
import { Container, Grid, Button, Box, Typography } from '@mui/material';
import { create, all } from 'mathjs';

const math = create(all);

function SimpleCalc() {
  const [input, setInput] = useState('');

  const addToInput = val => {
    setInput(input + val);
  };

  const clearInput = () => {
    setInput('');
  };

  const calculateResult = () => {
    try {
      setInput(String(math.evaluate(input)));
    } catch (error) {
      setInput('Error');
    }
  };

  return (
    <Container maxWidth='xs'>
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='90vh'>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <Grid item xs={3}>
              <Button fullWidth variant='outlined'>form</Button>
            </Grid>
            <Box sx={{ width: '100%', border: '1px solid black', textAlign: 'right', p: 2 }}>
              <Typography>{input || '0'}</Typography>
            </Box>
          </Grid>

          <Grid item xs={3}>
            <Button fullWidth variant='outlined' onClick={() => addToInput('(')}>(</Button>
          </Grid>

          <Grid item xs={3}>
            <Button fullWidth variant='outlined' onClick={() => addToInput(')')}>)</Button>
          </Grid>

          <Grid item xs={3}>
            <Button fullWidth variant='outlined' onClick={() => clearInput()}>Clear</Button>
          </Grid>

          <Grid item xs={3}>
          </Grid>

          <Grid item xs={3}>
          </Grid>

          {['i', 'ang'].map((val) => (
            <Grid item xs={3} key={val}>
              <Button fullWidth variant='outlined' onClick={() => addToInput(val)}>{val}</Button>
            </Grid>
          ))}

          <Grid item xs={3}>
          </Grid>

          {['+/-', '/', '*', '-'].map((val) => (
            <Grid item xs={3} key={val}>
              <Button fullWidth variant='outlined' onClick={() => addToInput(val)}>{val}</Button>
            </Grid>
          ))}

          {['7', '8', '9'].map((val) => (
            <Grid item xs={3} key={val}>
              <Button fullWidth variant='contained' onClick={() => addToInput(val)}>{val}</Button>
            </Grid>
          ))}

          <Grid item xs={3}>
            <Button fullWidth variant='outlined' onClick={() => addToInput('+')}>+</Button>
          </Grid>

          {['4', '5', '6'].map((val) => (
            <Grid item xs={3} key={val}>
              <Button fullWidth variant='contained' onClick={() => addToInput(val)}>{val}</Button>
            </Grid>
          ))}

          <Grid item xs={3}>
          </Grid>

          <Grid item xs={9} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              {['1', '2', '3'].map((val) => (
                <Button key={val} variant='contained' onClick={() => addToInput(val)} sx={{ width: '4.67vw' }}>
                  {val}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant='contained' onClick={() => addToInput('0')} sx={{ width: '192px', marginRight: '10px' }}>0</Button>
              <Button variant='contained' onClick={() => addToInput('.')} sx={{ width: '90px' }}>.</Button>
            </Box>
          </Grid>

          <Grid item xs={3}>
            <Button fullWidth variant='outlined' onClick={() => calculateResult()} style={{ height: '100%' }}>=</Button>
          </Grid>

        </Grid>
      </Box>
    </Container>
  );
}

export default SimpleCalc;