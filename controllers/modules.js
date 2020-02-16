const modulesRouter = require('express').Router()
const Module = require('../models/module')
const passport = require('passport')
require('../utils/authentication/jwt')

modulesRouter.post('/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { moduleName, description, courses } = req.body

      const module = new Module({
        name: moduleName,
        courses: JSON.parse(courses), // Manually parses as bodyParser fails to parse as array
        description,
        author: req.user._id
      })

      const savedModule = await module.save()

      res.json(savedModule)
    } catch (exception) {
      next(exception)
    }
  }
)

modulesRouter.get('/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      // TODO: Implement pagination here
      const modules = await Module
        .find({}).populate('author', 'firstName lastName avatar')

      res.json(modules.map(p => p.toJSON()))
    } catch (exception) {
      next(exception)
    }
  })

// modulesRouter.get('/:moduleId',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res, next) => {
//     try {
//       const pathway = await Pathway.findById(req.params.pathwayId).populate('author', 'firstName lastName avatar')
//       res.json(pathway)
//     } catch (error) {
//       next(error)
//     }
//   }
// )

module.exports = modulesRouter