import './globals.css'
import React from 'react'

export const metadata = {
  title: 'LOOP — Customer Feedback Intelligence',
  description: 'Classify, cluster, and retrieve grounded answers from customer feedback.'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
