const z = require('zod')

const movieSchema = z.object({
  title: z.string({ invalid_type_error: 'Title must be a string!', required_error: 'Title is required!' }),
  year: z.number({ invalid_type_error: 'Year must be a number!', required_error: 'Year is required!' }).int().min(1900).max(2025),
  director: z.string(),
  duration: z.number().min(0).max(10),
  poster: z.string().url(),
  genre: z.array(z.enum('Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Sci-Fi', 'Crime'))
})

function validateMovie (object) {
  return movieSchema.safeParse(object)
}

function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}

module.exports = { validateMovie, movieSchema, validatePartialMovie }
