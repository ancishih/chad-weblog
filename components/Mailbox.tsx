'use client'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/Dialog'
import * as React from 'react'
import ReactQuill from 'react-quill'
import {Cross2Icon} from '@radix-ui/react-icons'
import axios from 'axios'
import debounce from '@/utils/debounce'
import $ from 'jquery'
import './mailbox.css'
import {useToast} from '@/components/ui/use-toast'
export default function Mailbox() {
  const ref = React.useRef<ReactQuill>(null)
  const {toast} = useToast()
  const [open, setOpen] = React.useState(false)

  const [address, setAddress] = React.useState('')
  const [content, setContent] = React.useState('')
  const [subject, setSubject] = React.useState('')
  const [addressStatus, setAddressStatus] = React.useState(false)
  const [subjectStatus, setSubjectStatus] = React.useState(false)
  const [contentStatus, setContentStatus] = React.useState(false)

  const handleInputChange = debounce((value: string) => {
    setSubject(value)
    if (value.length > 0) setSubjectStatus(false)
  }, 50)

  const handleAddressChange = debounce((value: string) => {
    setAddress(value)
    if (value.length > 0) setAddressStatus(false)
  }, 50)

  const mailhandler = async () => {
    const isValid = validator()
    if (isValid) {
    }
    if (ref && ref.current) {
      const data = {
        from: `<${address}>`,
        subject,
        body: `${ref.current.getEditor().getText()}, email from ${address}`,
      }

      const res = await axios.post('http://127.0.0.1:9598/api/mail', data)

      if (res.status === 202) {
        setOpen(false)
        toast({title: '信件已送出！', description: '我將儘速與您取得聯繫。'})
      }
    }
  }

  // validate address, content and subject, must fill
  const validator = (): boolean => {
    let bool = true
    if (address.length === 0) {
      setAddressStatus(true)
      bool = false
    }
    if (subject.length === 0) {
      setSubjectStatus(true)
      bool = false
    }
    if (ref && ref.current) {
      if (ref.current.getEditor().getLength() === 1) {
        $('.ql-container.ql-snow').addClass('border-red-500')
        setContentStatus(true)
        bool = false
      }
    }
    return bool
  }

  const reset = () => {
    setAddress('')
    setContent('')
    setSubject('')
    setSubjectStatus(false)
    setAddressStatus(false)
    setContentStatus(false)
  }

  const handleEscapeKeyDown = () => {
    reset()
  }

  const handlePointerDownOutside = () => {
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className='fixed inset-0 z-50 bg-slate-600/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <DialogContent
          onEscapeKeyDown={handleEscapeKeyDown}
          onPointerDownOutside={handlePointerDownOutside}
          className='min-h-[24rem] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 border border-slate-200 bg-white pb-5 pt-10 px-10 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full'
        >
          <DialogClose
            onClick={reset}
            className='absolute flex items-center justify-center w-6 h-6 right-2 top-2'
          >
            <Cross2Icon className='text-slate-400' />
          </DialogClose>
          <div className='flex flex-col gap-3'>
            <div
              data-error={addressStatus}
              className='relative [&[data-error=true]:after]:content-["請輸入email"] [&[data-error=true]:after]:absolute [&[data-error=true]:after]:right-2 flex [&[data-error=true]:after]:text-red-500 items-center'
            >
              <input
                type='text'
                placeholder='寄件人'
                data-error={addressStatus}
                className='relative flex w-full h-8 px-2 rounded-md outline-none ring-1 ring-slate-400 grow data-[error=true]:ring-red-500'
                value={address}
                onChange={e => handleAddressChange(e.target.value)}
              />
            </div>
            <div
              data-error={subjectStatus}
              className='relative [&[data-error=true]:after]:content-["請輸入標題"] [&[data-error=true]:after]:absolute [&[data-error=true]:after]:right-2 flex [&[data-error=true]:after]:text-red-500 items-center'
            >
              <input
                type='text'
                placeholder='標題'
                data-error={subjectStatus}
                className='relative flex w-full h-8 px-2 rounded-md outline-none ring-1 ring-slate-400 grow data-[error=true]:ring-red-500 '
                value={subject}
                onChange={e => handleInputChange(e.target.value)}
              />
            </div>
          </div>
          <div
            data-error={contentStatus}
            className='relative [&[data-error=true]:before]:content-["請輸入內文"] [&[data-error=true]:before]:absolute [&[data-error=true]:before]:left-4 [&[data-error=true]:before]:top-[3.25rem] [&[data-error=true]:before]:text-red-500'
          >
            {typeof document !== 'undefined' ? (
              <ReactQuill
                id='quill'
                className='h-fit'
                ref={ref}
                theme='snow'
                value={content}
                onChange={setContent}
                onKeyDown={() => {
                  $('.ql-container.ql-snow').removeClass('border-red-500')
                  setContentStatus(false)
                }}
              />
            ) : null}
          </div>
          <DialogFooter className='self-end h-9'>
            <button
              className='w-20 text-white bg-blue-500 rounded-md h-9'
              onClick={mailhandler}
            >
              發送
            </button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
