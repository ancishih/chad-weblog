import type {ChartData, ChartOptions} from 'chart.js'

declare module 'Charts' {
  interface LineProps {
    options: ChartOptions<'line'>
    data: ChartData<'line'>
  }
  interface BarProps {
    options: ChartOptions<'bar'>
    data: ChartData<'bar'>
  }
}
