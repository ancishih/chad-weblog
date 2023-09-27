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
import {MajorIndexData} from 'Stock'
import 'chartjs-adapter-date-fns'
import parse from 'date-fns/parse'
import React from 'react'
import {Chart} from 'react-chartjs-2'
import type {ChartProps} from 'react-chartjs-2'
import dayjs from '@/utils/dayjs'
import type {ChartType, DefaultDataPoint} from 'chart.js'
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

export default function MinuteTrend({intraday}: {intraday: MajorIndexData}) {
  const [selectedItem, setSelectedItem] = React.useState(() => {
    return {
      value: intraday,
    }
  })

  React.useEffect(() => {
    setSelectedItem({value: intraday})
  }, [intraday])

  const yMin = Math.min(...selectedItem.value.map(({low}) => low))

  const yMax = Math.max(...selectedItem.value.map(({high}) => high))

  const ABSOLUTE_X_MIN = parse(
    selectedItem.value.at(1)?.date as string,
    'yyyy-MM-dd HH:mm:ss',
    new Date(),
  )

  const ABSOLUTE_X_MAX = parse(
    selectedItem.value.at(-1)?.date as string,
    'yyyy-MM-dd HH:mm:ss',
    new Date(),
  )

  const [selectedXMinMax] = React.useState(() => {
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
    type: 'line',
    data: {
      labels: selectedItem.value.map(({date}) =>
        parse(date, 'yyyy-MM-dd HH:mm:ss', new Date()),
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
          type: 'timeseries',
          grid: {
            display: false,
          },
          /* @ts-expect-error type-error with ChartProps<ChartType, DefaultDataPoint<ChartType>> */
          min: selectedXMinMax.min,
          /* @ts-expect-error type-error with ChartProps<ChartType, DefaultDataPoint<ChartType>> */
          max: selectedXMinMax.max,
          time: {
            unit: 'hour',
          },
          ticks: {
            autoSkip: false,
            /* @ts-expect-error type-error with ChartProps<ChartType, DefaultDataPoint<ChartType>> */
            callback: (value: number, index: number) => {
              const allowIndices = [29, 89, 149, 219, 269, 329]
              if (allowIndices.includes(index)) {
                return dayjs(value).format('HH:mm')
              }
            },
          },
        },
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

    const yStart = y.getPixelForValue(data.datasets[0].data[index] as number)

    const yEnd = y.getPixelForValue(data.datasets[0].data[index + 1] as number)

    const yInterpolation =
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

  return (
    <div className='aspect-[2/1] relative'>
      <Chart
        ref={chartRef}
        onMouseMove={e => setTimeout(() => drawCrosshair(e))}
        // onWheel={e => zoom(e)}
        {...config}
      />
    </div>
  )
}
