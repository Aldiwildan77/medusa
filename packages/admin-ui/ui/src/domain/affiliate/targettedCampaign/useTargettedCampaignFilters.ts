import { useReducer } from "react"

type ProductDateFilter = null | {
  gt?: string
  lt?: string
}

type ProductFilterAction =
  | { type: "setQuery"; payload: string | null }
  | { type: "setFilters"; payload: ProductFilterState }
  | { type: "reset"; payload: ProductFilterState }
  | { type: "setOffset"; payload: number }
  | { type: "setDefaults"; payload: ProductDefaultFilters | null }
  | { type: "setDate"; payload: ProductDateFilter }
  | { type: "setStatus"; payload: null | string[] | string }
  | { type: "setFulfillment"; payload: null | string[] | string }
  | { type: "setPayment"; payload: null | string[] | string }
  | { type: "setLimit"; payload: number }

interface ProductFilterState {
  query?: string | null
  status: {
    open: boolean
    filter: null | string[] | string
  }
  collection: {
    open: boolean
    filter: null | string[] | string
  }
  tags: {
    open: boolean
    filter: null | string[] | string
  }
  date: {
    open: boolean
    filter: ProductDateFilter
  }
  limit: number
  offset: number
  additionalFilters: ProductDefaultFilters | null
}

const reducer = (
  state: ProductFilterState,
  action: ProductFilterAction
): ProductFilterState => {
  switch (action.type) {
    case "setFilters": {
      return {
        ...state,
        status: action.payload.status,
        collection: action.payload.collection,
        tags: action.payload.tags,
        date: action.payload.date,
        query: action?.payload?.query,
      }
    }
    case "setQuery": {
      return {
        ...state,
        offset: 0, // reset offset when query changes
        query: action.payload,
      }
    }
    case "setDate": {
      const newDateFilters = state.date
      return {
        ...state,
        date: newDateFilters,
      }
    }
    case "setLimit": {
      return {
        ...state,
        limit: action.payload,
      }
    }
    case "setOffset": {
      return {
        ...state,
        offset: action.payload,
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

type ProductDefaultFilters = {
  expand?: string
  fields?: string
}

export const useTargettedCampaignFilters = (
  existing?: string,
  defaultFilters: ProductDefaultFilters | null = null
) => {
  if (existing && existing[0] === "?") {
    existing = existing.substring(1)
  }

  const [state, dispatch] = useReducer(reducer, {
    query: null,
    status: {
      open: false,
      filter: null,
    },
    collection: {
      open: false,
      filter: null,
    },
    tags: {
      open: false,
      filter: null,
    },
    date: {
      open: false,
      filter: null,
    },
    limit: 10,
    offset: 0,
    additionalFilters: defaultFilters,
  })

  const setLimit = (limit: number) => {
    dispatch({ type: "setLimit", payload: limit })
  }

  const paginate = (direction: 1 | -1) => {
    if (direction > 0) {
      const nextOffset = state.offset + state.limit

      dispatch({ type: "setOffset", payload: nextOffset })
    } else {
      const nextOffset = Math.max(state.offset - state.limit, 0)
      dispatch({ type: "setOffset", payload: nextOffset })
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
