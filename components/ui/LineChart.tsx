import React, {forwardRef, useRef, useEffect} from 'react'
import {
  Chart as Chart$1,
  LineController,
  BarController,
  RadarController,
  DoughnutController,
  PolarAreaController,
  BubbleController,
  PieController,
  ScatterController,
} from 'chart.js'
import type {
  ChartOptions,
  ChartType,
  ChartData,
  DefaultDataPoint,
  ChartDataset,
  ChartComponentLike,
  ChartEvent,
} from 'chart.js'
import type {ChartProps} from 'react-chartjs-2'
const defaultDatasetIdKey = 'label'

function reforwardRef(ref, value: Chart$1 | null) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

function setOptions(chart: Chart$1, nextOptions: ChartOptions<ChartType>) {
  const options = chart.options
  if (options && nextOptions) {
    Object.assign(options, nextOptions)
  }
}

function setLabels(currentData: ChartData, nextLabels: unknown[]) {
  currentData.labels = nextLabels
}

function setDatasets(
  currentData: ChartData,
  nextDatasets: ChartDataset<ChartType, DefaultDataPoint<ChartType>>[],
) {
  let datasetIdKey =
    arguments.length > 2 && arguments[2] !== void 0
      ? arguments[2]
      : defaultDatasetIdKey
  const addedDatasets: ChartDataset[] = []
  currentData.datasets = nextDatasets.map(nextDataset => {
    // given the new set, find it's current match
    const currentDataset = currentData.datasets.find(dataset => {
      return dataset[datasetIdKey] === nextDataset[datasetIdKey]
    })
    // There is no original to update, so simply add new one
    if (
      !currentDataset ||
      !nextDataset.data ||
      addedDatasets.includes(currentDataset)
    ) {
      return {
        ...nextDataset,
      }
    }
    addedDatasets.push(currentDataset)
    Object.assign(currentDataset, nextDataset)
    return currentDataset
  })
}

function cloneData(data: ChartData) {
  // let datasetIdKey =
  //   arguments.length > 1 && arguments[1] !== void 0
  //     ? arguments[1]
  //     : defaultDatasetIdKey
  const nextData = {
    labels: [],
    datasets: [],
  }
  setLabels(nextData, data.labels as unknown[])
  // setDatasets(nextData, data.datasets, datasetIdKey)
  setDatasets(nextData, data.datasets)
  return nextData
}
/**
 * Get dataset from mouse click event
 * @param chart - Chart.js instance
 * @param event - Mouse click event
 * @returns Dataset
 */ function getDatasetAtEvent(chart: Chart$1, event: React.SyntheticEvent) {
  return chart.getElementsAtEventForMode(
    event.nativeEvent,
    'dataset',
    {
      intersect: true,
    },
    false,
  )
}
/**
 * Get single dataset element from mouse click event
 * @param chart - Chart.js instance
 * @param event - Mouse click event
 * @returns Dataset
 */ function getElementAtEvent(chart: Chart$1, event: React.SyntheticEvent) {
  return chart.getElementsAtEventForMode(
    event.nativeEvent,
    'nearest',
    {
      intersect: true,
    },
    false,
  )
}
/**
 * Get all dataset elements from mouse click event
 * @param chart - Chart.js instance
 * @param event - Mouse click event
 * @returns Dataset
 */ function getElementsAtEvent(chart: Chart$1, event: React.SyntheticEvent) {
  return chart.getElementsAtEventForMode(
    event.nativeEvent,
    'index',
    {
      intersect: true,
    },
    false,
  )
}

