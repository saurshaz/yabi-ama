import { Inter } from 'next/font/google'
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DashDryve :: AMA BI',
  description: 'DashDryve',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
        <link rel="stylesheet" href="https://flowbite.com/docs/flowbite.css?v=2.5.2a" />
        </head>
          <body className={inter.className}>{children}</body>
        </html>
  )
}