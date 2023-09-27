'use client'
import {ScrollArea, ScrollBar} from '@/components/ui/Scrollarea'
import React from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import {DataTableTData} from 'Stock'
export default function DataTable({data}: {data: DataTableTData}) {
  return (
    <ScrollArea className='pt-2.5'>
      <ScrollBar className='top-0 ' orientation='horizontal' />
      <div className='flex flex-row w-[136rem] [&>:nth-child(odd)]:bg-slate-200 relative [&:before]:content-[""] [&:before]:min-w-[16rem] [&:before]:bg-white [&:before]:sticky [&:before]:h-[40px] [&:before]:shadow-left [&:before]:left-0 [&:before]:top-[1px]'>
        {data.header
          ? data.header.map((e, i) => (
              <div
                key={i}
                className='text:sm min-w-[12rem] md:text-lg text-right py-1.5 px-1.5'
              >
                {e}
              </div>
            ))
          : null}
      </div>
      <Tooltip.Provider delayDuration={500}>
        {data.rawdata
          ? data.rawdata.map((r, index) => (
              <React.Fragment key={index}>
                {r.length === 1 ? (
                  <div className='text-xl relative flex flex-row md:text-3xl w-[136rem] [&>:nth-child(even)]:bg-slate-200'>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <span className='shadow-left sticky left-0 block px-6 py-4 bg-white w-[16rem] truncate'>
                          {r[0]}
                        </span>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className='px-3 py-1.5 text-white rounded-md bg-slate-800'
                          side='bottom'
                          align='start'
                        >
                          {r[0]}
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                    <>
                      {Array.from({length: 10}).map((_, i) => (
                        <div key={i} className='min-w-[12rem] h-[68px]'></div>
                      ))}
                    </>
                  </div>
                ) : null}
                {r.length === 2 ? (
                  <div
                    className={`flex flex-row relative w-[136rem] [&>:nth-child(even)]:bg-slate-200`}
                  >
                    <div
                      className={`${
                        r[1].length === 0 ? 'text-lg md:text-xl' : ''
                      } min-w-[16rem] py-3 shadow-left pl-6 pr-4 sticky left-0 bg-white`}
                    >
                      {r[0]}
                    </div>
                    {r[1].length === 0
                      ? Array.from({length: 10}).map((_, i) => (
                          <div key={i} className='min-w-[12rem] h-[52px]'></div>
                        ))
                      : null}
                    {r[1].length > 1 ? (
                      <>
                        {r[1].map((el, i) => (
                          <div
                            key={i}
                            className='min-w-[12rem] flex flex-row items-center justify-end'
                          >
                            {el[0]?.length ? (
                              <span
                                className={`block w-full text-right px-1.5 ${
                                  el[0].includes('%')
                                    ? el[0].includes('-')
                                      ? 'text-down'
                                      : 'text-up'
                                    : ''
                                }`}
                              >
                                {el[0]}
                              </span>
                            ) : null}
                            {el[1]?.length ? (
                              <span className='block w-full text-right px-1.5'>
                                {el[1]}
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </>
                    ) : null}
                  </div>
                ) : null}
              </React.Fragment>
            ))
          : null}
      </Tooltip.Provider>
    </ScrollArea>
  )
}
