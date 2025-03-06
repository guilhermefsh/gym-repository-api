import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeCheckInService } from '@/services/factories/make-check-in-service'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { gymId } = createCheckInParamsSchema.parse(req.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(req.body)

  const checkInService = makeCheckInService()

  await checkInService.execute({
    gymId,
    userId: req.user.sub,
    userLagitude: latitude,
    userLongitude: longitude,
  })

  return reply
    .status(201)
    .send({ success: true, message: 'Gym created successfully' })
}
