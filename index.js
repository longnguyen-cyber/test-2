const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World2')
})

app.listen(5000, () => {
  console.log('Server is running on port 5000')
})
