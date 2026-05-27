import { beforeAll, afterAll, beforeEach } from 'vitest'

beforeAll(() => {
  console.log('🧪 Test suite started')
})

afterAll(() => {
  console.log('✅ Test suite completed')
})

beforeEach(() => {
  // Clear mocks trước mỗi test
})
