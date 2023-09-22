import Skeleton from '@/components/ui/Skeleton'

export default function ArticlePlaceholder() {
  return (
    <div className='px-10 py-20'>
      <Skeleton className='h-6 mb-2 w-14' />
      <Skeleton className='w-2/3 h-10 mb-3' />
      <Skeleton className='w-40 h-3 mb-1' />
      <Skeleton className='h-3 mb-3 w-28' />
      <div className='flex flex-col max-w-2xl gap-3 mb-5'>
        <Skeleton className='h-5' />
        <Skeleton className='h-5' />
        <Skeleton className='w-5/6 h-5' />
      </div>
      <div className='flex flex-col max-w-2xl gap-3'>
        <Skeleton className='h-5' />
        <Skeleton className='h-5' />
        <Skeleton className='h-5' />
        <Skeleton className='w-5/6 h-5' />
      </div>
    </div>
  )
}
