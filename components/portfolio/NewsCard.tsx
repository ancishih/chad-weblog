'use client'
import {useInView} from 'react-intersection-observer'
import React from 'react'
import dayjs from '@/utils/dayjs'
import NextImage from 'next/image'
import {News} from 'Stock'
import {useRouter} from 'next/navigation'

export default function NewsCard(props: News) {
  const {ref, inView} = useInView({threshold: 0, triggerOnce: true})
  const router = useRouter()

  return (
    <div
      className={`news-wrapper cursor-pointer ${
        inView ? 'animate-slide-in' : ''
      }`}
      ref={ref}
      onClick={() => router.push(`/portfolio/stock/news/${props.id}`)}
    >
      <div className='mb-3 text-xl font-bold'>
        {props.title}
        <span className='block mt-2 text-xs text-slate-500 text-end'>
          {dayjs(props.published_date).format('YYYY-MM-DD HH:MM:ss')}
        </span>
      </div>
      <NextImage src={props.img} alt={props.tickers} width='320' height='300' />
      <div className='mt-3 news-text line-clamp-4'>
        <p className='m-0'>
          {props.content?.[0]}
          {props.content?.[1]}
        </p>
        {props.content.map((s, i) => (
          <React.Fragment key={i}>
            {i < 2 ? null : <p className='m-0'>{s}</p>}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
