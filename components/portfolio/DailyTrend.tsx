'use client'
import {
  Chart as $Chart,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeSeriesScale,
  Title,
  Filler,
  LineController,
  BarController,
  BarElement,
} from 'chart.js'
import {DailyPrice, IntradayPrice, IntradayPriceWithSymbol} from 'Stock'
import 'chartjs-adapter-date-fns'
import parse from 'date-fns/parse'
import set from 'date-fns/set'
import React from 'react'
import isAfter from 'date-fns/isAfter'
import {Chart} from 'react-chartjs-2'
import type {ChartProps} from 'react-chartjs-2'
import {Listbox} from '@headlessui/react'
import dayjs from '@/utils/dayjs'
import {BiChevronDown} from 'react-icons/bi'
import type {ChartType, DefaultDataPoint, TimeScaleOptions} from 'chart.js'
$Chart.register(
  TimeSeriesScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Title,
  Filler,
  LineController,
  BarController,
)

export default function DailyTrend({
  daily,
  intraday,
}: {
  daily: DailyPrice
  intraday: IntradayPriceWithSymbol
}) {
  const durationOptions = getDurationOptions(
    daily.result.data,
    intraday.result.data,
  )

  const [selectedItem, setSelectedItem] = React.useState(durationOptions[0])

  const yMin = Math.min(...selectedItem.value.map(({low}) => low))

  const yMax = Math.max(...selectedItem.value.map(({high}) => high))

  const ticksObject = getTimeTickandScale(selectedItem.label)

  const ABSOLUTE_X_MIN = parse(
    selectedItem.value.at(1)?.time as string,
    "yyyy-MM-dd'T'HH:mm:ss",
    new Date(),
  )

  const ABSOLUTE_X_MAX = parse(
    selectedItem.value.at(-1)?.time as string,
    "yyyy-MM-dd'T'HH:mm:ss",
    new Date(),
  )

  const [selectedXMinMax, setSelectedXMinMax] = React.useState(() => {
    return {
      min_at: 0,
      max_at: -1,
      min: ABSOLUTE_X_MIN,
      max: ABSOLUTE_X_MAX,
    }
  })

  let borderColor = '#737373'
  let gradientStart = 'rgba(115,115,115,0.8)'
  let gradientStop = 'rgba(115,115,115,0.1)'

  const isSame =
    (selectedItem.value.at(-1)?.close as number) ===
    (selectedItem.value.at(0)?.close as number)

  const isPositive =
    (selectedItem.value.at(-1)?.close as number) >
    (selectedItem.value.at(0)?.close as number)

  if (isSame) {
  } else if (isPositive) {
    borderColor = '#01914c'
    gradientStart = 'rgba(1,145,76,0.4)'
    gradientStop = 'rgba(1,145,76,0.1)'
  } else {
    borderColor = '#d6263f'
    gradientStart = 'rgba(214,38,63,0.4)'
    gradientStop = 'rgba(214,38,63,0.1)'
  }

  const chartRef = React.useRef<$Chart>(null)

  const config: ChartProps<ChartType, DefaultDataPoint<ChartType>> = {
    type: 'bar',
    data: {
      labels: selectedItem.value.map(({time}) =>
        parse(time, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
      ),
      datasets: [
        {
          type: 'line',
          data: selectedItem.value.map(({close}) => close),
          fill: true,
          borderColor,
          backgroundColor: ({chart}: {chart: $Chart}) => {
            if (!chart.chartArea) return
            const {
              ctx,
              chartArea: {top, bottom},
            } = chart
            const gradient = ctx.createLinearGradient(0, top, 0, bottom)
            gradient.addColorStop(0, gradientStart)
            gradient.addColorStop(1, gradientStop)
            return gradient
          },
          pointRadius: 0,
          pointHoverRadius: 0,
          pointHitRadius: 0,
        },
        {
          type: 'bar',
          data: selectedItem.value.map(({volume}) => volume),
          borderColor: '#737373',
          backgroundColor: 'rgba(115,115,115,0.8)',
          yAxisID: 'volume',
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          enabled: false,
        },
      },
      layout: {
        padding: 20,
      },
      scales: {
        x: {
          //@ts-ignore
          type: 'timeseries',
          grid: {
            display: false,
          },
          ...ticksObject,
          min: selectedXMinMax.min,
          max: selectedXMinMax.max,
        } as TimeScaleOptions,
        y: {
          grid: {
            display: false,
          },
          min: yMin - 0.05 * (yMax - yMin),
          max: 0.05 * (yMax - yMin) + yMax,
        },
        volume: {
          type: 'linear',
          position: 'right',
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
          min: 0,
          max: Math.max(...selectedItem.value.map(({volume}) => volume)) * 4,
        },
      },
    },
  }

  const drawCrosshair = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return
    const {
      ctx,
      chartArea: {top, bottom, left, right},
    } = chartRef.current

    chartRef.current.update('none')
    const x_coord = e.nativeEvent.offsetX
    const y_coord = e.nativeEvent.offsetY
    ctx.restore()
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.strokeStyle = '#828282'

    ctx.setLineDash([3, 3])
    if (
      x_coord >= left &&
      x_coord <= right &&
      y_coord >= top &&
      y_coord <= bottom
    ) {
      ctx.moveTo(x_coord, top)
      ctx.lineTo(x_coord, bottom)
      ctx.stroke()
    }
    ctx.closePath()
    crosshairInter(chartRef.current, e)
  }

  const crosshairInter = (
    chart: $Chart,
    e: React.MouseEvent<HTMLCanvasElement>,
  ) => {
    const {
      ctx,
      data,
      chartArea: {left, right, width, top, bottom},

      scales,
    } = chart
    const {x, y} = scales

    const x_coord = e.nativeEvent.offsetX
    const y_coord = e.nativeEvent.offsetY

    ctx.beginPath()
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3
    ctx.setLineDash([])
    ctx.fillStyle = borderColor
    const angle = Math.PI / 180
    const segments =
      selectedItem.value.length -
      selectedXMinMax.min_at +
      selectedXMinMax.max_at
    const numOfSegments = width / segments
    const index = Math.floor((x_coord - left) / numOfSegments)

    let yStart = y.getPixelForValue(data.datasets[0].data[index] as number)

    let yEnd = y.getPixelForValue(data.datasets[0].data[index + 1] as number)

    let yInterpolation =
      yStart +
      ((yEnd - yStart) / numOfSegments) *
        (x_coord - x.getPixelForValue(data.labels?.[index] as number))
    if (
      x_coord >= left &&
      x_coord <= right &&
      y_coord >= top &&
      y_coord <= bottom &&
      !isNaN(yInterpolation)
    ) {
      ctx.arc(x_coord, yInterpolation, 5, angle * 0, angle * 360, false)
      ctx.fill()
      ctx.stroke()

      const tooltipWidth = 220
      const tooltipHeight = 70
      let xTooltip = x_coord + 20
      let yTooltip = yInterpolation + 20

      if (right - xTooltip <= 240) {
        xTooltip = x_coord - 240
      } else if (xTooltip - left <= 20) xTooltip = left + 40

      if (bottom - yTooltip <= 90) {
        yTooltip = bottom - 120
      }

      ctx.beginPath()
      ctx.fillStyle = 'rgba(102,102,102,1)'
      ctx.strokeStyle = 'rgba(102,102,102,1)'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 5
      ctx.fillRect(xTooltip, yTooltip, tooltipWidth, tooltipHeight)
      ctx.strokeRect(xTooltip, yTooltip, tooltipWidth, tooltipHeight)
      ctx.closePath()

      const date = new Date(x.getValueForPixel(x_coord) as number).setSeconds(
        0,
        0,
      )

      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'white'
      ctx.font = 'bolder 14px sans-serif'
      ctx.fillText('timestamp', xTooltip + 5, yTooltip + 14)
      ctx.restore()

      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'white'
      ctx.font = 'bolder 14px sans-serif'
      ctx.fillText(
        dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
        xTooltip + 215,
        yTooltip + 14,
      )
      ctx.restore()

      const colon = 15
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'white'
      const price = 'price:'
      const textWidth = ctx.measureText(price).width
      ctx.font = '12px sans-serif'
      ctx.fillText(price, xTooltip + 5, yTooltip + 38)
      ctx.restore()

      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'white'
      ctx.font = '12px sans-serif'
      ctx.fillText(
        '$ ' + Math.ceil((data.datasets[0].data[index] as number) * 100) / 100,
        xTooltip + colon + textWidth + 5,
        yTooltip + 38,
      )
      ctx.restore()

      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'white'
      const volume = 'volume:'
      const volumeWidth = ctx.measureText(volume).width
      ctx.font = '12px sans-serif'
      ctx.fillText(volume, xTooltip + 5, yTooltip + 54)
      ctx.restore()

      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'white'
      ctx.font = '12px sans-serif'
      ctx.fillText(
        data.datasets[1].data[index]?.toString() as string,
        xTooltip + colon + volumeWidth,
        yTooltip + 54,
      )
      ctx.restore()
    }
  }

  // region --- zoom
  // const zoom = (e: React.WheelEvent<HTMLCanvasElement>) => {
  //   if (!chartRef.current) return

  //   // console.log(main)
  //   const x_coord = e.nativeEvent.offsetX

  //   let timestamp = chartRef.current.scales.x.getValueForPixel(x_coord)

  //   const numOfLabels = config.data.labels.length

  //   const targetIndex = closestIndexTo(
  //     new Date(timestamp as number),
  //     config.data.labels,
  //   ) as number

  //   // zoom in
  //   if (e.nativeEvent.wheelDeltaY >= 0) {
  //     setSelectedXMinMax(prev => {
  //       let {min_at: min_index, max_at: max_index} = {...prev}
  //       min_index = prev.min_at + 5
  //       max_index = prev.max_at - 5

  //       if (min_index >= targetIndex - 5 && min_index <= targetIndex) {
  //         min_index = prev.min_at
  //       }

  //       if (
  //         max_index + numOfLabels <= targetIndex + 5 &&
  //         max_index + numOfLabels >= targetIndex
  //       ) {
  //         max_index = prev.max_at
  //       }

  //       let min = parse(
  //         selectedItem.value.at(min_index)?.time as string,
  //         "yyyy-MM-dd'T'HH:mm:ss",
  //         new Date(),
  //       )
  //       let max = parse(
  //         selectedItem.value.at(max_index)?.time as string,
  //         "yyyy-MM-dd'T'HH:mm:ss",
  //         new Date(),
  //       )
  //       return {
  //         min_at: min_index,
  //         max_at: max_index,
  //         min,
  //         max,
  //       }
  //     })
  //   }

  //   // zoom out
  //   if (e.nativeEvent.wheelDeltaY < 0) {
  //     setSelectedXMinMax(prev => {
  //       let min_index = prev.min_at - 5 < 0 ? 0 : prev.min_at - 5
  //       let max_index = prev.max_at + 5 > -1 ? -1 : prev.max_at + 5
  //       let min = parse(
  //         selectedItem.value.at(min_index)?.time as string,
  //         "yyyy-MM-dd'T'HH:mm:ss",
  //         new Date(),
  //       )
  //       let max = parse(
  //         selectedItem.value.at(max_index)?.time as string,
  //         "yyyy-MM-dd'T'HH:mm:ss",
  //         new Date(),
  //       )
  //       return {
  //         min_at: min_index,
  //         max_at: max_index,
  //         min,
  //         max,
  //       }
  //     })
  //   }

  //   chartRef.current.update('none')
  // }
  // endregion --- zoom

  const handleSelectedItem = (n: typeof selectedItem) => {
    setSelectedItem(n)
    setSelectedXMinMax({
      min_at: 0,
      max_at: -1,
      min: parse(
        n.value.at(0)?.time as string,
        "yyyy-MM-dd'T'HH:mm:ss",
        new Date(),
      ),
      max: parse(
        n.value.at(-1)?.time as string,
        "yyyy-MM-dd'T'HH:mm:ss",
        new Date(),
      ),
    })
  }

  return (
    <div className='aspect-[2/1] relative'>
      <div className='absolute flex flex-col left-7 -top-14'>
        <span className='text-xs md:text-sm py-0.5 px-2 rounded-md bg-blue-500 text-white w-fit'>
          {intraday.result.stock.exchange_short_name} :{' '}
          {intraday.result.stock.symbol}
        </span>
        <span className='text-lg md:text-2xl'>
          {intraday.result.stock.company_name}
        </span>
      </div>
      <div className='flex flex-col gap-0.5 absolute -top-7 right-7'>
        <Listbox
          value={selectedItem}
          onChange={handleSelectedItem}
          defaultValue={durationOptions[0]}
        >
          <Listbox.Button className='flex flex-row items-center w-16 rounded-sm h-7 text-neutral-600 focus-visible:ring-blue-500 focus-visible:ring-2 ring-1 ring-black'>
            <span className='flex justify-end pr-1 grow'>
              {selectedItem.label}
            </span>
            <span className=''>
              <BiChevronDown size='24' />
            </span>
          </Listbox.Button>
          <Listbox.Options className='bg-white border mt-0.5 py-0.5 border-neutral-800 rounded-sm'>
            {durationOptions.map((option, index) => (
              <Listbox.Option
                key={index}
                value={option}
                className='px-2 py-1 hover:bg-blue-500 trasition-all hover:text-white'
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
      <Chart
        ref={chartRef}
        onMouseMove={e => setTimeout(() => drawCrosshair(e))}
        // onWheel={e => zoom(e)}
        {...config}
      />
    </div>
  )
}

const getDurationOptions = (
  maxData: DailyPrice['result']['data'],
  intraday_data: IntradayPrice,
) => {
  const LAST_INTRADAY = parse(
    maxData.at(-1)?.time as string,
    "yyyy-MM-dd'T'HH:mm:ss",
    new Date(),
  )

  let len = maxData.length

  const FIVE_DAYS = 5
  const ONE_MONTH = 20
  const THREE_MONTH = 60
  const SIX_MONTH = 120
  const ONE_YEAR = 240
  const THREE_YEAR = 720

  const YTD = set(LAST_INTRADAY, {month: 0, date: 1})
  let max = {label: 'MAX', value: maxData}
  let d1 = {label: '1D', value: intraday_data}

  if (len > THREE_YEAR) {
    const LAST_MONTH = parse(
      maxData.at(-ONE_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    const LAST_THREE_MONTH = parse(
      maxData.at(-THREE_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    const LAST_SIX_MONTH = parse(
      maxData.at(-SIX_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    const LAST_ONE_YEAR = parse(
      maxData.at(-ONE_YEAR - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    const LAST_THREE_YEAR = parse(
      maxData.at(-THREE_YEAR - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    return [
      d1,
      {
        label: '1M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_MONTH,
          ),
        ),
      },
      {
        label: '3M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_THREE_MONTH,
          ),
        ),
      },
      {
        label: '6M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_SIX_MONTH,
          ),
        ),
      },
      {
        label: 'YTD',
        value: maxData.filter(({time}) =>
          isAfter(parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY), YTD),
        ),
      },
      {
        label: '1Y',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_ONE_YEAR,
          ),
        ),
      },
      {
        label: '3Y',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_THREE_YEAR,
          ),
        ),
      },
      max,
    ]
  } else if (len < THREE_YEAR && len > ONE_YEAR) {
    const LAST_MONTH = parse(
      maxData.at(-ONE_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    const LAST_THREE_MONTH = parse(
      maxData.at(-THREE_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    const LAST_SIX_MONTH = parse(
      maxData.at(-SIX_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    const LAST_ONE_YEAR = parse(
      maxData.at(-ONE_YEAR - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )

    return [
      d1,
      {
        label: '1M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_MONTH,
          ),
        ),
      },
      {
        label: '3M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_THREE_MONTH,
          ),
        ),
      },
      {
        label: '6M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_SIX_MONTH,
          ),
        ),
      },
      {
        label: 'YTD',
        value: maxData.filter(({time}) =>
          isAfter(parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY), YTD),
        ),
      },
      {
        label: '1Y',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_ONE_YEAR,
          ),
        ),
      },
      max,
    ]
  } else if (len < ONE_YEAR && len > SIX_MONTH) {
    const LAST_MONTH = parse(
      maxData.at(-ONE_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    const LAST_THREE_MONTH = parse(
      maxData.at(-THREE_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    const LAST_SIX_MONTH = parse(
      maxData.at(-SIX_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )

    return [
      d1,
      {
        label: '1M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_MONTH,
          ),
        ),
      },
      {
        label: '3M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_THREE_MONTH,
          ),
        ),
      },
      {
        label: '6M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_SIX_MONTH,
          ),
        ),
      },
      {
        label: 'YTD',
        value: maxData.filter(({time}) =>
          isAfter(parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY), YTD),
        ),
      },
      max,
    ]
  } else if (len < SIX_MONTH && len > THREE_MONTH) {
    const LAST_MONTH = parse(
      maxData.at(-ONE_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    const LAST_THREE_MONTH = parse(
      maxData.at(-THREE_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )

    return [
      d1,
      {
        label: '1M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_MONTH,
          ),
        ),
      },
      {
        label: '3M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_THREE_MONTH,
          ),
        ),
      },
      {
        label: 'YTD',
        value: maxData.filter(({time}) =>
          isAfter(parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY), YTD),
        ),
      },
      max,
    ]
  } else if (len < THREE_MONTH && len > ONE_MONTH) {
    const LAST_MONTH = parse(
      maxData.at(-ONE_MONTH - 1)?.time as string,
      "yyyy-MM-dd'T'HH:mm:ss",
      LAST_INTRADAY,
    )
    return [
      d1,
      {
        label: '1M',
        value: maxData.filter(({time}) =>
          isAfter(
            parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY),
            LAST_MONTH,
          ),
        ),
      },
      {
        label: 'YTD',
        value: maxData.filter(({time}) =>
          isAfter(parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY), YTD),
        ),
      },
      max,
    ]
  } else if (len < ONE_MONTH && len > FIVE_DAYS) {
    return [
      d1,
      {
        label: 'YTD',
        value: maxData.filter(({time}) =>
          isAfter(parse(time, "yyyy-MM-dd'T'HH:mm:ss", LAST_INTRADAY), YTD),
        ),
      },
      max,
    ]
  } else {
    return [d1]
  }
}

