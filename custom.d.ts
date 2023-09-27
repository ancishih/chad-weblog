declare module 'Stock' {
  interface HistoricalPrice {
    symbol: string
    historical: {
      date: string
      open: number
      close: number
      high: number
      low: number
      volume: number
      change: number
    }[]
  }
  interface StockNews {
    id: string
    symbol: string
    img: string
    origin_url: string
    published_date: string
    website: string
    title: string
    content: string
  }
  interface News {
    id: string
    title: string
    published_date: string
    content: string[]
    tickers: string
    img: string
    link: string
    author: string
  }
  interface OtherNews {
    id: string
    title: string
    published_date: string
    img: string
  }
  type Symbols = {
    symbol: string
    company_name: string
    img: string
  }
  type SymbolsWithTotalRow = {
    result: Symbols[]
    pagination: {
      total_rows: number
      row_count: number
    }
  }
  type BalanceSheetData = {
    header: string[]
    rawdata: string[][][]
  }

  type IncomeStatementData = {
    header: string[]
    rawdata: string[][][]
  }

  type CashFlowData = {
    header: string[]
    rawdata: string[][][]
  }

  type StockProfileData = {
    company_name: string
    ceo: string
    change: number
    city: string
    company_address: string
    company_description: string
    company_name: string
    country: string
    dcf: number
    dcf_diff: number
    default_image: boolean
    exchange_short_name: string
    full_time_employees: string
    id: number
    img: string
    in_state: string
    industry: string
    ipo_date: string
    last_div: number
    mkt_cap: string
    phone: string
    price: number
    price_range: string
    sector_id: number
    symbol: string
    website: string
    zip: string
  }
  type DailyPrice = {
    result: {
      symbol: string
      data: {
        time: string
        open: number
        close: number
        high: number
        low: number
        volume: number
        ema: number[]
        sma: number[]
      }[]
    }
  }

  type IntradayPrice = {
    time: string
    open: number
    close: number
    high: number
    low: number
    volume: number
  }[]

  type IntradayPriceWithSymbol = {
    result: {
      data: IntradayPrice
      stock: {
        change: number
        company_name: string
        exchange_short_name: string
        mkt_cap: number
        price: number
        price_range: number
        symbol: string
      }
    }
  }

  type DataTableTData = {
    header: string[]
    rawdata: string[][][]
  }

  type MajorIndexData = {
    date: string
    open: number
    close: number
    high: number
    low: number
    volume: number
  }[]
}
