import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function NavBar() {

   return (
      <AppBar position='static'>
         <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6">
               Калькуляторы
            </Typography>
            <div>
               <Button component={RouterLink} to="/old-calc" sx={{ color: 'white' }}>
                  Старый калькулятор
               </Button>
               <Button component={RouterLink} to="/simple-calc" sx={{ color: 'white' }}>
                  Простой калькулятор
               </Button>
            </div>
         </Toolbar>
      </AppBar>
   );
}

export default NavBar;