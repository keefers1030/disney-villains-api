const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { describe, it } = require('mocha')
const { getAllVillains, getVillainSlug, addNewVillain } = require('../../controller/villainsController')
const models = require ('../../models')
const { villainsList, singleVillain } = require('../mocks/villains')
const { req } = require('express')
const { heroesList } = require('../../../super-hero-api/tests/mocks/heroes')

chai.use(sinonChai)
const { expect } = chai

describe('Villains controller', () => {

  let stubbedFineOne

  before(() => {
    stubbedFindOne = sinon.stub(models.villains, 'findone')
  })

  afterEach(() => {
    stubbedFindOne.resetBehavior()
  })

  describe('Gets all villains', () => {
    it('gets a list of villains from DB and calls response.send() with that list', async => {
      const stubbedFindAll = sinon.stub(models.villains, 'findAll').returns(villainsList)
      const stubbedSend = sinon.stub()
      const response = { send: stubbedSend }

      await getAllVillains({}, response)
      expect(stubbedFindAll.to.have.callCount(1))
      expect(stubbedSend).to.have.been.calledWith(villainsList)
    })
  })
})

