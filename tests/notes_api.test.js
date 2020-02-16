const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')
const User = require('../models/user')

const helper = require('./test_helper')

describe('when there are a few initial notes saved to the db', () => {
  beforeEach(async () => {
    await Note.deleteMany({})

    const allNotes = helper.initializationNotes
      .map(note => new Note(note))
    const promiseArray = allNotes.map(note => note.save())
    await Promise.all(promiseArray)
  })

  test('notes returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are three notes', async () => {
    const response = await api.get('/api/notes')

    expect(response.body.length).toBe(helper.initializationNotes.length)
  })

  test('the first note is about it being the first note', async () => {
    const response = await api.get('/api/notes')

    const allContents = response.body.map(n => n.content)

    expect(allContents).toContain('This is the first note!')
  })

  test('a valid note can be added ', async () => {
    const newNote = {
      content: 'This is a new note!',
      flagged: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allNotes = await helper.dbNotes()

    const contents = allNotes.map(r => r.content)

    expect(allNotes.length).toBe(helper.initializationNotes.length + 1)
    expect(contents).toContain(
      'This is a new note!'
    )
  })

  test('note without content is not saved', async () => {
    const newNote = {
      flagged: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const allNotes = await helper.dbNotes()

    expect(allNotes.length).toBe(helper.initializationNotes.length)
  })

  test('a specific note can be fetched', async () => {
    const allNotes = await helper.dbNotes()

    const noteToFetch = allNotes[0]

    // Convert date value to string as the response will contain a string
    noteToFetch.date = noteToFetch.date.toISOString()

    const fetchedNote = await api
      .get(`/api/notes/${noteToFetch.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(fetchedNote.body).toEqual(noteToFetch)
  })

  test('a specific note can be deleted', async () => {
    const unalteredNotes = await helper.dbNotes()
    const noteToDelete = unalteredNotes[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const alteredNotes = await helper.dbNotes()

    expect(alteredNotes.length).toBe(
      helper.initializationNotes.length - 1
    )

    const contents = alteredNotes.map(r => r.content)

    expect(contents).not.toContain(noteToDelete.content)
  })

  test('fails with status code 404 if ID does not exist', async () => {
    const validNonexistentId = await helper.deletedNoteId()

    await api
      .get(`/api/notes/${validNonexistentId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = 'thisisaninvalidid'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('when there is one initial user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'password' })
    await user.save()
  })

  test('creation of a new user succeeds', async () => {
    const initialUsersState = await helper.dbUsers()

    const newUser = {
      username: 'josuff',
      name: 'Joseph Semrai',
      password: 'thisisapassword123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const finalUsersState = await helper.dbUsers()
    expect(finalUsersState.length).toBe(initialUsersState.length + 1)

    const usernames = finalUsersState.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user creation fails with statuscode and message if username taken', async () => {
    const initialUsersState = await helper.dbUsers()

    const newUser = {
      username: 'root',
      name: 'some other person',
      password: 'anotherexamplepassword',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` taken')

    const finalUsersState = await helper.dbUsers()
    expect(finalUsersState.length).toBe(initialUsersState.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})