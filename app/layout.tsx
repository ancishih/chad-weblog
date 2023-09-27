import './globals.css'
import type {Metadata} from 'next'
import {Noto_Sans} from 'next/font/google'
import Toaster from '@/components/ui/toaster'
import cn from '@/utils/cn'

const noto_sans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
})
export const metadata: Metadata = {
  title: 'Chad Shih Self Hosted Web',
  description: 'powered by nextjs',
  robots: 'noindex',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body className={cn(noto_sans.className, 'relatvie')}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
