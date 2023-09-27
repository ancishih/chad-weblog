import {Separator} from '@/components/ui/Separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/Card'
import Link from 'next/link'

import type {Metadata} from 'next'

export const metadata: Metadata = {
  robots: 'noindex',
}

export default function AboutPage() {
  return (
    <div className='container @container p-6 mx-auto text-slate-800'>
      <div>
        <h2 className='mt-6 mb-3'>簡介</h2>
        <p className=''>
          我是一名前端工程師，擅長使用Nextjs、Vue2、Tailwind
          CSS等框架，進行網頁的前端開發，爲使用者帶來良好的網頁體驗。
          個性雖沈穩內斂，但熱衷於接觸以及分享所學的新技術，且擅於團隊溝通。
        </p>
        <p>
          近期專注於學習rust語言，並運用於寫後端功能，所使用的後端框架是axum，搭配sqlx與postgresql互動。
        </p>
      </div>
      <Separator />
      <h2 className='mt-5 mb-3'>專業技能</h2>
      <div className='flex flex-row flex-wrap gap-5 mb-5'>
        <Card className='w-60'>
          <CardHeader>
            <CardTitle>前端技能</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='list-disc list-inside'>
              <li>React</li>
              <li>Vue2</li>
              <li>Typescript</li>
              <li>ES6</li>
              <li>HTML5</li>
              <li>Tailwind CSS</li>
            </ul>
          </CardContent>
        </Card>
        <Card className='w-60'>
          <CardHeader>
            <CardTitle>開發工具</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='list-disc list-inside'>
              <li>ESLint</li>
              <li>Prettier</li>
              <li>Docker</li>
              <li>npm</li>
              <li>pug</li>
              <li>Git</li>
            </ul>
          </CardContent>
        </Card>
        <Card className='w-60'>
          <CardHeader>
            <CardTitle>後端技能</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='list-disc list-inside'>
              <li>PostgreSQL</li>
              <li>Rust</li>
              <li>Postman</li>
              <li>curl</li>
              <li>RESTful API</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Separator />
      <h2 className='mt-5 mb-3'>工作經歷</h2>
      <div className='flex flex-row max-w-2xl mb-5'>
        <Accordion
          type='multiple'
          className='flex flex-col w-full gap-4'
          defaultValue={['crepower', 'innolux']}
        >
          <AccordionItem value='crepower'>
            <AccordionTrigger className='text-xl'>
              <span>
                創力美股份有限公司
                <span className='text-sm hidden @sm:inline @md:text-xl pl-2'>
                  &#40;Crepowermay corp.&#41;
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ol className='flex flex-col gap-2 list-decimal list-inside'>
                <li>擔任，在職時間2021年05月~2022年12月。</li>
                <li>
                  使用Nextjs、Vue
                  2等前端技術開發專案，搭配TailwindCSS、或者SCSS。
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
            <AccordionTrigger className='text-xl'>
              <span>
                群創光電股份有限公司
                <span className='text-sm hidden @sm:inline @md:text-xl pl-2'>
                  &#40;InnoLux corp.&#41;
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ol className='flex flex-col gap-2 list-decimal list-inside'>
                <li className='indent-0'>
                  擔任設備製程工程師，在職期間2018年05月~2020年05月。
                </li>
                <li className='indent-0'>負責UV光配向製程設備維護與檢修。</li>
                <li className='indent-0'>
                  <span className='inline-block'>
                    8寸車用面板產品增產計畫。
                  </span>
                  <ul className='ml-6 list-disc list-inside'>
                    <li>改造舊型UV光配向機台。</li>
                    <li>
                      與產品設計師配合進行DOE實驗&#40;四種產品&#41;，重新訂產品參數。
                    </li>
                    <li>
                      專案成果&#58;兩種產品通過批量量產，，增加約30%的產能，改善產能瓶頸。
                    </li>
                  </ul>
                </li>
                <li className='indent-0'>
                  智能工廠專案，用樹莓派做Yolo
                  OCR，擷取老舊設備數據，進入報表系統。
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Separator />
      <h2 className='mt-5 mb-3'>學經歷</h2>
      <ul className='mb-5 ml-5 list-disc'>
        <li>國立交通大學機械工程學系研究所碩士畢業。</li>
        <li>長庚大學機械工程學系學士畢業。</li>
      </ul>
      <Separator />
      <></>
      <Link href='/portfolio'>
        <h2 className='inline-block'>
          個人作品集<span className='hover:text-blue-500'>&#40;點我&#41;</span>
        </h2>
      </Link>
    </div>
  )
}
