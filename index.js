require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')
const { response } = require('express')

// log info based on request
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(requestLogger)



app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// find individual note
app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// fetch all notes
app.get('/api/notes', (req, res) => {
  console.log('Printing all notes now!')
  Note.find().then(note => {
    res.json(note)
  })
})

// create new note
app.post('/api/notes', (req, res) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => next(error))
})

// delete specific note
app.delete('/api/notes/:id/', (req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// updating existing note
app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = req.body

  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// app.listen(3001, () => {
//   console.log('Listening on PORT 3001!')
// })