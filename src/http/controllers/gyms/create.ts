import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeCreateGymService } from '@/services/factories/make-create-gym'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(req.body)

  const createGym = makeCreateGymService()

  await createGym.execute({
    title,
    description,
    phone,
    longitude,
    latitude,
  })

  return reply
    .status(201)
    .send({ success: true, message: 'Gym created successfully' })
}
