/* eslint-disable no-console */
const express = require('express')
const { getAllVillains, getVillainSlug, addNewVillain } = require('./controller/villainsController.js')

const app = express()

app.set('view engine', 'pug')

app.get('/villains', getAllVillains)

app.get('/villains/:slug', getVillainSlug)

app.post('/villains', express.json(), addNewVillain)

app.all('*', (req, res) => {
  return res.sendStatus(404)
})

app.listen(1337, () => {
  console.log('Listening on port 8888...')
})
