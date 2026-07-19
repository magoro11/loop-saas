import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react'
import Providers from './providers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'LOOP — Customer Feedback Intelligence',
  description: 'Classify, cluster, and retrieve grounded answers from customer feedback.'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
