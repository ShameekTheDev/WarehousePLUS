import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans'
})

export const metadata = {
    title: 'Warehouse+ | Asset Management Platform',
    description: 'Lightweight, frontend-only asset management platform powered by Google Sheets',
    keywords: ['asset management', 'CDN', 'developer tools', 'Google Sheets'],
    authors: [{ name: 'ShameekTheDev' }],
    viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className={inter.variable}>
                {children}
            </body>
        </html>
    )
}
