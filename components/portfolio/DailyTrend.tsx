'use client'
import {
  Chart as ChartJs,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartData,
  ChartOptions,
  TimeSeriesScale,
  Legend,
  Title,
  Filler,
} from 'chart.js'
import {DailyPrice, IntradayPriceWithSymbol} from 'Stock'
import 'chartjs-adapter-date-fns'
import parse from 'date-fns/parse'
import getDay from 'date-fns/getDay'
import set from 'date-fns/set'
import add from 'date-fns/add'
import React from 'react'
import zoom from 'chartjs-plugin-zoom'
import dayjs from '@/utils/dayjs'
import {GiPlainArrow} from 'react-icons/gi'
import {Listbox} from '@headlessui/react'
import cn from '@/utils/cn'
import crosshairPlugin from 'chartjs-plugin-crosshair'

ChartJs.register(
  TimeSeriesScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  zoom,
  Legend,
  Title,
  Filler,
  crosshairPlugin,
)

export default function DailyTrend({
  daily,
  intraday,
}: {
  daily: DailyPrice
  intraday: IntradayPriceWithSymbol
}) {
  // const [dataset, setDataset] = React.useState(() =>
  //   intraday.result.data.map(({close}) => close),
  // )

  // const [labels, setLabels] = React.useState(() =>
  //   intraday.result.data.map(({time}) => {
  //     return parse(time, "yyyy-MM-dd'T'HH:mm:ss", new Date())
  //   }),
  // )

  // const [selectOptions, setSelectOptions] = React.useState<string>('')

  // const [timeOption, setTimeOption] = React.useState<Record<string, unknown>>({
  //   time: {
  //     unit: 'minute',
  //     displayFormats: {
  //       hour: 'HH:mm',
  //     },
  //   },
  //   ticks: {
  //     callback: function (val: number) {
  //       if (dayjs(val).format('HH:mm').includes('00')) {
  //         return dayjs(val).format('HH:mm')
  //       }
  //     },
  //   },
  // })

  // function getTimeOption(duration: string) {
  //   return {
  //     ticks: duration,
  //   }
  // }

  // const DURATION_OPTIONS = [
  //   {label: '1D', fn: getTimeOption('1D'), value: '1D'},
  //   {label: '5D', fn: getTimeOption('5D'), value: '5D'},
  //   {label: '1M', fn: getTimeOption('1M'), value: '1M'},
  //   {label: '3M', fn: getTimeOption('3M'), value: '3M'},
  //   {label: '6M', fn: getTimeOption('6M'), value: '6M'},
  //   {label: 'YTD', fn: getTimeOption('YTD'), value: 'YTD'},
  //   {label: '1Y', fn: getTimeOption('1Y'), value: '1Y'},
  //   {label: '3Y', fn: getTimeOption('3Y'), value: '3Y'},
  //   {label: 'MAX', fn: getTimeOption('MAX'), value: 'MAX'},
  // ]

  // let y_max =
  //   (Math.max(...dataset) - Math.min(...dataset)) * 0.05 + Math.max(...dataset)

  // let borderColor = '#737373'
  // let gradientStart = 'rgba(115,115,115,0.8)'
  // let gradientStop = 'rgba(115,115,115,0.1)'

  // const isSame = (dataset.at(-1) as number) === (dataset.at(0) as number)
  // const isPositive = (dataset.at(-1) as number) > (dataset.at(0) as number)

  // if (isSame) {
  // } else if (isPositive) {
  //   borderColor = '#01914c'
  //   gradientStart = 'rgba(1,145,76,0.8)'
  //   gradientStop = 'rgba(1,145,76,0.1)'
  // } else {
  //   borderColor = '#d6263f'
  //   gradientStart = 'rgba(214,38,63,0.8)'
  //   gradientStop = 'rgba(214,38,63,0.1)'
  // }

  // let options = {
  //   layout: {
  //     padding: 20,
  //   },
  //   plugins: {
  //     title: {
  //       display: false,
  //     },
  //     legend: {
  //       display: false,
  //     },
  //     crosshair: {
  //       enabled: true,
  //       sync: {
  //         enabled: false,
  //       },
  //     },
  //     tooltip: {
  //       animation: false,
  //       mode: 'interpolate',
  //       intersect: false,
  //       // callbacks: {
  //       //   title: function (a, d) {
  //       //     return a[0].element.x.toFixed(2)
  //       //   },
  //       //   // label: function (d) {
  //       //   //   return (
  //       //   //     d.chart.data.datasets[d.datasetIndex].label +
  //       //   //     ': ' +
  //       //   //     d.element.y.toFixed(2)
  //       //   //   )
  //       //   // },
  //       // },
  //     },
  //   },
  //   scales: {
  //     x: {
  //       type: 'timeseries',
  //       grid: {
  //         display: false,
  //       },
  //       // time: {
  //       //   unit: 'day',
  //       //   displayFormats: {
  //       //     day: 'yyyy-MM-dd',
  //       //   },
  //       // },
  //       time: {
  //         unit: 'minute',
  //         displayFormats: {
  //           hour: 'HH:mm',
  //         },
  //       },
  //       ticks: {
  //         callback: function (val: number) {
  //           if (dayjs(val).format('HH:mm').includes('00')) {
  //             return dayjs(val).format('HH:mm')
  //           }
  //         },
  //       },
  //     },
  //     y: {
  //       suggestedMax: y_max,
  //       grid: {
  //         display: false,
  //       },
  //     },
  //   },
  // }

  // function crosshair(
  //   chart: ChartJs<'line', unknown, unknown>,
  //   mouse: MouseEvent,
  // ) {
  //   chart.update('none')
  //   const x = mouse.offsetX
  //   const y = mouse.offsetY

  //   const {
  //     ctx,
  //     chartArea: {top, right, bottom, left, width, height},
  //   } = chart

  //   ctx.save()

  //   ctx.strokeStyle = 'rgba(115,115,115,1)'
  //   ctx.lineWidth = 1

  //   ctx.beginPath()
  //   ctx.moveTo(mouse.offsetX, top)
  //   ctx.lineTo(mouse.offsetX, bottom)
  //   ctx.stroke()
  //   ctx.closePath()
  // }

  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  return (
    <div className='line-chart-container '>
      <div className='aspect-[2/1] relative'>
        <div className='absolute flex flex-col left-7 -top-14'>
          <span className='text-sm py-0.5 px-2 rounded-md bg-blue-500 text-white w-fit'>
            {intraday.result.exchange_short_name} : {intraday.result.symbol}
          </span>
          <span className='text-2xl'>{intraday.result.company_name}</span>
        </div>
        <div className='absolute -top-7 right-5'></div>
        <canvas ref={canvasRef} />
        {/* <LineChart
          ref={canvasRef}
          options={options as ChartOptions}
          data={{
            labels: labels,
            datasets: [
              {
                data: dataset,
                borderColor,
                fill: true,
                backgroundColor: context => {
                  if (!context.chart.chartArea) return
                  const {
                    ctx,
                    data,
                    chartArea: {top, bottom},
                  } = context.chart
                  const gradient = ctx.createLinearGradient(0, top, 0, bottom)
                  gradient.addColorStop(0, gradientStart)
                  gradient.addColorStop(1, gradientStop)
                  return gradient
                },
                pointRadius: 0,
                pointHoverRadius: 0,
                pointHitRadius: 0,
              },
            ],
          }}
        /> */}
      </div>
      <div></div>
    </div>
  )
}
