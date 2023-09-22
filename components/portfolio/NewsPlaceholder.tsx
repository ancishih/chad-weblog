import Skeleton from '@/components/ui/Skeleton'

export default function NewsPlaceholder() {
  return (
    <div className='flex flex-row max-w-sm gap-3 p-6 px-3'>
      <Skeleton className='w-40 h-24' />
      <div className='flex flex-col'>
        <Skeleton className='w-40 h-6 mb-2' />
        <Skeleton className='w-40 h-6 mb-1' />
        <Skeleton className='w-24 h-4' />
      </div>
    </div>
  )
}
