
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[ 2 ]


const url = `mongodb+srv://fullstack:${password}@cluster0.rvitdtk.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)


const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// Note will be lowercases and plural automatically (for collections)
const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'Mongoose makes things easy',
  important: true,
})

note.save().then(result => {
  console.log(result)
  console.log('Note saved!')
  mongoose.connection.close()
})

Note.find({ important: true }).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.disconnect();
})