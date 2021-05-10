/* eslint-disable no-console */
const models = require('../models')

const getAllVillains = async (req, res) => {
  const villains = await models.villains.findAll()

  return res.send(villains)
}

const getVillainSlug = async (req, res) => {
  try {
    const { slug } = req.params

    const villains = await models.villains.findOne({ where: { slug } })

    return res.send(villains)
  } catch (e) { return res.status(404).send('404: villain not found') }
}

const addNewVillain = async (req, res) => {
  const {
    name, movie, slug
  } = req.body

  if (!name || !movie || !slug) {
    res.status(400).send('Must contain name, movie, and slug')
  }

  const newVillain = { name, movie, slug }

  const villain = await models.villains.create(newVillain)

  return res.status(201).send(villain)
}

module.exports = { getAllVillains, getVillainSlug, addNewVillain }
