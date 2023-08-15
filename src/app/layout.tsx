import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FSM Test App',
  description: 'Created by Shimi Razilov',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{background: 'linear-gradient(to right, #141e30, #243b55)', color: 'white'}}>{children}</body>
    </html>
  )
}
