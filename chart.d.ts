import type {ChartData, ChartOptions, CoreScaleOptions} from 'chart.js'

declare module 'Charts' {
  interface LineProps {
    options: ChartOptions<'line'>
    data: ChartData<'line'>
  }
  interface BarProps {
    options: ChartOptions<'bar'>
    data: ChartData<'bar'>
  }

  interface _ScaleOptions extends CoreScaleOptions {
    readonly _gridLineItems: number
  }
}
