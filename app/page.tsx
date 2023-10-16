// 'use client'
// components
import Link from 'next/link'
import Image from 'next/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion'
import {Separator} from '@/components/ui/Separator'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/Card'

import Me from '@/public/myself.png'
import Logo from '@/public/logo.png'
import Github from '@/public/github-mark.png'
import Education from '@/public/education.svg'
import Work from '@/public/work.svg'
import Tool from '@/public/tools.svg'
import Repo from '@/public/repo.svg'
import Typescript from '@/public/typescript.svg'
import Javascript from '@/public/js.svg'
import Rust from '@/public/rust.svg'
import ReactIcon from '@/public/react-icon.svg'
import Redux from '@/public/redux.svg'
import Tailwind from '@/public/tailwindcss.svg'
import Vue from '@/public/vue.svg'
import PostgreSQL from '@/public/postgresql.svg'
import Git from '@/public/git.svg'
import Docker from '@/public/docker.svg'
import NodeIcon from '@/public/nodejs.svg'
import Stock from '@/public/stock-app.png'
import WEiZ from '@/public/WEiZ.png'
import Mailbox from '@/components/Mailbox'
export default function Home() {
  return (
    <>
      <header className='sticky top-0 z-10 bg-white shadow-md h-14'>
        <div className='container flex flex-row justify-between px-4 py-2 h-14'>
          <Link href='/'>
            <Image src={Logo} width='48' alt='logo' />
          </Link>
          <Link href='https://github.com/ancishih'>
            <Image src={Github} width='40' alt='github hyper-link' />
          </Link>
        </div>
      </header>
      <main className='container mx-auto'>
        <section className='px-4 pt-20 pb-10'>
          <span className='text-sm md:text-lg'>我是Chad Shih，是一名</span>
          <h3 className='fluid-text'>前端工程師</h3>
          <div className='md:flex md:flex-row lg:[&:after]:content-[""] lg:[&:after]:block lg:[&:after]:w-[calc(30%_-_14rem)] lg:[&:after]:order-2'>
            <Image
              src={Me}
              className='order-3 float-right object-scale-down w-3/5 max-w-md md:float-none md:w-2/5 shape-circle '
              alt='me'
              priority
            />
            <div>
              <span className='leading-8 md:leading-7 md:text-lg md:inline-block lg:max-w-md'>
                相關工作經驗1.5年，擅長使用React、tailwindcss進行網頁開發。熱衷學習新技術，享受解決問題當下的感覺。
              </span>
              <Mailbox className='flex items-center w-40 h-12 px-6 py-2 mt-8 bg-blue-600 rounded-lg text-neutral-50' />
              {/* <Button className=''>
                <AiOutlineMail className='text-2xl' />
                <span className='flex justify-center grow'>連繫我</span>
              </Button> */}
              {/* <Button className='flex items-center w-40 h-12 px-6 py-2 mt-4 rounded-lg bg-neutral-400 text-neutral-50'>
                <FaFileDownload className='text-2xl' />
                <span className='flex justify-center grow'>下載</span>
              </Button> */}
            </div>
          </div>
        </section>
        <Separator className='w-[calc(100%_-_1rem)] mx-auto' />
        <section className='px-4 py-10'>
          <div className='relative flex flex-row items-center gap-3 px-8 pb-3'>
            <Image src={Tool} alt='skill' className='absolute w-9 -left-4' />
            <h3 className='text-3xl font-bold'>技能</h3>
          </div>
          <div className='flex flex-col items-center gap-6 mt-3 md:flex-row md:flex-wrap'>
            <Card className='w-64'>
              <CardHeader>
                <CardTitle className='font-normal'>程式語言</CardTitle>
              </CardHeader>
              <CardContent className='flex items-center gap-2'>
                <Image src={Typescript} alt='' className='w-10' />
                <Image src={Javascript} alt='' className='w-10' />
                <Image src={Rust} alt='' className='w-10' />
              </CardContent>
            </Card>
            <Card className='w-64'>
              <CardHeader>
                <CardTitle className='font-normal'>前端</CardTitle>
              </CardHeader>
              <CardContent className='flex items-center gap-2'>
                <Image src={ReactIcon} alt='' className='w-10' />
                <Image src={Vue} alt='' className='w-10' />
                <Image src={Redux} alt='' className='w-10' />
                <Image src={Tailwind} alt='' className='w-10' />
              </CardContent>
            </Card>
            <Card className='w-64'>
              <CardHeader>
                <CardTitle className='font-normal'>後端</CardTitle>
              </CardHeader>
              <CardContent className='flex items-center gap-2'>
                <Image src={NodeIcon} alt='' className='w-10' />
                <Image src={PostgreSQL} alt='' className='w-10' />
              </CardContent>
            </Card>
            <Card className='w-64'>
              <CardHeader>
                <CardTitle className='font-normal'>開發工具</CardTitle>
              </CardHeader>
              <CardContent className='flex items-center gap-2'>
                <Image src={Git} alt='' className='w-10' />
                <Image src={Docker} alt='' className='w-10' />
              </CardContent>
            </Card>
          </div>
        </section>
        <Separator className='w-[calc(100%_-_1rem)] mx-auto' />
        <section className='px-4 py-10'>
          <div className='relative flex flex-row items-center gap-3 px-8 pb-3 mb-4'>
            <Image src={Repo} alt='project' className='absolute w-9 -left-4' />
            <h3 className='text-3xl font-bold'>專案</h3>
          </div>
          <div className='flex flex-col items-center gap-6 md:flex-row'>
            <Link href='/portfolio/stock'>
              <Card className='w-64 flex flex-col justify-between transition-transform h-[26rem] ring-1 hover:shadow-lg hover:-translate-y-2'>
                <CardHeader>
                  <CardTitle className='text-xl'>Stock-app</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center justify-center sm:items-baseline'>
                    <Image src={Stock} className='w-full' alt='my-stock-app' />
                  </div>
                  <div className='py-6 text-lg'>
                    個人專案是前後端分離的網站，可查詢美股S&P500公司資料。
                  </div>
                  <div className='text-sm'>
                    使用技術:
                    <div className='flex flex-row gap-2 my-0.5'>
                      <Image src={ReactIcon} alt='' className='w-8' />
                      <Image src={Tailwind} alt='' className='w-8' />
                      <Image src={PostgreSQL} alt='' className='w-8' />
                      <Image src={Rust} alt='' className='w-8' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href='https://www.weiboltd.com/公司簡介/關於威柏'>
              <Card className='flex flex-col justify-between w-64 h-[26rem] transition-transform ring-1 hover:shadow-lg hover:-translate-y-2'>
                <CardHeader>
                  <CardTitle>威柏WEiZ</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image className='w-full' src={WEiZ} alt='my-stock-app' />
                  <div className='py-6 text-lg'>
                    此專案為前公司承接的案子，單純網頁RWD切版。
                  </div>
                  <div className='text-sm'>
                    使用技術:
                    <div className='flex flex-row gap-2 my-0.5'>
                      <Image src={Tailwind} alt='' className='w-8' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
        <Separator className='w-[calc(100%_-_1rem)] mx-auto' />
        <section className='px-4 py-10'>
          <div className='relative flex flex-row items-center gap-3 px-8 pb-3'>
            <Image src={Work} className='absolute w-9 -left-4' alt='' />
            <h3 className='text-3xl font-bold'>工作經驗</h3>
          </div>
          <div className='border-l-2 border-slate-600'>
            <Accordion
              type='multiple'
              className='flex flex-col w-full gap-4'
              defaultValue={['crepower', 'innolux']}
            >
              <AccordionItem value='crepower'>
                <AccordionTrigger className='text-xl relative [&:before]:content-[""] [&:before]:absolute [&:before]:w-4 [&:before]:h-4 [&:before]:rounded-full [&:before]:border-2 [&:before]:border-black [&:before]:-left-2 [&:before]:bg-slate-100 [&>:last-child]:hidden'>
                  <span className='pl-3'>
                    創力美股份有限公司
                    <span className='text-sm hidden @sm:inline @md:text-xl pl-2'>
                      &#40;Crepowermay corp.&#41;
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ol className='flex flex-col gap-2 pl-3 list-decimal list-inside'>
                    <li>擔任前端工程師，在職期間2021年05月初~2022年12月底。</li>
                    <li>
                      使用Nextjs、Vue 2、tailwindcss、SCSS等前端技術開發專案。
                    </li>
                    <li>與後端工程師討論資料格式，並串接API。</li>
                    <li>
                      <span className='inline-block'>負責專案&#58;</span>
                      <ul className='ml-6 list-disc list-inside'>
                        <li>
                          用Vue2、scss開發黛利貝爾後台系統&#40;會員、發票打印、內衣修改單等系統&#41;，
                        </li>
                        <li>
                          用Vue2、scss開發海威報關後台系統&#40;客戶管理、excel上傳&#41;。
                        </li>
                        <li>
                          用Nextjs、tailwindcss開發大同醬油後台&#40;進出貨、原料建檔、領料單等系統&#41;
                        </li>
                      </ul>
                    </li>
                    <li>
                      前端新人教育訓練，發派新人工作任務、講解library使用方式。
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='innolux'>
                <AccordionTrigger className='text-xl relative [&:before]:content-[""] [&:before]:absolute [&:before]:w-4 [&:before]:h-4 [&:before]:rounded-full [&:before]:border-2 [&:before]:border-black [&:before]:-left-2 [&:before]:bg-slate-100 [&>:last-child]:hidden'>
                  <span className='pl-3'>
                    群創光電股份有限公司
                    <span className='text-sm hidden @sm:inline @md:text-xl pl-2'>
                      &#40;InnoLux corp.&#41;
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ol className='flex flex-col gap-2 pl-3 list-decimal list-inside'>
                    <li>
                      擔任設備製程工程師，在職期間2018年05月初~2020年04月底。
                    </li>
                    <li>負責UV光配向製程設備維護與檢修。</li>
                    <li>
                      <span className='inline-block'>
                        8寸車用面板產品增產計畫。
                      </span>
                      <ul className='ml-6 list-disc list-inside'>
                        <li>
                          與產品設計師配合進行DOE實驗&#40;四種產品&#41;，重新訂產品參數。
                        </li>
                        <li>
                          專案成果&#58;兩種產品通過批量量產，增加約30%的產能，改善產能瓶頸。
                        </li>
                      </ul>
                    </li>
                    <li>
                      智能工廠專案，用樹莓派做Yolo
                      OCR，擷取老舊設備數據，進入報表系統。
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        <Separator className='w-[calc(100%_-_1rem)] mx-auto' />
        <section className='px-4 py-10'>
          <div className='relative flex flex-row items-center gap-3 px-8 pb-3'>
            <Image
              src={Education}
              alt='education'
              className='absolute w-9 -left-4'
            />
            <h3 className='text-3xl font-bold'>學歷</h3>
          </div>
          <div className='flex flex-col gap-2'>
            <span className='block'>國立交通大學機械工程學系碩士畢業</span>
            <span className='block'>長庚大學機械工程學系學士畢業</span>
          </div>
        </section>
      </main>
    </>
  )
}
