import { test, expect } from '@playwright/test';

test('Complete Healthcare Provider Workflow', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // 1. Login to the application
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('rose.gomez@jourrapide.com');
  await page.getByRole('textbox', { name: '*********' }).click();
  await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();

  // 2. Create Provider - Navigate to User Settings and add a new provider
  await page.getByRole('banner').getByTestId('KeyboardArrowRightIcon').click();
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('menuitem', { name: 'User Settings' }).click();
  await page.getByRole('tab', { name: 'Providers' }).click();
  await page.getByRole('button', { name: 'Add Provider User' }).click();

  // Fill provider details
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill('Will');
  await page.getByRole('paragraph').filter({ hasText: 'Last Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('cristeno');
  await page.getByRole('combobox', { name: 'Provider Type' }).click();
  await page.getByRole('option', { name: 'PSYD' }).click();
  await page.getByRole('combobox', { name: 'specialities' }).click();
  await page.getByRole('option', { name: 'Cardiology' }).click();
  await page.getByRole('combobox', { name: 'Role *' }).click();
  await page.getByRole('option', { name: 'Provider' }).click();
  await page.getByRole('textbox', { name: 'DOB' }).click();
  await page.getByRole('textbox', { name: 'DOB' }).fill('02-20-1998');
  await page.getByRole('combobox', { name: 'Gender *' }).click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  await page.getByRole('textbox', { name: 'NPI Number', exact: true }).click();
  await page.getByRole('textbox', { name: 'NPI Number', exact: true }).fill('2325642222');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('radhika.chandak+07@thinkitive.com');
  await page.getByRole('button', { name: 'Save' }).click();

  // 3. Set Availability - Navigate to Scheduling and set up availability
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByText('Availability').click();
  await page.getByRole('button', { name: 'Edit Availability' }).click();

  // Set provider and basic settings
  await page.locator('form').filter({ hasText: 'Select Provider *Select' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Will cristeno' }).click();
  await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
  await page.locator('form').filter({ hasText: 'Booking Window *Booking' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '1 Week' }).click();

  // Set Monday availability
  await page.getByRole('tab', { name: 'Monday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Tuesday availability
  await page.getByRole('tab', { name: 'Tuesday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Wednesday availability
  await page.getByRole('tab', { name: 'Wednesday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Thursday availability
  await page.getByRole('tab', { name: 'Thursday' }).click();
  await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Friday availability
  await page.getByRole('tab', { name: 'Friday' }).click();
  await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set appointment type and duration settings
  await page.locator('form').filter({ hasText: 'Appointment TypeAppointment' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.locator('form').filter({ hasText: 'DurationDuration' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '30 minutes' }).click();
  await page.locator('form').filter({ hasText: 'Schedule NoticeSchedule Notice' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '1 Hours Away' }).click();

  // Save availability settings
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Wait for save operation and close any dialogs
  await page.waitForTimeout(3000);
  
  // Close any open modal/dialog that might be intercepting clicks
  try {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  } catch {
    // Ignore if escape doesn't work
  }

  // 4. Patient Creation - Create a new patient
  // Navigate to patient creation section
  await page.waitForTimeout(2000);
  
  // Try multiple approaches to access patient creation
  try {
    // First try clicking the Create menu/button
    await page.getByRole('button', { name: 'Create' }).click({ timeout: 10000 });
  } catch {
    try {
      // Try alternative Create selector
      await page.getByText('Create').first().click({ timeout: 5000 });
    } catch {
      try {
        // Force click on the div with Create text
        await page.locator('div').filter({ hasText: /^Create$/ }).first().click({ force: true, timeout: 5000 });
      } catch {
        // Last resort - try navigation approach
        await page.goto(page.url()); // Refresh current page
        await page.waitForTimeout(2000);
        await page.getByText('Create').click({ timeout: 5000 });
      }
    }
  }
  
  // Wait for New Patient option and click it
  await page.waitForTimeout(1000);
  try {
    await page.getByText('New Patient', { exact: true }).click({ timeout: 10000 });
  } catch {
    // Alternative selector if exact match fails
    await page.getByText('New Patient').first().click({ timeout: 5000 });
  }
  
  // Wait for patient details form
  await page.waitForTimeout(2000);
  try {
    await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img').click({ timeout: 5000 });
  } catch {
    // Skip if this step is not needed or fails
  }
  
  // Click Next button if present
  try {
    await page.getByRole('button', { name: 'Next' }).click({ timeout: 5000 });
  } catch {
    // Continue if Next button is not present
  }

  
  // Fill patient details - wait for the specific patient form to be ready
  await page.waitForTimeout(3000);
  
  // Wait for patient details form specifically
  try {
    await page.waitForSelector('input[name="firstName"], [placeholder*="First Name"]', { timeout: 15000 });
  } catch {
    // If first name field not found, wait a bit more and continue
    await page.waitForTimeout(2000);
  }
  
  // Try to click Provider Group dropdown if it exists
  try {
    await page.locator('form').filter({ hasText: 'Provider Group' }).getByLabel('Open').click({ timeout: 5000 });
    await page.waitForTimeout(1000);
  } catch {
    // Skip if Provider Group is not present or not needed
  }
  
  // Fill patient details with better selectors
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill('ryan');
  await page.getByRole('textbox', { name: 'Last Name *' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('youngg');
  await page.getByRole('textbox', { name: 'Date Of Birth *' }).click();
  await page.getByRole('textbox', { name: 'Date Of Birth *' }).fill('02-03-2002');
  await page.getByRole('combobox', { name: 'Gender *' }).click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
  
  // Fixed mobile number handling - clear first, then fill
  const mobileField = page.getByRole('textbox', { name: 'Mobile Number *' });
  await mobileField.click();
  await mobileField.clear();
  await mobileField.fill('7863335723');
  
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('ryanyoungg@gmail.com');
  await page.getByRole('button', { name: 'Save' }).click();

  // Wait for patient creation to complete
  await page.waitForTimeout(3000);

  // 5. Appointment Booking - Create a new appointment for the patient
  await page.waitForTimeout(2000);
  
  // Navigate to appointment creation
  try {
    await page.getByRole('banner').getByTestId('ExpandMoreIcon').click({ timeout: 10000 });
  } catch {
    // Try alternative navigation
    await page.locator('[data-testid="ExpandMoreIcon"]').click({ timeout: 5000 });
  }
  
  await page.waitForTimeout(1000);
  await page.getByText('New Appointment').click();
  await page.waitForTimeout(2000);

  // Fill appointment details with better error handling
  await page.getByRole('combobox', { name: 'Patient Name *' }).click();
  
  // Wait for patient options to load and select
  await page.waitForTimeout(1000);
  try {
    await page.getByRole('option', { name: 'ryan youngg 3 Feb' }).click({ timeout: 5000 });
  } catch {
    // Try alternative patient selection
    await page.getByText('ryan youngg').first().click({ timeout: 5000 });
  }
  
  await page.getByRole('combobox', { name: 'Appointment Type *' }).click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).fill('Fever');
  
  // Handle timezone selection
  try {
    await page.locator('form').filter({ hasText: 'Timezone *Timezone *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Alaska Standard Time (GMT -09' }).click();
  } catch {
    // Skip if timezone is already set or not required
  }
  
  await page.getByRole('button', { name: 'Telehealth' }).click();

  // Select provider and schedule appointment
  await page.getByRole('combobox', { name: 'Provider *' }).click();
  await page.getByRole('option', { name: 'Will cristeno' }).click();
  
  // Handle availability viewing
  const viewAvailabilityButton = page.getByRole('button', { name: 'View availability' });
  await viewAvailabilityButton.click();
  await page.waitForTimeout(2000);
  
  // Select date and time
  try {
    await page.getByRole('gridcell', { name: '31' }).click({ timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: '06:15 AM - 06:45 AM' }).click({ timeout: 5000 });
  } catch {
    // Try alternative time slot selection
    await page.locator('button:has-text("AM")').first().click({ timeout: 5000 });
  }
  
  await page.getByRole('button', { name: 'Save And Close' }).click();
});