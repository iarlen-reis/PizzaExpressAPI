import { FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      name: string
      email: string
      role: number
    }
  }
}
