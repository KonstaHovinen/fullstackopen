import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { describe, test, expect, vi } from 'vitest'

describe('<Blog />', () => {
  const blog = {
    id: '12345',
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 10,
    user: {
      id: 'user123',
      username: 'testuser',
      name: 'Test User'
    }
  }

  const user = {
    username: 'testuser',
    name: 'Test User'
  }

  // Exercise 5.13: Test that blog displays title and author by default
  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} user={user} updateBlog={() => {}} deleteBlog={() => {}} />)

    // Title and author should be visible
    expect(screen.getByText('Test Blog Title')).toBeDefined()
    expect(screen.getByText('Test Author')).toBeDefined()

    // URL and likes should not be visible by default
    const urlElement = screen.queryByText('http://testblog.com')
    const likesElement = screen.queryByText('likes 10')
    
    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })

  // Exercise 5.14: Test that URL and likes are shown when view button is clicked
  test('url and likes are shown when view button is clicked', async () => {
    render(<Blog blog={blog} user={user} updateBlog={() => {}} deleteBlog={() => {}} />)

    const userEventSetup = userEvent.setup()
    const viewButton = screen.getByText('view')
    await userEventSetup.click(viewButton)

    // Now URL and likes should be visible
    expect(screen.getByText('http://testblog.com')).toBeDefined()
    expect(screen.getByText('likes 10')).toBeDefined()
  })

  // Exercise 5.15: Test that like button clicked twice calls event handler twice
  test('if like button is clicked twice, event handler is called twice', async () => {
    const mockUpdateBlog = vi.fn()

    render(<Blog blog={blog} user={user} updateBlog={mockUpdateBlog} deleteBlog={() => {}} />)

    const userEventSetup = userEvent.setup()
    
    // First, click view to show the details
    const viewButton = screen.getByText('view')
    await userEventSetup.click(viewButton)

    // Then click like button twice
    const likeButton = screen.getByText('like')
    await userEventSetup.click(likeButton)
    await userEventSetup.click(likeButton)

    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})
