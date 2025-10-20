import express from 'express'

import authRoutes from './route/authRoutes.ts'
import userRoutes from './route/userRoutes.ts'
import habitRoutes from './route/habitRoutes.ts'

const app = express()

app.get('/health', (req, res) => {
  res.send('<button>Click</button>')
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/habits', habitRoutes)

export { app }

export default app
