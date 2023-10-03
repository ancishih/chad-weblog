import {useState, useEffect} from 'react'
import axios from 'axios'
import {SymbolsWithTotalRow, Symbols} from 'Stock'

async function getSymbolLists(str: string, pageParam = 1, options = {}) {
  let from = (pageParam - 1) * 10
  let to = pageParam * 10
  const res = await axios.get<{symbol_list: SymbolsWithTotalRow}>(
    `${process.env.NEXT_PUBLIC_APP_ENDPOINT}/api/stock/symbol/${str}?from=${from}&to=${to}`,
    options,
  )
  return res.data
}

const useSearch = (symbol: string, params = 1, enabled?: boolean) => {
  const [result, setResult] = useState<Symbols[]>([])

  const [isLoading, setIsLoading] = useState(false)

  const [isError, setIsError] = useState(false)

  const [error, setError] = useState<Record<string, unknown>>({})

  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
    setError({})

    const controller = new AbortController()

    const {signal} = controller

    if (symbol.length === 0) setResult([])

    if (enabled) {
      getSymbolLists(symbol, params, {signal})
        .then(res => {
          if (params > 1) {
            setResult(prev => [...prev, ...res.symbol_list.result])
          } else {
            setResult([...res.symbol_list.result])
          }

          setHasNextPage(() => {
            if (params * 10 > res.symbol_list.pagination.total_rows) {
              return false
            } else {
              return true
            }
          })
          setIsLoading(false)
        })
        .catch(err => {
          setIsLoading(false)
          if (signal.aborted) return
          setIsError(true)
          setError({message: err.message})
        })
    }

    return () => controller.abort()
  }, [symbol, params, enabled])

  return {result, isLoading, isError, hasNextPage, error}
}

export default useSearch
