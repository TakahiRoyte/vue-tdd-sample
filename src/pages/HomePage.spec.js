import HomePage from './HomePage.vue'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/vue'
import router from '../router'

describe('HomePage', () => {
  const mockRouter = {
    push: vi.fn(),
  }
  beforeEach(async () => {
    render(HomePage, {
      global: {
        plugins: [router],
        mocks: {
          $router: mockRouter,
        },
      },
    })
    await router.isReady()
  })
  afterEach(cleanup)

  it('Homeヘッダーが表示される', () => {
    const header = screen.getByRole('heading', { name: 'Home' })
    expect(header).toBeInTheDocument()
  })
})
