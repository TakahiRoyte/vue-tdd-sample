import SignUpPage from './SignUpPage.vue'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/vue'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import router from '../router'

describe('SignUpPage', () => {
  const mockRouter = {
    push: vi.fn(),
  }
  beforeEach(async () => {
    render(SignUpPage, {
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

  describe('レイアウト', () => {
    it('Sign Upヘッダーが表示される', () => {
      const header = screen.getByRole('heading', { name: 'Sign Up!' })
      expect(header).toBeInTheDocument()
    })

    it('ユーザー名の入力フォームが表示される', () => {
      const input = screen.getByLabelText('ユーザー名')
      expect(input).toBeInTheDocument()
    })

    it('メールアドレスの入力フォームが表示される', () => {
      const input = screen.getByLabelText('メールアドレス')
      expect(input).toBeInTheDocument()
    })

    it('パスワードの入力フォームが表示される', () => {
      const input = screen.getByLabelText('パスワード')
      expect(input).toBeInTheDocument()
    })

    it('パスワードの入力フォームのtypeがpasswordになっている', () => {
      const input = screen.getByLabelText('パスワード')
      expect(input.type).toBe('password')
    })

    it('パスワード確認の入力フォームが表示される', () => {
      const input = screen.getByLabelText('パスワード確認')
      expect(input).toBeInTheDocument()
    })

    it('パスワード確認の入力フォームのtypeがpasswordになっている', () => {
      const input = screen.getByLabelText('パスワード確認')
      expect(input.type).toBe('password')
    })

    it('登録ボタンが表示される', () => {
      const button = screen.getByRole('button', { name: '登録' })
      expect(button).toBeInTheDocument()
    })

    it('登録ボタンが初期表示時はdisabledとなっている', () => {
      const button = screen.getByRole('button', { name: '登録' })
      expect(button.disabled).toBe(true)
    })
  })

  describe('インタラクション', () => {
    // モックサーバー準備
    let requestBody
    const server = setupServer(
      rest.post('/api/v1/users', async (req, res, ctx) => {
        requestBody = await req.json()
        if (requestBody.username === 'Error1') {
          return res(
            ctx.status(500),
            ctx.json({
              error: {
                message: 'サーバーエラーです。時間を置いて試してください。',
              },
            })
          )
        }
        return res(ctx.status(200))
      }),
      rest.get('/api/v1/users', async (req, res, ctx) => {
        requestBody = await req.json()
        return res(ctx.status(200), ctx.json({ message: 'success' }))
      })
    )

    async function responseServerCheck(username) {
      server.listen()
      await fillAllForm(username, 'user@example.com', 'P4ssw0rd', 'P4ssw0rd')
      const button = screen.getByRole('button', { name: '登録' })
      await fireEvent.click(button)
      await server.close()
    }

    it('全フォーム入力済、かつパスワードとパスワード確認が同じ値の場合、登録のdisabledが解除される', async () => {
      await fillAllForm('Usern', 'user@example.com', 'P4ssw0rd', 'P4ssw0rd')
      const button = screen.getByRole('button', { name: '登録' })
      expect(button.disabled).toBe(false)
    })

    it('全フォーム入力済でも、パスワードが不一致の場合、登録ボタンがdiasbledになる', async () => {
      await fillAllForm('Usern', 'user@example.com', 'P4ssw0rd', 'password')
      const button = screen.getByRole('button', { name: '登録' })
      expect(button.disabled).toBe(true)
    })

    it('登録ボタン押下時にユーザー名、メールアドレス、パスワードをサーバーに送信する', async () => {
      await responseServerCheck('Usern')
      expect(requestBody).toEqual({
        username: 'Usern',
        email: 'user@example.com',
        password: 'P4ssw0rd',
      })
    })

    it('登録時にサーバーからエラーが返された場合、エラーメッセージを表示する', async () => {
      await responseServerCheck('Error1')
      const text = await screen.findByText(
        'サーバーエラーです。時間を置いて試してください。'
      )
      expect(text).toBeInTheDocument()
    })

    it('AboutをクリックするとAbout画面を表示する', async () => {
      const link = screen.getByRole('button', { name: 'About' })
      await fireEvent.click(link)
      expect(mockRouter.push).toHaveBeenCalledOnce()
      expect(mockRouter.push).toHaveBeenCalledWith('/about')
    })
  })
})

async function fillAllForm(username, email, passowrd, passwordCheck) {
  const usernameInput = screen.getByLabelText('ユーザー名')
  const emailInput = screen.getByLabelText('メールアドレス')
  const passwordInput = screen.getByLabelText('パスワード')
  const passwordCheckInput = screen.getByLabelText('パスワード確認')
  await fireEvent.update(usernameInput, username)
  await fireEvent.update(emailInput, email)
  await fireEvent.update(passwordInput, passowrd)
  await fireEvent.update(passwordCheckInput, passwordCheck)
}
