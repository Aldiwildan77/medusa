import { Card } from "../../components/organisms/Card"
import { FreeSampleTable } from "./freeSampleList/FreeSampleTable"

export function FreeSampleListPage() {
  return (
    <div className="gap-y-xsmall flex h-full grow flex-col">
      <div className="flex flex-col gap-4">
        <Card title="Free Sample Requests">
          <FreeSampleTable />
        </Card>
      </div>
    </div>
  )
}
