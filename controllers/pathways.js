const pathwaysRouter = require('express').Router()
const Pathway = require('../models/pathway')
const passport = require('passport')
require('../utils/authentication/jwt')

pathwaysRouter.post('/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { occupation, pathwayName, tags, description } = req.body

      const pathway = new Pathway({
        name: pathwayName,
        occupation,
        tags: JSON.parse(tags), // Manually parses as bodyParser fails to parse as array
        description,
        author: req.user._id
      })

      const savedPathway = await pathway.save()

      res.json(savedPathway)
    } catch (exception) {
      next(exception)
    }
  }
)

pathwaysRouter.get('/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      // TODO: Implement pagination here
      const pathways = await Pathway
        .find({}).populate('author', 'firstName lastName avatar')

      res.json(pathways.map(p => p.toJSON()))
    } catch (exception) {
      next(exception)
    }
  }
)

pathwaysRouter.get('/:pathwayId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const pathway = await Pathway.findById(req.params.pathwayId)
        .populate('author', 'firstName lastName avatar')
        .populate({
          path: 'modules',
          select: 'name courses description author',
          populate: { // Populates author within the module
            path: 'author',
            select: 'firstName lastName avatar'
          }
        })

      if (!pathway) {
        res.status(404).send()
        return // Must stop further execution of async code or else Express will try to send the json at the end there.
      }

      res.json(pathway)
    } catch (error) {
      next(error)
    }
  }
)

pathwaysRouter.put('/:pathwayId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const pathway = await Pathway.findById(req.params.pathwayId)

      if (!pathway) {
        res.status(404).send()
        return // Must stop further execution of async code or else Express will try to send the json at the end there.
      }

      pathway.modules.push(req.body.moduleId)
      pathway.save()

      res.json(pathway)
    } catch (error) {
      next(error)
    }
  }
)

module.exports = pathwaysRouter