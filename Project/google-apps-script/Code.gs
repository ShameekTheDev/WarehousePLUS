/**
 * WAREHOUSE+ GOOGLE APPS SCRIPT
 * 
 * This script handles write operations to the Google Sheet.
 * Deploy this as a Web App and use the URL in your .env.local file.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this script
 * 4. Click Deploy > New deployment
 * 5. Select "Web app" as deployment type
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone" (or your preferred setting)
 * 8. Click Deploy and copy the Web App URL
 * 9. Add the URL to your .env.local as NEXT_PUBLIC_APPS_SCRIPT_URL
 */

// Configuration
const SHEET_NAME = 'assets'; // Name of your sheet tab
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://your-production-domain.com' // Add your production domain
];

/**
 * Handle POST requests for updating asset data
 */
function doPost(e) {
  try {
    // Parse request body
    const data = JSON.parse(e.postData.contents);
    const { id, field, value } = data;

    // Validate input
    if (!id || !field || value === undefined) {
      return createResponse(400, 'Missing required fields: id, field, value');
    }

    // Get the sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return createResponse(404, `Sheet "${SHEET_NAME}" not found`);
    }

    // Find the row with matching ID
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    
    // Find column indices
    const idColIndex = headers.indexOf('id');
    const fieldColIndex = headers.indexOf(field);
    
    if (idColIndex === -1) {
      return createResponse(400, 'ID column not found in sheet');
    }
    
    if (fieldColIndex === -1) {
      return createResponse(400, `Field "${field}" not found in sheet`);
    }

    // Find the row with matching ID
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][idColIndex] == id) {
        rowIndex = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }

    if (rowIndex === -1) {
      return createResponse(404, `Asset with ID ${id} not found`);
    }

    // Update the cell
    sheet.getRange(rowIndex, fieldColIndex + 1).setValue(value);
    
    // Update the updatedAt timestamp if that column exists
    const updatedAtColIndex = headers.indexOf('updatedAt');
    if (updatedAtColIndex !== -1) {
      const now = new Date().toISOString();
      sheet.getRange(rowIndex, updatedAtColIndex + 1).setValue(now);
    }

    return createResponse(200, 'Asset updated successfully', {
      id: id,
      field: field,
      value: value,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse(500, 'Internal server error: ' + error.toString());
  }
}

/**
 * Handle GET requests (optional - for testing)
 */
function doGet(e) {
  return createResponse(200, 'Warehouse+ API is running', {
    version: '1.0.0',
    endpoints: {
      POST: 'Update asset field'
    }
  });
}

/**
 * Create a JSON response
 */
function createResponse(status, message, data = null) {
  const response = {
    status: status,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to verify sheet access
 */
function testSheetAccess() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('Sheet not found: ' + SHEET_NAME);
    return;
  }
  
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  Logger.log('Headers: ' + values[0].join(', '));
  Logger.log('Total rows: ' + values.length);
}
