import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function Card(props: Props) {
  return (
    <div className="px-large rounded-rounded bg-grey-0 border-grey-20 pb-large flex w-full flex-col border">
      <div className="py-large">
        <div className="flex flex-col items-start justify-between">
          {props.title && (
            <h1 className="inter-xlarge-semibold text-grey-90">
              {props.title}
            </h1>
          )}
          {props.subtitle && (
            <h3 className="inter-small-regular text-grey-50 pt-1.5">
              {props.subtitle}
            </h3>
          )}
        </div>
      </div>
      {props.children}
    </div>
  )
}
