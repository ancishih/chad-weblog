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
import '@/components/mailbox.css'
import {Cross2Icon} from '@radix-ui/react-icons'
import axios from 'axios'
import debounce from '@/utils/debounce'
import {useToast} from '@/components/ui/use-toast'
import cn from '@/utils/cn'
import {AiOutlineMail} from 'react-icons/ai'
import {Editor, EditorState} from 'draft-js'

interface Mailbox extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Mailbox({...props}: Mailbox) {
  const {toast} = useToast()
  const [open, setOpen] = React.useState(false)

  const editorRef = React.useRef(null)

  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty(),
  )

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
      const data = {
        from: `<${address}>`,
        subject,
        body: `${editorState
          .getCurrentContent()
          .getPlainText()}, email from ${address}`,
      }

      const res = await axios.post(`${process.env.APP_ENDPOINT}/api/mail`, data)

      if (res.status === 202) {
        setOpen(false)
        toast({title: '信件已送出！', description: '我將儘速與您取得聯繫。'})
      }
    }
  }

  const validator = (): boolean => {
    let bool = true
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (address.length === 0) {
      setAddressStatus(true)
      bool = false
    } else if (!emailRegex.test(address)) {
      setAddressStatus(true)
      bool = false
    }

    if (subject.length === 0) {
      setSubjectStatus(true)
      bool = false
    }
    if (editorState.getCurrentContent().getPlainText().length === 0) {
      setContentStatus(true)
      bool = false
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

    setEditorState(() => EditorState.createEmpty())
  }

  const handleEscapeKeyDown = () => {
    reset()
  }

  const handlePointerDownOutside = () => {
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(props.className)}>
        <AiOutlineMail className='text-2xl' />
        <span className='flex justify-center grow'>連繫我</span>
      </DialogTrigger>
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
            className='relative cursor-pointer h-40 p-2 rounded-md ring-1 ring-slate-400 [&[data-error=true]:before]:content-["請輸入內文"] [&[data-error=true]:before]:absolute [&[data-error=true]:before]:right-2 [&[data-error=true]:before]:top-[0rem] [&[data-error=true]:before]:text-red-500 [&[data-error=true]]:ring-red-500'
            data-error={contentStatus}
            /* @ts-expect-error type-error */
            onClick={() => editorRef.current?.focus()}
          >
            <Editor
              ref={editorRef}
              editorState={editorState}
              onChange={setEditorState}
            />
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
