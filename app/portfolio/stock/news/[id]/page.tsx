'use client'
import React from 'react'
import axios from 'axios'
import {News} from 'Stock'
import {useQuery} from '@tanstack/react-query'
import {OtherNews as oNews} from 'Stock'
import dayjs from '@/utils/dayjs'
import ArticlePlaceholder from '@/components/portfolio/ArticlePlaceholder'
import OtherNews from '@/components/portfolio/OtherNews'
import NewsPlaceholder from '@/components/portfolio/NewsPlaceholder'
const news = async (id: string) => {
  const res = await axios.get<News>(
    `${process.env.APP_ENDPOINT}/api/stock/news/${id}`,
  )
  if (res.status == 200) return res.data
}

const otherNews = async (id: string) => {
  const res = await axios.post<oNews[]>(
    `${process.env.APP_ENDPOINT}/api/stock/news/${id}`,
  )
  if (res.status === 200) return res.data
}

export default function News({params}: {params: {id: string}}) {
  const {data, isLoading, isSuccess} = useQuery(
    ['news', params.id],
    async () => await news(params.id),
  )

  const {
    data: oData,
    isLoading: oIsLoading,
    isSuccess: oIsSuccess,
  } = useQuery(['other_news', params.id], async () => otherNews(params.id))

  let tickers: string = ''
  let content: string[] = []
  if (isSuccess) {
    tickers = data?.tickers.split(':')[1] as string
    content.push(`${data?.content[0]} ${data?.content[1]}`)
    const [, , ...lastsOfContent] = data?.content as string[]
    content = [...content, ...lastsOfContent]
  }

  return (
    <div className='min-h-[calc(100vh_-_56px)] py-20'>
      <>{isLoading ? <ArticlePlaceholder /> : null}</>
      <>
        {isSuccess ? (
          <div className='px-10 pb-20'>
            <span className='px-2.5 py-0.5 text-blue-700 font-bold rounded-md bg-blue-500/40'>
              {tickers}
            </span>
            <h3 className='mt-1.5 mb-3 text-3xl font-bold'>{data?.title}</h3>
            <span className='block text-sm text-slate-600'>
              published at:{' '}
              {dayjs(data?.published_date).format('YYYY-MM-DD HH:mm:ss')}
            </span>
            <span className='text-sm text-slate-600'>
              author: {data?.author}
            </span>

            <article className='mt-2'>
              {content.map((c, i) => (
                <p key={i} className='text-lg break-keep hyphens-auto'>
                  {c}
                </p>
              ))}
            </article>
          </div>
        ) : null}
      </>

      <div className='mb-6 text-3xl font-bold'>Other News</div>
      {oIsLoading ? (
        <div className='flex flex-row flex-wrap justify-around w-full gap-4'>
          {Array.from({length: 3}).map((_, i) => (
            <NewsPlaceholder key={i} />
          ))}
        </div>
      ) : null}
      {oIsSuccess ? (
        <div className='flex flex-row flex-wrap w-full gap-4 px-10 xl:p-0'>
          {oData?.map(i => (
            <OtherNews key={i.id} {...i} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
