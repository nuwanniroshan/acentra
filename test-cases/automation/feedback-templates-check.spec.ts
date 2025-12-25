import { test, expect } from '@playwright/test';

test('Check Feedback Templates page for console errors and functionality', async ({ page }) => {
  const consoleErrors: string[] = [];
  const consoleWarnings: string[] = [];

  // Listen for console events
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text());
    }
  });

  // Navigate to the application
  await page.goto('/acentra');

  // Check if we're on the login page
  const loginForm = page.locator('form').first();
  if (await loginForm.isVisible()) {
    // Login with superadmin credentials
    await page.fill('input[type="email"]', 'superadmin@acentra.com');
    await page.fill('input[type="password"]', 'Ok4Me2bhr!');
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard');
  }

  // Navigate to Settings
  await page.goto('/acentra/settings');

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // Click on Feedback Templates tab (index 5 for admin/HR users)
  const feedbackTab = page.locator('.MuiTabs-root .MuiTab-root').nth(5);
  await feedbackTab.click();

  // Wait for the Feedback Templates content to load
  await page.waitForSelector('[data-testid="feedback-templates-content"], .MuiTable-root, .MuiCircularProgress-root', { timeout: 10000 });

  // Wait a bit more for any dynamic content
  await page.waitForTimeout(2000);

  // Take a screenshot
  await page.screenshot({ path: 'feedback-templates-page.png', fullPage: true });

  // Get current URL
  const currentUrl = page.url();

  // Get visible content description
  const pageContent = await page.locator('.MuiBox-root').first().textContent();

  // Check if templates table is visible
  const templatesTable = page.locator('.MuiTable-root');
  const isTableVisible = await templatesTable.isVisible();

  // Check for create button
  const createButton = page.locator('button').filter({ hasText: 'Create Template' });
  const isCreateButtonVisible = await createButton.isVisible();

  // Get number of templates if table is visible
  let templateCount = 0;
  if (isTableVisible) {
    const rows = page.locator('.MuiTableBody-root .MuiTableRow-root');
    templateCount = await rows.count();
  }

  // Test creating a template with one question
  console.log('Testing template creation...');
  await createButton.click();

  // Wait for create dialog/drawer to appear
  await page.waitForSelector('text="Create Template"', { timeout: 5000 });

  // Fill template details
  const templateNameInput = page.locator('input[type="text"]').first();
  await templateNameInput.fill('Test Template');

  const descriptionTextarea = page.locator('textarea').first();
  await descriptionTextarea.fill('Test description');

  // Add a question
  await page.click('button:has-text("Add Question")');

  // Fill question details
  const questionInput = page.locator('input[type="text"]').nth(1); // Second text input (after template name)
  await questionInput.fill('Test Question');
  const helpInput = page.locator('input[type="text"]').nth(2); // Third text input
  await helpInput.fill('Test help text');

  // Save template
  await page.click('button:has-text("Create")', { force: true });

  // Wait for dialog/drawer to close
  await page.waitForSelector('[role="dialog"], .MuiDrawer-root', { state: 'hidden', timeout: 10000 });
  await page.waitForTimeout(5000); // Wait longer for API and refresh

  // Verify template was created and question count shows 1
  const updatedRows = page.locator('.MuiTableBody-root .MuiTableRow-root');
  const newTemplateCount = await updatedRows.count();
  expect(newTemplateCount).toBe(1);

  // Check question count in the table
  const questionCountCell = page.locator('.MuiTableBody-root .MuiTableRow-root .MuiTableCell-root').nth(3); // 4th column
  const questionCountText = await questionCountCell.textContent();
  expect(questionCountText).toBe('1');

  console.log('Template created successfully with 1 question');

  // Test editing the template
  console.log('Testing template editing...');
  const editButton = page.locator('.MuiTableBody-root .MuiTableRow-root .MuiIconButton-root').first();
  await editButton.click();

  // Wait for edit dialog/drawer
  await page.waitForSelector('[role="dialog"], .MuiDrawer-root', { timeout: 5000 });

  // Verify the question is loaded
  const editQuestionInputs = page.locator('input[placeholder*="Question"]');
  const editQuestionCount = await editQuestionInputs.count();
  expect(editQuestionCount).toBe(1);

  // Verify question text is loaded
  const loadedQuestionInput = page.locator('input[type="text"]').nth(1);
  const loadedQuestionText = await loadedQuestionInput.inputValue();
  expect(loadedQuestionText).toBe('Test Question');

  // Verify help text is loaded
  const loadedHelpInput = page.locator('input[type="text"]').nth(2);
  const loadedHelpText = await loadedHelpInput.inputValue();
  expect(loadedHelpText).toBe('Test help text');

  console.log('Edit dialog loaded correctly with 1 editable question');

  // Close the dialog without saving
  await page.click('button:has-text("Cancel")', { force: true });

  // Prepare report
  const report = {
    currentUrl,
    consoleErrors,
    consoleWarnings,
    pageLoadedSuccessfully: !await page.locator('.MuiCircularProgress-root').isVisible(),
    visibleElements: {
      templatesTable: isTableVisible,
      createButton: isCreateButtonVisible,
      initialTemplateCount: templateCount,
      finalTemplateCount: newTemplateCount,
      questionCountInGrid: questionCountText,
      pageContent: pageContent?.substring(0, 500) + '...' // Truncate for readability
    },
    tests: {
      templateCreation: 'PASSED',
      questionCountDisplay: 'PASSED',
      editFunctionality: 'PASSED'
    }
  };

  // Log the report
  console.log('Feedback Templates Page Report:');
  console.log(JSON.stringify(report, null, 2));

  // Assertions
  expect(report.pageLoadedSuccessfully).toBe(true);
  expect(consoleErrors.length).toBe(0); // No console errors expected
  expect(report.tests.templateCreation).toBe('PASSED');
  expect(report.tests.questionCountDisplay).toBe('PASSED');
  expect(report.tests.editFunctionality).toBe('PASSED');
});