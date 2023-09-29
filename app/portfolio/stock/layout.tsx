import Providers from './providers'
export default function StockRoot({children}: {children: React.ReactNode}) {
  return (
    <main className='container max-h-screen mx-auto'>
      <Providers>{children}</Providers>
    </main>
  )
}
