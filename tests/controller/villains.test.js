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

  describe('Get villain by slug', () => {
    it('get a villain from DB using provided slug and calls response.send() with the villain', async => {
      stubbedFindOne.returns(singleVillain)
      const request = {params: { slug: 'ursula'}}
      const stubbedSend = sinon.stub()
      const response = { send: stubbedSend }

      await getVillainSlug(request, response)
      expect(stubbedFindOne).to.have.callCount(1)
      expect(stubbedFindOne.to.have.been.calledWith({ where: { slug: 'ursula '} }))
      expect(stubbedSend).to.have.been.calledWith(singleVillain)
    })

    it('return a 404 when no villain is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { slug: 'not-found' } }
      const stubbedSendStatus = sinon.stub()

      await getVillainSlug(request, response)
      expect(stubbedFindOne).to.have.been.calledWith( { where: { slug: 'not-found'} } )
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })

  it('returns a 500 error with a message', async () => {
    stubbedFindOne.throws('Error!')
    const request = { params: { slug : 'error-slug'}}

    const stubbedSend = sinon.stub()
    const stubbedStatus = sinon.stub().returns( { send: stubbedSend } )
    const response = { status: stubbedStatus }

    await getVillainSlug(request, response)

    expect(stubbedFindOne).to.have.been.calledWith({ where: {slug: 'error-slug' }})
    expect(stubbedStatus).to.have.been.calledWith(500)
    expect(stubbedSend).to.have.been.calledWith('unable to retrieve villain, please try again')  })
  })

  describe('Save new villain', () => {
  it('accepts new villain details and saves them as a villain, returns the saved hero with a 201 status', async () => {
    const stubbedCreate = sinon.stub(models.villains, 'create').returns(singleVillain)
    const request = { body: singleVillain}
    const stubbedSend = sinon.stub()
    const stubbedStatus = sinon.stub().returns( { send: stubbedSend } )
    const response = { status: stubbedStatus }

    await addNewVillain(request, response)

    expect(stubbedCreate).to.have.been.calledWith(singleVillain)
    expect(stubbedStatus).to.have.been.calledWith(201)
    expect(stubbedSend).to.have.been.calledWith(singleVillain)

    })
  })

})

