'use client'
import React from 'react'
import axios from 'axios'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/Tabs'
import MinuteTrend from '@/components/portfolio/MinuteTrend'
import {News} from 'Stock'
import NewsCard from '@/components/portfolio/NewsCard'
import CardPlaceholder from '@/components/portfolio/CardPlaceholder'
import {useQueries, useQuery} from 'react-query'
import StockHeader from '@/components/portfolio/StockHeader'
import parse from 'date-fns/parse'
import isAfter from 'date-fns/isAfter'
import set from 'date-fns/set'
import add from 'date-fns/add'
// import

const listNews = async () => {
  try {
    let res = await axios.get<News[]>(
      `${process.env.APP_ENDPOINT}/api/stock/news`,
    )

    if (res.status === 200) return res.data
  } catch (e) {
    throw new Error('Error', {cause: e})
  }
}

const getMajorIndexes = async (symbol: string) => {
  let res = await axios.get(
    `${process.env.FMP_BASE_URL}/api/v3/historical-chart/1min/${symbol}?apikey=${process.env.FMP_APIKEY}`,
  )
  if (res.status === 200) return res.data
}

export default function StockPage() {
  const indexes = ['%5EDJI', '%5EGSPC', '%5EIXIC']

  const [DOW, SP500, Nasdaq] = useQueries(
    indexes.map(index => {
      return {
        queryKey: ['index', index],
        queryFn: () => getMajorIndexes(index),
      }
    }),
  )

  const {isLoading, isError, isSuccess, data, error} = useQuery(
    'news_list',
    listNews,
  )

  const LAST_INTRADAY = set(add(new Date(), {days: -1}), {
    hours: 9,
    minutes: 29,
    seconds: 0,
  })

  console.log(DOW, SP500, Nasdaq)

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
            {DOW.isLoading ? <></> : null}
            {DOW.isSuccess ? (
              <MinuteTrend
                intraday={DOW.data.filter(({date}: {date: string}) =>
                  isAfter(
                    parse(date, 'yyyy-MM-dd HH:mm:ss', new Date()),
                    LAST_INTRADAY,
                  ),
                )}
              />
            ) : null}
          </TabsContent>
          <TabsContent className='tabs-content' value='%5EGSPC'>
            {SP500.isLoading ? <></> : null}
            {SP500.isSuccess ? (
              <MinuteTrend
                intraday={SP500.data.filter(({date}: {date: string}) =>
                  isAfter(
                    parse(date, 'yyyy-MM-dd HH:mm:ss', new Date()),
                    parse(
                      DOW.data.at(0).date,
                      'yyyy-MM-dd HH:mm:ss',
                      new Date(),
                    ).setHours(0, 0, 0, 0),
                  ),
                )}
              />
            ) : null}
          </TabsContent>
          <TabsContent className='tabs-content' value='%5EIXIC'>
            {Nasdaq.isLoading ? <></> : null}
            {Nasdaq.isSuccess ? (
              <MinuteTrend
                intraday={Nasdaq.data.filter(({date}: {date: string}) =>
                  isAfter(
                    parse(date, 'yyyy-MM-dd HH:mm:ss', new Date()),
                    parse(
                      DOW.data.at(0).date,
                      'yyyy-MM-dd HH:mm:ss',
                      new Date(),
                    ).setHours(0, 0, 0, 0),
                  ),
                )}
              />
            ) : null}
          </TabsContent>
        </Tabs>
        <div></div>
      </section>
      <section className='py-10 gap-x-6'>
        <h3 className='mb-4 text-3xl'>Latest News</h3>
        <div className='flex flex-wrap justify-around gap-y-8 md:[&>:first-child]:w-[720px]'>
          {isLoading ? (
            <>
              {Array.from({length: 10}).map((_, i) => (
                <CardPlaceholder key={i} />
              ))}
            </>
          ) : null}
          {isSuccess ? (
            <>
              {data?.map(i => (
                <NewsCard key={i.id} {...i} />
              ))}
            </>
          ) : null}
        </div>
      </section>
    </>
  )
}

//types
// import {HistoricalPrice} from 'Stock'

// function Plot({index}: {index: string}) {
//   const options = {
//     layout: {
//       padding: 20,
//     },
//     responsive: true,
//     elements: {
//       point: {
//         pointStyle: false,
//       },
//     },
//     scales: {
//       x: {
//         type: 'timeseries',
//         time: {
//           unit: 'hour',
//           displayFormats: {
//             hour: 'HH:mm',
//           },
//         },
//         ticks: {
//           maxTicksLimit: 13,
//         },
//       },
//     },
//   }

//   const dt = (d: string): boolean => {
//     let date = dateParser(d, 'yyyy-MM-dd HH:mm:SS', new Date(1970, 1, 1))
//     return isAfter(date, new Date('2023-09-01'))
//   }

//   const getData = suspend(async () => {
//     const res = await axios.get(
//       `${process.env.FMP_BASE_URL}/api/v3/historical-chart/1min/${index}?apikey=${process.env.FMP_APIKEY}`,
//     )

//     let labels = res.data
//       .filter(({date}: {date: string}) => dt(date))
//       .map(({date}: {date: string}) => date)
//       .reverse()
//     let data = res.data.map(({close}: {close: number}) => close).reverse()

//     return {labels, data}
//   }, [index])

//   return (
//     <div className='max-w-xl'>
//       <Line
//         options={options}
//         data={{labels: getData.labels, datasets: [{data: getData.data}]}}
//         width='400'
//         height='300'
//       />
//     </div>
//   )
// }
