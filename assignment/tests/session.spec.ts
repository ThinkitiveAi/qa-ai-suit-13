import { test, expect, Page } from '@playwright/test';

// Interfaces for type safety
interface TestUser {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  editedFirstName: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

test.describe('Staff Management Tests', () => {
  // Test data
  const testUser: TestUser = {
    firstName: 'Jeniffer',
    lastName: 'Martin',
    role: 'Front Office Admin',
    email: 'radhikachandak073+2@gmail.com',
    phone: '+1 (345) 465-7684',
    editedFirstName: 'Will'
  };

  const loginCredentials: LoginCredentials = {
    email: 'bhavna.adhav+13@thinkitive.com',
    password: 'Pass@123'
  };

  // Helper function to safely click elements
  const safeClick = async (page: Page, selector: string, timeout = 10000): Promise<boolean> => {
    try {
      await page.waitForSelector(selector, { timeout, state: 'visible' });
      await page.click(selector);
      console.log(`✓ Successfully clicked: ${selector}`);
      return true;
    } catch (error) {
      console.error(`✗ Failed to click: ${selector}`, error);
      return false;
    }
  };

  // Helper function to safely fill inputs
  const safeFill = async (page: Page, selector: string, value: string, timeout = 10000): Promise<boolean> => {
    try {
      await page.waitForSelector(selector, { timeout, state: 'visible' });
      await page.fill(selector, value);
      console.log(`✓ Successfully filled: ${selector} with "${value}"`);
      return true;
    } catch (error) {
      console.error(`✗ Failed to fill: ${selector}`, error);
      return false;
    }
  };

  // Helper function to wait for elements
  const waitForElement = async (page: Page, selector: string, timeout = 10000): Promise<boolean> => {
    try {
      await page.waitForSelector(selector, { timeout, state: 'visible' });
      console.log(`✓ Element found: ${selector}`);
      return true;
    } catch (error) {
      console.error(`✗ Element not found: ${selector}`);
      return false;
    }
  };

  test('User should be able to add, edit, archive/restore Staff', async ({ page }) => {
    // Set longer timeout for this test
    test.setTimeout(180000); // 3 minutes

    // Step 1: Navigate to login page
    await test.step('Navigate to login page', async () => {
      console.log('🔄 Navigating to login page...');
      
      await page.goto('https://qa.practiceeasily.com/auth/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Verify page loaded correctly
      const hasTitle = await page.title();
      expect(hasTitle).toMatch(/Bright Care|PracticeEasily/);
      console.log(`✓ Page loaded with title: ${hasTitle}`);
      
      // Wait for login form elements
      await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 15000 });
      console.log('✓ Login form is ready');
    });

    // Steps 2-4: Login
    await test.step('Login with valid credentials', async () => {
      console.log('🔄 Attempting to login...');
      
      // Try multiple selectors for email field
      const emailSelectors = [
        'input[name="email"]',
        'input[type="email"]', 
        'input[placeholder*="Email"]',
        'input[type="text"]:first-of-type'
      ];

      let emailFilled = false;
      for (const selector of emailSelectors) {
        if (await safeFill(page, selector, loginCredentials.email, 3000)) {
          emailFilled = true;
          break;
        }
      }
      
      if (!emailFilled) {
        await page.screenshot({ path: 'email-field-not-found.png', fullPage: true });
        throw new Error('Could not find email input field');
      }

      // Fill password
      const passwordFilled = await safeFill(page, 'input[type="password"]', loginCredentials.password);
      if (!passwordFilled) {
        await page.screenshot({ path: 'password-field-not-found.png', fullPage: true });
        throw new Error('Could not find password input field');
      }

      // Click login button
      const loginSelectors = [
        'button:has-text("Login")',
        'button[type="submit"]',
        'input[type="submit"]'
      ];

      let loginClicked = false;
      for (const selector of loginSelectors) {
        if (await safeClick(page, selector, 3000)) {
          loginClicked = true;
          break;
        }
      }

      if (!loginClicked) {
        await page.screenshot({ path: 'login-button-not-found.png', fullPage: true });
        throw new Error('Could not find login button');
      }

      // Wait for successful login - be more patient
      console.log('🔄 Waiting for login to complete...');
      await page.waitForTimeout(5000); // Give it time to process

      const loginSuccessSelectors = [
        'text=Dashboard',
        'text=Settings',
        'text=Users',
        '[data-testid="dashboard"]'
      ];

      let loginSuccess = false;
      for (const selector of loginSuccessSelectors) {
        try {
          await expect(page.locator(selector)).toBeVisible({ timeout: 20000 });
          loginSuccess = true;
          console.log(`✓ Login successful - found: ${selector}`);
          break;
        } catch (error) {
          continue;
        }
      }

      if (!loginSuccess) {
        await page.screenshot({ path: 'login-failure.png', fullPage: true });
        throw new Error('Login failed - could not verify successful login');
      }
    });

    // Steps 5-6: Navigate to Users
    await test.step('Navigate to Users section', async () => {
      console.log('🔄 Navigating to Users section...');
      
      // Wait a bit for the page to fully load
      await page.waitForTimeout(3000);

      // Multiple ways to find Users navigation
      const usersSelectors = [
        'text=Users',
        'a:has-text("Users")',
        '[data-testid="users"]',
        'nav a[href*="users"]'
      ];

      let usersClicked = false;
      for (const selector of usersSelectors) {
        if (await safeClick(page, selector, 5000)) {
          usersClicked = true;
          break;
        }
      }

      if (!usersClicked) {
        await page.screenshot({ path: 'navigation-failure.png', fullPage: true });
        throw new Error('Could not navigate to Users section');
      }

      // Verify we're on Users page
      await expect(page.locator('button:has-text("Add User")')).toBeVisible({ timeout: 15000 });
      console.log('✓ Successfully navigated to Users page');
    });

    // Steps 7-10: Add user
    await test.step('Add new user', async () => {
      console.log('🔄 Adding new user...');
      
      // Click Add User button
      const addUserClicked = await safeClick(page, 'button:has-text("Add User")');
      if (!addUserClicked) {
        await page.screenshot({ path: 'add-user-button-not-found.png', fullPage: true });
        throw new Error('Could not click Add User button');
      }

      // Wait for form to appear
      await expect(page.locator('p:has-text("Add User")')).toBeVisible({ timeout: 10000 });
      console.log('✓ Add User form opened');

      // Fill First Name
      const firstNameFilled = await safeFill(page, 'input[name="firstName"]', testUser.firstName);
      if (!firstNameFilled) {
        throw new Error('Could not fill first name');
      }

      // Fill Last Name  
      const lastNameFilled = await safeFill(page, 'input[name="lastName"]', testUser.lastName);
      if (!lastNameFilled) {
        throw new Error('Could not fill last name');
      }

      // Select Role with enhanced error handling
      console.log('🔄 Selecting role...');
      const roleSelectors = [
        '#mui-component-select-role',
        '[data-testid="role-select"]',
        '.MuiSelect-root',
        'div:has-text("Select Role")'
      ];

      let roleSelected = false;
      for (const selector of roleSelectors) {
        try {
          await page.click(selector, { timeout: 5000 });
          await page.waitForTimeout(2000); // Wait for dropdown to appear
          
          // Try to select the role
          const roleOptionSelectors = [
            `text="${testUser.role}"`,
            `li:has-text("${testUser.role}")`,
            `[data-value="${testUser.role}"]`
          ];

          for (const optionSelector of roleOptionSelectors) {
            try {
              await page.click(optionSelector, { timeout: 5000 });
              roleSelected = true;
              console.log(`✓ Role selected: ${testUser.role}`);
              break;
            } catch (error) {
              continue;
            }
          }

          if (roleSelected) break;
        } catch (error) {
          continue;
        }
      }

      if (!roleSelected) {
        await page.screenshot({ path: 'role-selection-failure.png', fullPage: true });
        throw new Error('Could not select role');
      }

      // Fill Email
      const emailFilled = await safeFill(page, 'input[name="emailId"]', testUser.email);
      if (!emailFilled) {
        throw new Error('Could not fill email');
      }

      // Fill Phone
      const phoneFilled = await safeFill(page, 'input[type="tel"]', testUser.phone);
      if (!phoneFilled) {
        throw new Error('Could not fill phone');
      }

      // Close any dropdowns and wait
      await page.keyboard.press('Escape');
      await page.waitForTimeout(2000);

      // Click Save
      const saveClicked = await safeClick(page, 'button:has-text("Save")');
      if (!saveClicked) {
        await page.screenshot({ path: 'save-button-not-found.png', fullPage: true });
        throw new Error('Could not click Save button');
      }

      // Wait for save operation to complete
      console.log('🔄 Waiting for user to be saved...');
      await page.waitForTimeout(15000); // Longer wait for save operation
    });

    // Step 11: Verify user added
    await test.step('Verify user appears in the list', async () => {
      console.log('🔄 Verifying user was added...');
      
      const fullName = `${testUser.firstName} ${testUser.lastName}`;
      
      // Wait for table to reload
      await page.waitForTimeout(5000);
      
      // First, check if we're still on the add user form (indicates save failed)
      const formStillOpen = await page.locator('p:has-text("Add User")').isVisible();
      console.log(`Form still open: ${formStillOpen}`);
      
      if (formStillOpen) {
        console.log('⚠️ Form is still open - checking for errors...');
        await page.screenshot({ path: 'form-still-open-debug.png', fullPage: true });
        
        // Look for validation errors
        let errorElements = 0;
        let errorTexts: string[] = [];
        
        // Check different types of error elements separately
        const alertElements = await page.locator('[role="alert"]').count();
        const errorClassElements = await page.locator('.error').count();
        const requiredTextElements = await page.locator(':has-text("required")').count();
        const errorTextElements = await page.locator(':has-text("error")').count();
        
        errorElements = alertElements + errorClassElements + requiredTextElements + errorTextElements;
        
        if (errorElements > 0) {
          console.log(`Found ${errorElements} potential error elements:`);
          console.log(`- Alert elements: ${alertElements}`);
          console.log(`- Error class elements: ${errorClassElements}`);  
          console.log(`- Required text elements: ${requiredTextElements}`);
          console.log(`- Error text elements: ${errorTextElements}`);
          
          // Get error texts
          if (alertElements > 0) {
            const alertTexts = await page.locator('[role="alert"]').allTextContents();
            errorTexts.push(...alertTexts);
          }
          if (errorClassElements > 0) {
            const errorClassTexts = await page.locator('.error').allTextContents();
            errorTexts.push(...errorClassTexts);
          }
          
          console.log('❌ Form validation errors:', errorTexts);
        } else {
          console.log('ℹ No obvious validation errors found');
        }
        
        // Try to close form and check table
        await page.keyboard.press('Escape');
        await page.waitForTimeout(2000);
      }
      
      // Take screenshot of current state
      await page.screenshot({ path: 'after-save-state.png', fullPage: true });
      
      // Log all table rows to see what users exist
      console.log('📋 Current users in table:');
      try {
        const tableRows = await page.locator('tbody tr').count();
        console.log(`Total rows: ${tableRows}`);
        
        for (let i = 0; i < Math.min(tableRows, 10); i++) {
          const rowText = await page.locator('tbody tr').nth(i).textContent();
          console.log(`Row ${i + 1}: ${rowText?.slice(0, 100)}...`);
        }
      } catch (error) {
        console.log('Could not read table rows');
      }
      
      // Try to find user with more specific selectors
      const userSelectors = [
        `tr:has-text("${fullName}")`,
        `tr:has-text("${testUser.firstName}")`,
        `tr:has-text("${testUser.email}")`,
        `text="${testUser.firstName}"`,
        `text="${testUser.email}"`
      ];

      let userFound = false;
      for (const selector of userSelectors) {
        try {
          const count = await page.locator(selector).count();
          console.log(`Selector "${selector}": found ${count} elements`);
          
          if (count > 0) {
            const isVisible = await page.locator(selector).first().isVisible();
            console.log(`First element visible: ${isVisible}`);
            
            if (isVisible) {
              userFound = true;
              console.log(`✓ User found using selector: ${selector}`);
              break;
            }
          }
        } catch (error) {
          console.log(`Selector failed: ${selector}`);
        }
      }

      if (!userFound) {
        // Try refreshing the page to see if user appears
        console.log('🔄 User not found, trying page refresh...');
        await page.reload();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'after-page-refresh.png', fullPage: true });
        
        // Check again after refresh
        const userFoundAfterRefresh = await page.locator(`tr:has-text("${testUser.firstName}")`).count();
        console.log(`Users found after refresh: ${userFoundAfterRefresh}`);
        
        if (userFoundAfterRefresh === 0) {
          throw new Error(`User ${fullName} not found even after refresh. Check debug screenshots.`);
        } else {
          console.log('✓ User found after page refresh');
          userFound = true;
        }
      }

      if (userFound) {
        // Verify email is present
        await expect(page.locator(`text=${testUser.email}`)).toBeVisible({ timeout: 5000 });
        console.log('✓ User successfully added and verified');
      }
    });

    // Steps 12-15: Edit user
    await test.step('Edit user information', async () => {
      console.log('🔄 Editing user information...');
      
      const fullName = `${testUser.firstName} ${testUser.lastName}`;
      
      // Find user row
      let userRow = page.locator(`tr:has-text("${fullName}")`).first();
      
      // Try to find and click the menu button
      const menuSelectors = [
        'button[aria-label*="menu"]',
        'button:has([data-testid="MoreVertIcon"])',
        'button:last-child',
        'button'
      ];

      let menuClicked = false;
      for (const selector of menuSelectors) {
        try {
          await userRow.locator(selector).click({ timeout: 5000 });
          menuClicked = true;
          console.log(`✓ Menu clicked using: ${selector}`);
          break;
        } catch (error) {
          continue;
        }
      }

      if (!menuClicked) {
        await page.screenshot({ path: 'menu-not-found.png', fullPage: true });
        throw new Error('Could not click user menu');
      }

      // Wait for menu and click Edit
      await page.waitForTimeout(2000);
      const editClicked = await safeClick(page, 'text=Edit');
      if (!editClicked) {
        throw new Error('Could not click Edit option');
      }

      // Wait for edit form
      await expect(page.locator('input[name="firstName"]')).toBeVisible({ timeout: 10000 });
      console.log('✓ Edit form opened');

      // Update first name
      await page.fill('input[name="firstName"]', '');
      await page.waitForTimeout(500);
      await page.fill('input[name="firstName"]', testUser.editedFirstName);
      console.log(`✓ Name changed to: ${testUser.editedFirstName}`);

      // Save changes
      const saveClicked = await safeClick(page, 'button:has-text("Save")');
      if (!saveClicked) {
        throw new Error('Could not click Save button');
      }

      // Wait for save to complete
      await page.waitForTimeout(8000);
      console.log('✓ User edit completed');
    });

    // Steps 16-17: Verify edit
    await test.step('Verify user name was updated', async () => {
      console.log('🔄 Verifying user name was updated...');
      
      const editedFullName = `${testUser.editedFirstName} ${testUser.lastName}`;
      
      await page.waitForTimeout(5000);

      // Verify edited name appears
      await expect(page.locator(`tr:has-text("${editedFullName}")`).first()).toBeVisible({ timeout: 15000 });
      console.log(`✓ Found updated user: ${editedFullName}`);

      // Verify old name is gone
      const oldFullName = `${testUser.firstName} ${testUser.lastName}`;
      await expect(page.locator(`tr:has-text("${oldFullName}")`)).not.toBeVisible();
      console.log(`✓ Old name removed: ${oldFullName}`);
    });

    // Steps 18-19: Archive user
    await test.step('Archive user', async () => {
      console.log('🔄 Archiving user...');
      
      const editedFullName = `${testUser.editedFirstName} ${testUser.lastName}`;
      
      // Find user row
      let userRow = page.locator(`tr:has-text("${editedFullName}")`).first();

      // Click menu button
      let menuClicked = false;
      const menuSelectors = [
        'button[aria-label*="menu"]',
        'button:has([data-testid="MoreVertIcon"])',
        'button:last-child'
      ];

      for (const selector of menuSelectors) {
        try {
          await userRow.locator(selector).click({ timeout: 5000 });
          menuClicked = true;
          console.log(`✓ Archive menu clicked using: ${selector}`);
          break;
        } catch (error) {
          continue;
        }
      }

      if (!menuClicked) {
        await page.screenshot({ path: 'archive-menu-not-found.png', fullPage: true });
        throw new Error('Could not click user menu for archive');
      }

      // Click Archive
      await page.waitForTimeout(2000);
      const archiveClicked = await safeClick(page, 'text=Archive');
      if (!archiveClicked) {
        throw new Error('Could not click Archive option');
      }

      // Handle confirmation dialog if it appears
      console.log('🔄 Checking for confirmation dialog...');
      try {
        const confirmSelectors = [
          'button:has-text("Confirm")',
          'button:has-text("Yes")',
          'button:has-text("Archive")'
        ];

        let confirmed = false;
        for (const selector of confirmSelectors) {
          try {
            await page.waitForSelector(selector, { timeout: 5000 });
            await page.click(selector);
            confirmed = true;
            console.log(`✓ Confirmation clicked: ${selector}`);
            break;
          } catch (error) {
            continue;
          }
        }

        if (!confirmed) {
          console.log('ℹ No confirmation dialog found, proceeding...');
        }
      } catch (error) {
        console.log('ℹ No confirmation dialog needed');
      }

      // Wait for archive operation to complete
      await page.waitForTimeout(8000);
      console.log('✓ Archive operation completed');
    });

    // Final verification
    await test.step('Verify user was archived', async () => {
      console.log('🔄 Verifying user was archived...');
      
      const editedFullName = `${testUser.editedFirstName} ${testUser.lastName}`;
      
      await page.waitForTimeout(5000);

      // Verify user is no longer visible in active list
      await expect(page.locator(`tr:has-text("${editedFullName}")`)).not.toBeVisible();
      
      console.log('✅ User successfully archived and removed from active list');
      console.log('🎉 Test completed successfully!');
    });
  });
});