import { FastifyReply, FastifyRequest } from 'fastify'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const pump = promisify(pipeline)

export class UploadController {
  async index(request: FastifyRequest, reply: FastifyReply) {
    const imagesDishes = await prisma.upload.findMany()

    return imagesDishes
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    if (request.user.role !== 1) {
      return reply.status(401).send({ error: 'unauthorized user.' })
    }

    const upload = await request.file({
      limits: {
        fileSize: 5242880,
      },
    })

    if (!upload) return reply.status(400).send()

    if (!upload.fields.name) return reply.status(400).send()

    const imageName = upload.fields.name.value

    const extension = extname(upload.filename)

    const fileName = imageName.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../', '../', 'uploads/', fileName),
    )

    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    const imageupload = await prisma.upload.create({
      data: {
        name: imageName,
        imagePath: fileUrl,
      },
    })

    return imageupload
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    if (request.user.role !== 1) {
      return reply.status(401).send({ error: 'unauthorized user.' })
    }

    const paramsShema = z.object({
      id: z.string(),
    })

    const { id } = paramsShema.parse(request.params)

    const dishImage = await prisma.upload.findUniqueOrThrow({
      where: {
        id,
      },
    })

    await prisma.upload.delete({
      where: {
        id: dishImage.id,
      },
    })
  }
}
