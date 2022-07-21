import App from './App.vue'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/vue'
import router from './router'

describe('App', () => {
  const mockRouter = {
    push: vi.fn(),
  }
  beforeEach(async () => {
    render(App, {
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

  it('リンク Home が表示される', () => {
    const link = screen.getByRole('link', { name: 'Home' })
    expect(link).toBeInTheDocument()
  })

  it('HomeをクリックするとHome画面を表示する', async () => {
    const link = screen.getByRole('link', { name: 'Home' })
    await fireEvent.click(link)
    const page = await screen.findByTestId('home-page')
    expect(page).toBeInTheDocument()
  })

  it('リンク About が表示される', () => {
    const link = screen.getByRole('link', { name: 'About' })
    expect(link).toBeInTheDocument()
  })

  it('AboutをクリックするとAbout画面を表示する', async () => {
    const link = screen.getByRole('link', { name: 'About' })
    await fireEvent.click(link)
    const page = await screen.findByTestId('about-page')
    expect(page).toBeInTheDocument()
  })

  it('リンク SignUp が表示される', () => {
    const link = screen.getByRole('link', { name: 'SignUp' })
    expect(link).toBeInTheDocument()
  })

  it('SignUpをクリックするとSignUp画面を表示する', async () => {
    const link = screen.getByRole('link', { name: 'SignUp' })
    await fireEvent.click(link)
    const page = await screen.findByTestId('signup-page')
    expect(page).toBeInTheDocument()
  })
})
