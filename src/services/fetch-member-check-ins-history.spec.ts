import { expect, describe, it, beforeEach } from 'vitest'
import { inMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInService } from './check-in';
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { FetchUserCheckInsHistoryService } from './fetch-member-check-ins-history';

let checkInsRepository: inMemoryCheckInsRepository
let fetchUserCheckInsHistoryService: FetchUserCheckInsHistoryService
describe('FetchcheckinHistory Service', () => {

  beforeEach(async () => {
    checkInsRepository = new inMemoryCheckInsRepository
    fetchUserCheckInsHistoryService = new FetchUserCheckInsHistoryService(checkInsRepository)

  })


  it('should be able to fetch check-in history', async () => {

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01'
    })

    const { checkIns } = await fetchUserCheckInsHistoryService.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' })
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {

    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await fetchUserCheckInsHistoryService.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' })
    ])
  })

})
