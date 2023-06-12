import jwt from 'jsonwebtoken'
import { FastifyRequest, FastifyReply } from 'fastify'
import { env } from '../utils/envShema'

interface TokenPayload {
  sub: string
  email: string
  name: string
  role: number
  id: string
}

export class AuthenticationMiddleware {
  async authenticate(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return reply.status(401).send({ error: 'Token not provided.' })
    }

    try {
      const decoded = jwt.verify(token, env.SECRET) as TokenPayload
      request.user = decoded
    } catch (err) {
      reply.status(401).send({ error: 'Invalid token.' })
    }
  }
}