function ChartComponent(props: ChartProps, ref: any) {
  const {
    height = 150,
    width = 300,
    redraw = false,
    datasetIdKey,
    type,
    data,
    options,
    plugins = [],
    fallbackContent,
    updateMode,
    ...canvasProps
  } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart$1 | null>()
  const crosshairRef = useRef<undefined | any>(undefined)
  const changedRef = useRef<boolean>(false)
  const crosshairLabel = {
    id: 'crosshairLabel',
    afterDatasetsDraw(chart: Chart$1, args: {event: ChartEvent}) {
      changedRef.current = false
      const {
        ctx,
        chartArea: {left, right, top, bottom},
      } = chart
      if (crosshairRef.current) {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(
          crosshairRef.current?.[0].startX,
          crosshairRef.current?.[0].startY,
        )
        ctx.lineTo(
          crosshairRef.current?.[0].endX,
          crosshairRef.current?.[0].endY,
        )
        ctx.stroke()
      }
    },
    afterEvent(
      chart: Chart$1,
      args: {
        event: ChartEvent
        replay: boolean
        changed?: boolean
        cancelable: boolean
        inChartArea: boolean
      },
    ) {
      const {
        ctx,
        chartArea: {left, bottom, right, top},
      } = chart
      const yCoor = args.event.y
      const xCoor = args.event.x
      if (!args.inChartArea && crosshairRef.current) {
        crosshairRef.current = undefined
        changedRef.current = true
        args.changed = changedRef.current
      } else if (args.inChartArea) {
        changedRef.current = true
        args.changed = changedRef.current
        crosshairRef.current = [
          {
            startX: xCoor,
            startY: top,
            endX: xCoor,
            endY: bottom,
          },
        ]
      }
    },
  }

  const _plugins = [crosshairLabel]

  const renderChart = () => {
    if (!canvasRef.current) return
    chartRef.current = new Chart$1(canvasRef.current, {
      type,
      data: cloneData(data),
      options: options && {
        ...options,
      },
      plugins: _plugins,
    })
    reforwardRef(ref, chartRef.current)
  }

  const destroyChart = () => {
    reforwardRef(ref, null)
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }
  }

  useEffect(() => {
    if (!redraw && chartRef.current && options) {
      setOptions(chartRef.current, options)
    }
  }, [redraw, options])

  useEffect(() => {
    if (!redraw && chartRef.current) {
      setLabels(chartRef.current.config.data, data.labels as unknown[])
    }
  }, [redraw, data.labels])

  useEffect(() => {
    if (!redraw && chartRef.current && data.datasets) {
      setDatasets(chartRef.current.config.data, data.datasets)
    }
  }, [redraw, data.datasets])

  useEffect(() => {
    if (!chartRef.current) return
    if (redraw) {
      destroyChart()
      setTimeout(renderChart)
    } else {
      chartRef.current.update(updateMode)
    }
  }, [redraw, options, data.labels, data.datasets, updateMode])

  useEffect(() => {
    if (!chartRef.current) return
    destroyChart()
    setTimeout(renderChart)
  }, [type])

  useEffect(() => {
    renderChart()
    return () => destroyChart()
  }, [])

  return /*#__PURE__*/ React.createElement(
    'canvas',
    Object.assign(
      {
        ref: canvasRef,
        role: 'img',
        height: height,
        width: width,
      },
      canvasProps,
    ),
    fallbackContent,
  )
}
const Chart = /*#__PURE__*/ forwardRef(ChartComponent)

function createTypedChart(type: string, registerables: ChartComponentLike) {
  Chart$1.register(registerables)

  return /*#__PURE__*/ forwardRef((props, ref) =>
    /*#__PURE__*/
    React.createElement(
      Chart,
      Object.assign({}, props, {
        ref: ref,
        type,
      }),
    ),
  )
}

const Line = /* #__PURE__ */ createTypedChart('line', LineController)
const Bar = /* #__PURE__ */ createTypedChart('bar', BarController)
const Radar = /* #__PURE__ */ createTypedChart('radar', RadarController)
const Doughnut = /* #__PURE__ */ createTypedChart(
  'doughnut',
  DoughnutController,
)
const PolarArea = /* #__PURE__ */ createTypedChart(
  'polarArea',
  PolarAreaController,
)
const Bubble = /* #__PURE__ */ createTypedChart('bubble', BubbleController)
const Pie = /* #__PURE__ */ createTypedChart('pie', PieController)
const Scatter = /* #__PURE__ */ createTypedChart('scatter', ScatterController)

export {
  Bar,
  Bubble,
  Chart,
  Doughnut,
  Line,
  Pie,
  PolarArea,
  Radar,
  Scatter,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
}
