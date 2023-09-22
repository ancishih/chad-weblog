import Image from 'next/image'
import Link from 'next/link'
import {OtherNews} from 'Stock'
import dayjs from '@/utils/dayjs'
export default function OtherNews(props: OtherNews) {
  return (
    <Link
      className='transition-all rounded-md hover:ring-1 hover:ring-slate-500 hover:shadow-lg hover:-translate-y-2'
      href={`/portfolio/stock/news/${props.id}`}
    >
      <div className='flex flex-row max-w-sm gap-3 p-6 px-3'>
        <Image
          src={props.img}
          className='object-contain'
          alt=''
          width='160'
          height='100'
        />
        <div>
          <h4 className='font-bold mb-1.5 line-clamp-4'>{props.title}</h4>
          <span className='text-sm'>
            {dayjs(props.published_date).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
      </div>
    </Link>
  )
}
