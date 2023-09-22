'use client'
import * as Dialog from '@radix-ui/react-dialog'
import {PiMagnifyingGlassBold, PiCommandBold} from 'react-icons/pi'
import Button from '@/components/Button'
import React from 'react'
import useDebounce from '@/utils/useDebounce'
import {useInView} from 'react-intersection-observer'
import NextImage from 'next/image'
import useSearch from '@/utils/useSearch'
import Link from 'next/link'
export default function Searchbar() {
  const [open, setOpen] = React.useState(false)

  const [inputValue, setInputValue] = React.useState<string>('')

  const debouncedValue = useDebounce(inputValue, 500)

  const {result} = useSearch(
    debouncedValue,
    1,
    debouncedValue.length > 0 ? true : false,
  )

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
        setInputValue('')
      }
    }

    document.addEventListener('keydown', down)
    return () => {
      document.removeEventListener('keydown', down)
    }
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className='flex flex-row items-center justify-between h-8 px-4 transition-colors rounded-full w-44 bg-slate-200 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-blue-500'>
          <div className='flex flex-row items-center'>
            <PiMagnifyingGlassBold className='text-slate-500/60' />
            <span className='ml-1 text-slate-400'>Search</span>
          </div>
          <div className='flex flex-row items-center px-0.5 text-xs ring-1 ring-slate-500/60'>
            <PiCommandBold className='text-slate-400' />
            <span className='text-slate-400'>K</span>
          </div>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='dialog_overlay animate-overlay-show' />
        <Dialog.Content
          className='dialog_content animate-searchbar-in min-w-[20rem]'
          tabIndex={-1}
        >
          <div className='flex flex-row items-center w-full mb-1.5 h-16 bg-white rounded-full gap-x-1.5 px-7'>
            <PiMagnifyingGlassBold size='28' />
            <input
              type='text'
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className='h-8 border-none outline-none px-0.5 text-lg flex flex-grow'
              autoFocus
            />
          </div>
          <>
            {result.length > 0 ? (
              <div className='flex flex-col overflow-auto gap-y-2 max-h-[32.5rem]'>
                {result.map(r => (
                  <Button
                    className='flex flex-row items-center px-6 py-5 bg-white rounded-md gap-x-5'
                    key={r.symbol}
                    asChild
                  >
                    <Link href={'/portfolio/stock/' + r.symbol}>
                      <div className=''>
                        <NextImage
                          src={r.img}
                          width='36'
                          height='36'
                          alt={r.company_name}
                        />
                      </div>
                      <div>
                        <span className='block font-bold'>{r.symbol}</span>
                        <span className='block text-xs text-slate-500'>
                          {r.company_name}
                        </span>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            ) : null}
          </>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
