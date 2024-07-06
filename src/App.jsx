import React from 'react'
import { Button, Typography, Container } from '@mui/material'

function App() {
  return (
    <Container>
      <Typography variant="h1" component="h2" gutterBottom>
        Hello, MUI!
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </Container>
  )
}

export default App
