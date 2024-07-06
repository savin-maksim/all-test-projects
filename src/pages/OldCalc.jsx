import React, { useState } from 'react';
import { Container, Grid, Button, Box, Typography } from '@mui/material';
import { create, all } from 'mathjs';

const math = create(all);

function OldCalc() {

   const [input, setInput] = useState('');

   const addToInput = val => {
      setInput(input + val);
   };

   return (
      <Container maxWidth='xs'>
         <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh' border={1}>

         </Box>
      </Container>
   );
}

export default OldCalc;