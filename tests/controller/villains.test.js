const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { describe, it } = require('mocha')
const { getAllVillains, getVillainSlug, addNewVillain } = require('../../controller/villainsController')
const models = require ('../../models')
const { villainsList, singleVillain } = require('../mocks/villains')
const { req } = require('express')

chai.use(sinonChai)
const { expect } = chai

