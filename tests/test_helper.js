const Note = require('../models/note')
const User = require('../models/user')

const initializationNotes = [
  {
    content: 'This is the first note!',
    date: new Date(),
    flagged: true,
  },
  {
    content: 'This is a note that happens to be the second note.',
    date: new Date(),
    flagged: false,
  },
  {
    content: 'This is the third note.',
    date: new Date(),
    flagged: true,
  }
]

const deletedNoteId = async () => {
  const note = new Note({
    content: 'This note was created as part of a test and will be deleted',
    date: new Date()
  })

  await note.save()
  await note.remove()

  return note._id.toString()
}

const dbNotes = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const dbUsers = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initializationNotes, deletedNoteId, dbNotes, dbUsers
}