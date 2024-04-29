import { useReducer } from "react"

type ProductFilterAction =
  | { type: "setQuery"; payload: string | null }
  | { type: "reset"; payload: ProductFilterState }
  | { type: "setPage"; payload: number }
  | { type: "setLimit"; payload: number }

interface ProductFilterState {
  query?: string | null
  limit: number
  page: number
}

const reducer = (
  state: ProductFilterState,
  action: ProductFilterAction
): ProductFilterState => {
  switch (action.type) {
    case "setQuery": {
      return {
        ...state,
        page: 0, // reset page when query changes
        query: action.payload,
      }
    }
    case "setLimit": {
      return {
        ...state,
        limit: action.payload,
      }
    }
    case "setPage": {
      return {
        ...state,
        page: action.payload,
      }
    }
    case "reset": {
      return action.payload
    }
    default: {
      return state
    }
  }
}

type UseAffiliateProductTargetProductModalFiltersParams = {
  defaultSearch?: string
  limit?: number
  page?: number
}

export const useAffiliateProductTargetProductModalFilters = (
  params: UseAffiliateProductTargetProductModalFiltersParams
) => {
  if (params.defaultSearch && params.defaultSearch[0] === "?") {
    params.defaultSearch = params.defaultSearch.substring(1)
  }

  const [state, dispatch] = useReducer(reducer, {
    query: params.defaultSearch || null,
    limit: params.limit || 10,
    page: params.page || 1,
  })

  const setLimit = (limit: number) => {
    dispatch({ type: "setLimit", payload: limit })
  }

  const paginate = (direction: 1 | -1) => {
    if (direction > 0) {
      const nextOffset = state.page + 1

      dispatch({ type: "setPage", payload: nextOffset })
    } else {
      const nextOffset = state.page - 1
      dispatch({ type: "setPage", payload: nextOffset })
    }
  }

  return {
    ...state,
    filters: {
      ...state,
    },
    paginate,
    setLimit,
  }
}
