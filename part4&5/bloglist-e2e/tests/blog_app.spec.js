const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database
    await request.post('http://localhost:3003/api/testing/reset')
    
    // Create a user for testing
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  // Exercise 5.17: Test that login form is shown
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  // Exercise 5.18: Login tests
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Login
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    // Exercise 5.19: Test that a new blog can be created
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      
      await page.getByTestId('title').fill('Test Blog Title')
      await page.getByTestId('author').fill('Test Author')
      await page.getByTestId('url').fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Test Blog Title')).toBeVisible()
      await expect(page.getByText('Test Author')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        // Create a blog
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill('Test Blog')
        await page.getByTestId('author').fill('Test Author')
        await page.getByTestId('url').fill('http://test.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('Test Blog').waitFor()
      })

      // Exercise 5.20: Test that blog can be liked
      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      // Exercise 5.21: Test that user who added blog can delete it
      test('blog can be deleted by the user who added it', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        
        // Handle the confirmation dialog
        page.on('dialog', dialog => dialog.accept())
        
        await page.getByRole('button', { name: 'remove' }).click()
        
        await expect(page.getByText('Test Blog')).not.toBeVisible()
      })

      // Exercise 5.22: Test that only creator sees delete button
      test('only the creator can see the delete button', async ({ page, request }) => {
        // Create another user
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Another User',
            username: 'anotheruser',
            password: 'password'
          }
        })

        // Logout current user
        await page.getByRole('button', { name: 'logout' }).click()

        // Login as the other user
        await page.getByTestId('username').fill('anotheruser')
        await page.getByTestId('password').fill('password')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Another User logged in')).toBeVisible()

        // View the blog details
        await page.getByRole('button', { name: 'view' }).click()

        // The delete button should not be visible for non-creator
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    // Exercise 5.23: Test that blogs are sorted by likes
    describe('and several blogs exist', () => {
      beforeEach(async ({ page }) => {
        // Create first blog
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill('Blog with least likes')
        await page.getByTestId('author').fill('Author 1')
        await page.getByTestId('url').fill('http://blog1.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('Blog with least likes').waitFor()

        // Create second blog
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill('Blog with most likes')
        await page.getByTestId('author').fill('Author 2')
        await page.getByTestId('url').fill('http://blog2.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('Blog with most likes').waitFor()

        // Create third blog
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill('Blog with medium likes')
        await page.getByTestId('author').fill('Author 3')
        await page.getByTestId('url').fill('http://blog3.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText('Blog with medium likes').waitFor()
      })

      test('blogs are ordered by likes, most likes first', async ({ page }) => {
        // Like the second blog 3 times
        const blogs = page.locator('.blog')
        
        // Find and like "Blog with most likes" 3 times
        const secondBlog = page.getByText('Blog with most likes').locator('..')
        await secondBlog.getByRole('button', { name: 'view' }).click()
        await secondBlog.getByRole('button', { name: 'like' }).click()
        await secondBlog.getByText('likes 1').waitFor()
        await secondBlog.getByRole('button', { name: 'like' }).click()
        await secondBlog.getByText('likes 2').waitFor()
        await secondBlog.getByRole('button', { name: 'like' }).click()
        await secondBlog.getByText('likes 3').waitFor()

        // Like the third blog 1 time
        const thirdBlog = page.getByText('Blog with medium likes').locator('..')
        await thirdBlog.getByRole('button', { name: 'view' }).click()
        await thirdBlog.getByRole('button', { name: 'like' }).click()
        await thirdBlog.getByText('likes 1').waitFor()

        // Check the order - first blog should have most likes
        const blogElements = await blogs.all()
        const firstBlogText = await blogElements[0].textContent()
        const lastBlogText = await blogElements[2].textContent()

        expect(firstBlogText).toContain('Blog with most likes')
        expect(lastBlogText).toContain('Blog with least likes')
      })
    })
  })
})
