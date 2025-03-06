import { expect, describe, it, beforeEach } from 'vitest'
import { inMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { GetUserMetricService } from './get-user-metrics';

let checkInsRepository: inMemoryCheckInsRepository
let getUserMetricService: GetUserMetricService
describe('Get user metrics Service', () => {

  beforeEach(async () => {
    checkInsRepository = new inMemoryCheckInsRepository
    getUserMetricService = new GetUserMetricService(checkInsRepository)
  })


  it('should be able to get check-ins count from metrics', async () => {

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01'
    })

    const { checkInsCount } = await getUserMetricService.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })


})
