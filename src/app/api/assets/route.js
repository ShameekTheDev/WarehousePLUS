/**
 * API Route: Fetch Assets from Google Sheets
 * 
 * This route fetches and parses data from Google Sheets JSON endpoint
 * Handles the Google Visualization API response format
 */

export async function GET(request) {
    try {
        const sheetsUrl = process.env.NEXT_PUBLIC_SHEETS_JSON_URL

        if (!sheetsUrl) {
            return Response.json(
                { error: 'Google Sheets URL not configured' },
                { status: 500 }
            )
        }

        // Fetch from Google Sheets
        const response = await fetch(sheetsUrl, {
            next: { revalidate: 60 } // Revalidate every 60 seconds
        })

        if (!response.ok) {
            throw new Error('Failed to fetch from Google Sheets')
        }

        const text = await response.text()

        // Google Sheets returns JSONP, need to extract JSON
        // Format: google.visualization.Query.setResponse({...});
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);?/)

        if (!jsonMatch) {
            throw new Error('Invalid Google Sheets response format')
        }

        const data = JSON.parse(jsonMatch[1])

        // Parse the table data
        const table = data.table
        const cols = table.cols.map(col => col.label || col.id)
        const rows = table.rows.map(row => {
            const obj = {}
            row.c.forEach((cell, index) => {
                obj[cols[index]] = cell ? cell.v : null
            })
            return obj
        })

        return Response.json({
            success: true,
            data: rows,
            count: rows.length,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Error fetching assets:', error)
        return Response.json(
            {
                error: 'Failed to fetch assets',
                message: error.message
            },
            { status: 500 }
        )
    }
}
