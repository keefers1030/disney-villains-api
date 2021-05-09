/* eslint-disable no-console */
const express = require('express')

const app = express()

app.set('view engine', 'pug')

app.get('/villains', (req, res) => {
  res.render('index')
})

app.all('*', (req, res) => {
  return res.sendStatus(404)
})

app.listen(8888, () => {
  console.log('Listening on port 8888...')
})
