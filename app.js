const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const cors = require('cors')

const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()

app.use(express.json())
app.use(cors({
  origin: (origin, cb) => {
    const ACCEPTED_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:5500', 'https://movies.com']
    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
      return cb(null, true)
    }
    return cb(new Error('Not allowed by CORS'))
  }
}))

app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})
app.get('/movies', (req, res) => {
  const { gender } = req.query
  if (gender) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === gender.toLowerCase()))
    return res.json(filteredMovies)
  }

  res.json(movies)
})

app.post('/movies', (req, res) => {
  const resultValidate = validateMovie(req.body)

  if (resultValidate.error) {
    return res.status(422).json(JSON.parse(resultValidate.error.message))
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...resultValidate.data
  }

  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params

  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found!' })
  }

  const movie = movies[movieIndex]

  const resultValidate = validatePartialMovie(req.body)

  if (resultValidate.error) {
    return res.status(422).json(JSON.parse(resultValidate.error.message))
  }
  const updateMovie = {
    ...movie,
    ...resultValidate.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) {
    res.json(movie)
  }
  return res.status(404).json({ message: 'Movie not found!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
