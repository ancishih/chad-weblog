'use client'
import {QueryClientProvider, QueryClient} from 'react-query'
export default function StockRoot({children}: {children: React.ReactNode}) {
  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <main className='container mx-auto'>{children}</main>
      </QueryClientProvider>
    </>
  )
}
