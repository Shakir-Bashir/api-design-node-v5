import { env as loadEnv } from 'custom-env'
import { z } from 'zod'

process.env.APP_STAGE = process.env.APP_STAGE || 'developement'

const isProduction = process.env.APP_STAGE === 'production'
const isDevelopement = process.env.APP_STAGE === 'developement'
const isTesting = process.env.APP_STAGE === 'tes'

if (isDevelopement) {
  loadEnv()
} else if (isTesting) {
  loadEnv('test')
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['developement', 'test', 'production'])
    .default('developement'),

  APP_STAGE: z
    .enum(['developement', 'test', 'production'])
    .default('developement'),

  PORT: z.coerce.number().positive().default(3000),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  JWT_SECRET: z.string().min(32, 'Must be 32 chars long'),
  JWT_EXPIRES: z.string().default('7d'),
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
})

export type Env = z.infer<typeof envSchema>
let env: Env

try {
  env = envSchema.parse(process.env)
} catch (e) {
  if (e instanceof z.ZodError) {
    console.log('Invalid env var')
    console.error(JSON.stringify(e.flatten().fieldErrors, null, 2))

    e.issues.forEach((err) => {
      const path = err.path.join('.')
      console.log(`${err.message}`)
    })
    process.exit(1)
  }

  throw e
}

export const isProd = () => env.APP_STAGE === 'production'
export const isDev = () => env.APP_STAGE === 'developement'
export const isTest = () => env.APP_STAGE === 'test'

export { env }
export default env
