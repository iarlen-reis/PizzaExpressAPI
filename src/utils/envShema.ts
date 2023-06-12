import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.string().optional(),
  PORT: z.number().optional(),
  SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
