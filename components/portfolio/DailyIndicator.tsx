import {IntradayPriceWithSymbol} from 'Stock'
export default function DailyIndicator({
  data,
}: {
  data: IntradayPriceWithSymbol
}) {
  const {
    result: {stock, data: price},
  } = data

  const minPrice = Math.min(...price.map(({low}) => low))

  const maxPrice = Math.max(...price.map(({high}) => high))

  const b = 1000_000_000

  const getMktcap = (num: number) => {
    let unit = num.toString().length

    if (unit > 10) {
      return Math.ceil(num / 1000_000_0) / 100 + 'B'
    } else if (unit < 10 && unit > 7) {
      let abbrev = Math.ceil(num / 1000_0) / 100 + 'M'
      return abbrev
    } else {
      return num.toString()
    }
  }

  return (
    <>
      <div className='px-6 md:p-0'>
        <div className='flex flex-row'>
          <span>{price.at(0)?.open as number}</span>
          <span>{price.at(-1)?.close as number}</span>
        </div>
        <div className=''>
          <span>{stock.change}</span>
          <span>
            {Math.ceil((stock.change / stock.price) * 10000) / 100 + '%'}
          </span>
        </div>
        <div className=''>
          <span>{getMktcap(stock.mkt_cap)}</span>
        </div>
      </div>
    </>
  )
}
