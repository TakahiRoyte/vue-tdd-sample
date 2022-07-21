import AboutPage from './AboutPage.vue'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/vue'
import router from '../router'

describe('AboutPage', () => {
  const mockRouter = {
    push: vi.fn(),
  }
  beforeEach(async () => {
    render(AboutPage, {
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

  it('Aboutヘッダーが表示される', () => {
    const header = screen.getByRole('heading', { name: 'About' })
    expect(header).toBeInTheDocument()
  })
})