const getTimeTickandScale = (duration: string) => {
  switch (duration) {
    case '1D':
      return {
        time: {
          unit: 'hour',
        },
        ticks: {
          autoSkip: false,
          callback: (value: number, index: number) => {
            const allowIndices = [29, 89, 149, 219, 269, 329]
            if (allowIndices.includes(index)) {
              return dayjs(value).format('HH:mm')
            }
          },
        },
      }
    case '5D':
      return {
        time: {
          unit: 'day',
        },
        ticks: {},
      }
    case '1M':
      return {
        time: {
          unit: 'day',
        },
        ticks: {
          callback: (value: number, index: number) => {
            if (index % 5 === 0) return dayjs(value).format('MMM-DD')
          },
        },
      }
    case '3M':
      return {
        time: {
          unit: 'day',
        },
        ticks: {
          callback: (value: number, index: number) => {
            if (index % 10 === 0) return dayjs(value).format('MMM-DD')
          },
        },
      }
    case '6M':
      return {
        time: {
          unit: 'day',
        },
        ticks: {
          callback: (value: number, index: number) => {
            if (index % 20 === 0) {
              return dayjs(value).format('MMM-DD')
            }
          },
        },
      }
    case 'YTD':
      return {
        time: {
          unit: 'month',
        },
        ticks: {
          callback: (value: number, index: number) => {
            if (index % 20 === 0) {
              return dayjs(value).format('MMM-DD')
            }
          },
        },
      }
    case '1Y':
      return {
        time: {
          unit: 'month',
        },
        ticks: {
          callback: (value: number, index: number) => {
            if (index % 60 === 0) {
              return dayjs(value).format('MMM-DD')
            }
          },
        },
      }
    case '3Y':
      return {
        time: {
          unit: 'month',
        },
        ticks: {
          callback: (value: number, index: number) => {
            if (index % 120 === 0) {
              return dayjs(value).format('MMM-DD')
            }
          },
        },
      }
    case 'MAX':
      return {
        time: {
          unit: 'year',
        },
        ticks: {
          callback: (value: number, index: number) => {
            if (index % 120 === 0) {
              return dayjs(value).format('MMM-DD')
            }
          },
        },
      }
  }
}
