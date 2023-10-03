'use client'
import React from 'react'
import axios from 'axios'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/Tabs'
import MinuteTrend from '@/components/portfolio/MinuteTrend'
import {News} from 'Stock'
import NewsCard from '@/components/portfolio/NewsCard'
import CardPlaceholder from '@/components/portfolio/CardPlaceholder'
import {useQueries, useQuery} from '@tanstack/react-query'
import StockHeader from '@/components/portfolio/StockHeader'
import parse from 'date-fns/parse'
import isAfter from 'date-fns/isAfter'
import set from 'date-fns/set'
import add from 'date-fns/add'
import Skeleton from '@/components/ui/Skeleton'

const listNews = async () => {
  try {
    const res = await axios.get<News[]>(
      `${process.env.APP_ENDPOINT}/api/stock/news`,
    )

    if (res.status === 200) return res.data
  } catch (e) {
    throw new Error('Error', {cause: e})
  }
}

const getMajorIndices = async (symbol: string) => {
  const res = await axios.get(
    `${process.env.BASE_URL}/api/v3/historical-chart/1min/${symbol}?apikey=${process.env.APIKEY}`,
  )
  if (res.status === 200) return res.data
}

export default function StockPage() {
  const indices = ['%5EDJI', '%5EGSPC', '%5EIXIC']

  const [DOW, SP500, Nasdaq] = useQueries({
    queries: indices.map(index => {
      return {
        queryKey: ['index', index],
        queryFn: () => getMajorIndices(index),
      }
    }),
  })

  const {isLoading, isSuccess, data} = useQuery({
    queryKey: ['news_list'],
    queryFn: listNews,
  })

  const LAST_INTRADAY = set(add(new Date(), {days: -1}), {
    hours: 9,
    minutes: 29,
    seconds: 0,
  })

  return (
    <>
      <StockHeader />
      <section className='pt-10 md:px-8 line-chart-container-mobile md:line-chart-container md:pb-12'>
        <Tabs defaultValue='%5EDJI'>
          <TabsList className='flex flex-row tabs-list'>
            <TabsTrigger
              className='data-[state=active]:tabs-active px-4 py-2 rounded-t-md data-[state=active]:bg-white data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-400 transition-colors'
              value='%5EDJI'
            >
              Dow Jones
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:tabs-active px-4 py-2 rounded-t-md data-[state=active]:bg-white data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-400 transition-colors'
              value='%5EGSPC'
            >
              S&P 500
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:tabs-active px-4 py-2 rounded-t-md data-[state=active]:bg-white data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-400 transition-colors'
              value='%5EIXIC'
            >
              Nasdaq 100
            </TabsTrigger>
          </TabsList>
          <TabsContent className='tabs-content' value='%5EDJI'>
            {DOW.isLoading ? (
              <div className='w-full aspect-[2/1] flex justify-center items-center'>
                <Skeleton className='w-11/12 aspect-[2/1] m-auto' />
              </div>
            ) : null}
            {DOW.isSuccess ? (
              <MinuteTrend
                intraday={DOW.data
                  .filter(({date}: {date: string}) =>
                    isAfter(
                      parse(date, 'yyyy-MM-dd HH:mm:ss', new Date()),
                      LAST_INTRADAY,
                    ),
                  )
                  .reverse()}
              />
            ) : null}
          </TabsContent>
          <TabsContent className='tabs-content' value='%5EGSPC'>
            {SP500.isLoading ? (
              <div className='w-full aspect-[2/1] flex justify-center items-center'>
                <Skeleton className='w-11/12 aspect-[2/1] m-auto' />
              </div>
            ) : null}
            {SP500.isSuccess ? (
              <MinuteTrend
                intraday={SP500.data
                  .filter(({date}: {date: string}) =>
                    isAfter(
                      parse(date, 'yyyy-MM-dd HH:mm:ss', new Date()),
                      LAST_INTRADAY,
                    ),
                  )
                  .reverse()}
              />
            ) : null}
          </TabsContent>
          <TabsContent className='tabs-content' value='%5EIXIC'>
            {Nasdaq.isLoading ? (
              <div className='w-full aspect-[2/1] flex justify-center items-center'>
                <Skeleton className='w-11/12 aspect-[2/1] m-auto' />
              </div>
            ) : null}
            {Nasdaq.isSuccess ? (
              <MinuteTrend
                intraday={Nasdaq.data
                  .filter(({date}: {date: string}) =>
                    isAfter(
                      parse(date, 'yyyy-MM-dd HH:mm:ss', new Date()),
                      LAST_INTRADAY,
                    ),
                  )
                  .reverse()}
              />
            ) : null}
          </TabsContent>
        </Tabs>
        <div></div>
      </section>
      <section className='py-10 gap-x-6'>
        <h3 className='mb-4 text-3xl'>Latest News</h3>
        <div className='flex flex-wrap justify-around gap-y-8 md:[&>:first-child]:w-[720px]'>
          {isLoading
            ? Array.from({length: 10}).map((_, i) => (
                <CardPlaceholder key={i} />
              ))
            : null}
          {isSuccess ? data?.map(i => <NewsCard key={i.id} {...i} />) : null}
        </div>
      </section>
    </>
  )
}
