'use client'
import axios from 'axios'
import {useQueries, QueryObserverSuccessResult} from 'react-query'
import {
  BalanceSheetData,
  CashFlowData,
  IncomeStatementData,
  StockProfileData,
  DailyPrice,
  IntradayPriceWithSymbol,
} from 'Stock'
import React from 'react'
import DataTable from '@/components/DataTable'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/Tabs'
import Link from 'next/link'
import Skeleton from '@/components/ui/Skeleton'
import StockHeader from '@/components/portfolio/StockHeader'
import DailyTrend from '@/components/portfolio/DailyTrend'
import DailyIndicator from '@/components/portfolio/DailyIndicator'
async function getIntradayPrice(symbol: string) {
  const res = await axios.get<IntradayPriceWithSymbol>(
    `${process.env.APP_ENDPOINT}/api/v2/stock/price/${symbol}`,
  )
  return res.data
}

async function getDailyPrice(symbol: string) {
  const res = await axios.get<DailyPrice>(
    `${process.env.APP_ENDPOINT}/api/stock/price/daily/${symbol}`,
  )
  return res.data
}

async function getIncomeStatement(symbol: string) {
  const res = await axios.get<IncomeStatementData>(
    `${process.env.APP_ENDPOINT}/api/stock/income_statement/${symbol}`,
  )
  return res.data
}

async function getBalanceSheet(symbol: string) {
  const res = await axios.get<BalanceSheetData>(
    `${process.env.APP_ENDPOINT}/api/stock/balance_sheet/${symbol}`,
  )
  return res.data
}

async function getCashFlow(symbol: string) {
  const res = await axios.get<CashFlowData>(
    `${process.env.APP_ENDPOINT}/api/stock/cashflow/${symbol}`,
  )
  return res.data
}

async function getProfile(symbol: string) {
  const res = await axios.get<StockProfileData>(
    `${process.env.APP_ENDPOINT}/api/stock/profile/${symbol}`,
  )
  return res.data
}

const QUERIES_FUNCTIONS = [
  getIntradayPrice,
  getDailyPrice,
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
  getProfile,
]

export default function Tickers({params}: {params: {symbol: string}}) {
  const [
    intradyPrice,
    dailyPrice,
    incomeStatement,
    balanceSheet,
    cashflow,
    profile,
  ] = useQueries(
    QUERIES_FUNCTIONS.map(fn => {
      return {
        queryKey: [fn.name, params.symbol],
        queryFn: () => fn(params.symbol),
      }
    }),
  )

  return (
    <>
      <StockHeader />
      <div className='py-10'>
        {dailyPrice.isLoading && intradyPrice.isLoading ? (
          <div className='pt-12 line-chart-container-mobile md:line-chart-container md:pb-12'>
            loading
          </div>
        ) : null}
        {dailyPrice.isSuccess && intradyPrice.isSuccess ? (
          <div className='pt-12 line-chart-container-mobile md:line-chart-container md:pb-12'>
            <DailyTrend
              daily={dailyPrice.data as DailyPrice}
              intraday={intradyPrice.data as IntradayPriceWithSymbol}
            />
            <DailyIndicator
              data={intradyPrice.data as IntradayPriceWithSymbol}
            />
          </div>
        ) : null}
        <Tabs defaultValue='income_statement'>
          <TabsList className='flex flex-row text-sm md:text-base tabs-list'>
            <TabsTrigger
              className='data-[state=active]:tabs-active px-4 py-2 rounded-t-md data-[state=active]:bg-white data-[state=inactive]:bg-slate-400/20 data-[state=inactive]:text-slate-400 transition-colors'
              value='income_statement'
            >
              Income Statement
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:tabs-active px-4 py-2 rounded-t-md data-[state=active]:bg-white data-[state=inactive]:bg-slate-400/20 data-[state=inactive]:text-slate-400 transition-colors'
              value='balance_sheet'
            >
              Balance Sheet
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:tabs-active px-4 py-2 rounded-t-md data-[state=active]:bg-white data-[state=inactive]:bg-slate-400/20 data-[state=inactive]:text-slate-400 transition-colors'
              value='cashflow'
            >
              Cashflow
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:tabs-active px-4 py-2 rounded-t-md data-[state=active]:bg-white data-[state=inactive]:bg-slate-400/20 data-[state=inactive]:text-slate-400 transition-colors'
              value='profile'
            >
              Profile
            </TabsTrigger>
          </TabsList>
          <TabsContent
            tabIndex={-1}
            className='p-1.5 pt-1 tabs-content'
            value='income_statement'
          >
            {incomeStatement.isLoading ? <div>loading</div> : null}
            {incomeStatement.isSuccess ? (
              <DataTable data={incomeStatement.data as IncomeStatementData} />
            ) : null}
          </TabsContent>
          <TabsContent
            tabIndex={-1}
            className='p-1.5 pt-1 tabs-content'
            value='balance_sheet'
          >
            {balanceSheet.isLoading ? <div>loading</div> : null}
            {balanceSheet.isSuccess ? (
              <DataTable data={balanceSheet.data as BalanceSheetData} />
            ) : null}
          </TabsContent>
          <TabsContent
            tabIndex={-1}
            className='p-1.5 pt-1 tabs-content'
            value='cashflow'
          >
            {cashflow.isLoading ? <div>loading</div> : null}
            {cashflow.isSuccess ? (
              <DataTable data={cashflow.data as CashFlowData} />
            ) : null}
          </TabsContent>
          <TabsContent
            tabIndex={-1}
            className='p-6 tabs-content'
            value='profile'
          >
            {profile.isLoading ? (
              <div className='flex flex-col gap-2'>
                <Skeleton className='w-48 delay-500 h-7' />
                <Skeleton className='w-64 h-7' />
                <Skeleton className='w-64 delay-500 h-7' />
                <Skeleton className='w-64 h-7' />
                <Skeleton className='delay-500 w-80 h-7' />
                <Skeleton className='w-48 h-7' />
                <Skeleton className='delay-500 w-52 h-7' />
                <Skeleton className='w-80 h-7' />
                <Skeleton className='w-64 delay-500 h-7' />
                <Skeleton className='w-64 h-7' />
                <Skeleton className='w-40 delay-500 h-7' />
                <Skeleton className='w-full h-7' />
                <Skeleton className='w-full delay-500 h-7' />
                <Skeleton className='w-full h-7' />
                <Skeleton className='w-full delay-500 h-7' />
                <Skeleton className='w-full h-7' />
                <Skeleton className='w-11/12 delay-500 h-7' />
              </div>
            ) : null}
            {profile.isSuccess ? (
              <div className='flex flex-col gap-2'>
                <div>Symbol: {profile.data.symbol}</div>
                <div>Company: {profile.data.company_name}</div>
                <div>Ceo: {profile.data.ceo}</div>
                <div>City: {profile.data.city}</div>
                <div>Address: {profile.data.company_address}</div>
                <div>Country: {profile.data.country}</div>
                <div>Phone: {profile.data.phone}</div>
                <div>
                  Website:{' '}
                  <Link href={profile.data.website}>
                    {profile.data.website}
                  </Link>
                </div>
                <div>Employee: {profile.data.full_time_employees}</div>
                <div>IPO date: {profile.data.ipo_date}</div>
                <div>Description:</div>
                <div>{profile.data.company_description}</div>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
