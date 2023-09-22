import Skeleton from '@/components/ui/Skeleton'
import {useInView} from 'react-intersection-observer'
import React from 'react'

export default function CardPlaceholder() {
  const {ref, inView} = useInView({threshold: 0})
  return (
    <div
      data-role='placeholder'
      className={`${
        inView ? 'block' : 'hidden'
      } news-wrapper md:[&:first-of-type>:nth-child(2)]:h-[360px]`}
      ref={ref}
    >
      <div className='flex flex-col gap-2'>
        <Skeleton className='w-64 h-8' />
        <div className='self-end'>
          <Skeleton className='h-4 w-28' />
        </div>
      </div>
      <Skeleton className='h-[180px] my-3' />
      <div className='flex flex-col gap-2'>
        <Skeleton className='w-full h-6' />
        <Skeleton className='w-full h-6' />
        <Skeleton className='w-full h-6' />
        <Skeleton className='w-11/12 h-6' />
      </div>
    </div>
  )
}
