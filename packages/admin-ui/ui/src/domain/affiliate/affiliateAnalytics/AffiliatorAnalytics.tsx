import { useMemo, useState } from "react"
import { Card } from "../../../components/organisms/Card"
import { AffiliatorTable } from "./AffiliatorTable"
import dayjs from "dayjs"
import { DatePicker } from "@medusajs/ui"
import { useGetAffiliatorSummary } from "../affiliateHooks"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Spinner from "../../../components/atoms/spinner"

type Data = {
  label: string
  value: string
}

export function AffiliatorAnalytics() {
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [date, setDate] = useState<{ from: string; to: string }>({
    from: dayjs().startOf("day").toISOString(),
    to: dayjs().endOf("day").toISOString(),
  })

  const affiliatorSummary = useGetAffiliatorSummary(
    {
      startPeriodAt: date.from,
      endPeriodAt: date.to,
      customer_id: selectedCustomerId,
    },
    {
      enabled: !!selectedCustomerId,
    }
  )

  const data: Data[] = useMemo(() => {
    return [
      {
        label: "Orders",
        value: String(affiliatorSummary.data?.totalOrders || 0),
      },
      {
        label: "Product sold",
        value: String(affiliatorSummary.data?.totalProductSold || 0),
      },
      {
        label: "Commission",
        value: formatAmountWithSymbol({
          amount: affiliatorSummary.data?.totalCommission || 0,
          currency: "IDR",
        }),
      },
    ]
  }, [affiliatorSummary.data])

  return (
    <Card title="Affiliator Analytics">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="w-[250px]">
            <DatePicker
              placeholder="Pick a date"
              mode="range"
              presets={[
                {
                  label: "Today",
                  dateRange: {
                    from: dayjs().startOf("day").toDate(),
                    to: dayjs().endOf("day").toDate(),
                  },
                },
                {
                  label: "Past 7 days",
                  dateRange: {
                    from: dayjs().subtract(7, "day").startOf("day").toDate(),
                    to: dayjs().endOf("day").toDate(),
                  },
                },
                {
                  label: "Past 30 days",
                  dateRange: {
                    from: dayjs().subtract(30, "day").startOf("day").toDate(),
                    to: dayjs().endOf("day").toDate(),
                  },
                },
                {
                  label: "Past 90 days",
                  dateRange: {
                    from: dayjs().subtract(90, "day").startOf("day").toDate(),
                    to: dayjs().endOf("day").toDate(),
                  },
                },
              ]}
              value={{
                from: dayjs(date.from).toDate(),
                to: dayjs(date.to).toDate(),
              }}
              onChange={(date) => {
                setDate({
                  from: dayjs(date?.from).startOf("day").toISOString(),
                  to: dayjs(date?.to).endOf("day").toISOString(),
                })
              }}
            />
          </div>
          {selectedCustomerId ? (
            affiliatorSummary.isLoading ? (
              <div className="flex w-full items-center justify-center">
                <Spinner variant="secondary" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {data.map((d, idx) => (
                  <div
                    key={idx}
                    className="rounded-rounded flex flex-col border px-4 py-3"
                  >
                    <h3>
                      <b>{d.label}</b>
                    </h3>
                    <p className="text-md">{d.value}</p>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex w-full items-center justify-center">
              <p className="text-md">
                Please select an affiliator to see analytics
              </p>
            </div>
          )}
        </div>
        <AffiliatorTable
          selectedAffiliatorCustomerId={selectedCustomerId}
          setSelectedAffiliatorCustomerId={setSelectedCustomerId}
        />
      </div>
    </Card>
  )
}
