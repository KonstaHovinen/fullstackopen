import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { test, expect, vi } from 'vitest'

// Exercise 5.16: Test that BlogForm calls event handler with right details
test('<BlogForm /> calls createBlog with right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('enter title')
  const authorInput = screen.getByPlaceholderText('enter author')
  const urlInput = screen.getByPlaceholderText('enter url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Testing Blog Form')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://testurl.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing Blog Form')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('http://testurl.com')
})
