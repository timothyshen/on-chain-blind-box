import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/provider/web3Provider'
import { NotificationProvider } from '@/contexts/notification-context'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Gacha Machine',
  description: 'Gacha Machine',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NotificationProvider>
            {children}
            <Footer />
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  )
}
