const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { describe, it } = require('mocha')
const { getAllVillains, getVillainSlug, addNewVillain } = require('../../controller/villainsController')
const models = require('../../models')
const { villainsList, singleVillain } = require('../mocks/villains')
const { req } = require('express')

chai.use(sinonChai)
const { expect } = chai

describe('Villains controller', () => {
  let stubbedFindOne

  before(() => {
    stubbedFindOne = sinon.stub(models.villains, 'findOne')
  })

  afterEach(() => {
    stubbedFindOne.resetBehavior()
  })

  describe('Get villain by id', () => {
    it('get a villain with the provided DB and calls response.send() with it', async () => {
      const stubbedFindAll = sinon.stub(models.villains, 'findAll').returns(villainsList)
      const stubbedSend = sinon.stub()
      const res = { send: stubbedSend }

      await getAllVillains({}, res)
      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(villainsList)
    })
  })

  describe('Get villain by slug', () => {
    it('get a villain from DB using provided slug and calls response.send() with the villain', async () => {
      stubbedFindOne.returns(singleVillain)
      const req = { params: { slug: 'ursula' } }
      const stubbedSend = sinon.stub()
      const res = { send: stubbedSend }

      await getVillainSlug(req, res)
      expect(stubbedFindOne).to.have.callCount(1)
      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'ursula' } })
      expect(stubbedSend).to.have.been.calledWith(singleVillain)
    })

    it('return a 404 when no villain is found', async () => {
      stubbedFindOne.returns(null)
      const req = { params: { slug: 'not-found' } }
      const stubbedSendStatus = sinon.stub()
      const res = { sendStatus: stubbedSendStatus }

      await getVillainSlug(req, res)
      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'not-found' } })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })

    it('returns a 500 error with a message', async () => {
      stubbedFindOne.throws('Error!')
      const req = { params: { slug: 'error-slug' } }

      const stubbedSend = sinon.stub()
      const stubbedStatus = sinon.stub().returns({ send: stubbedSend })
      const res = { status: stubbedStatus }

      await getVillainSlug(req, res)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'error-slug' } })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedSend).to.have.been.calledWith('unable to retrieve villain, please try again') })
  })

  describe('Save new villain', () => {
    it('accepts new villain details and saves them as a villain, returns the saved hero with a 201 status', async () => {
      const stubbedCreate = sinon.stub(models.villains, 'create').returns(singleVillain)
      const req = { body: singleVillain }
      const stubbedSend = sinon.stub()
      const stubbedStatus = sinon.stub().returns({ send: stubbedSend })
      const res = { status: stubbedStatus }

      await addNewVillain(req, res)

      expect(stubbedCreate).to.have.been.calledWith(singleVillain)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedSend).to.have.been.calledWith(singleVillain)
    })
  })
})

