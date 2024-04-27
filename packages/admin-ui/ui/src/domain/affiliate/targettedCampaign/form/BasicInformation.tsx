import { useState } from "react"
import DatePicker from "../../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../../components/atoms/date-picker/time-picker"
import BodyCard from "../../../../components/organisms/body-card"
import Checkbox from "../../../../components/atoms/checkbox"

export function BasicInformation() {
  const [showEndTime, setShowEndTime] = useState(false)

  return (
    <BodyCard
      forceDropdown={false}
      compact={true}
      title="Basic information"
      className="h-fit"
    >
      {/* TODO: add back button to affiliate home page */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-12 items-center gap-2">
          <label
            htmlFor="name"
            className="col-span-2 mb-2 block text-right text-sm font-medium"
          >
            Name
          </label>
          <input
            name="name"
            type="text"
            className="col-span-8 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
            placeholder="Please enter a campaign name"
            required
          />
        </div>
        <div className="grid grid-cols-12 items-center gap-2">
          <label
            htmlFor="startTime"
            className="col-span-2 mb-2 block text-right text-sm font-medium"
          >
            Start Time
          </label>
          <div className="col-span-8 flex items-center gap-2">
            <DatePicker
              label="Select start date"
              date={new Date()}
              onSubmitDate={(e) => console.log(e)}
            />
            <TimePicker
              label="Start time"
              date={new Date()}
              onSubmitDate={(e) => console.log(e)}
            />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Checkbox
              label="Set end time"
              name="setEndTime"
              id="setEndTime"
              // checked={value}
              onChange={(e) => setShowEndTime(e.target.checked)}
            />
          </div>
        </div>
        {showEndTime && (
          <div className="grid grid-cols-12 items-center gap-2">
            <label
              htmlFor="endTime"
              className="col-span-2 mb-2 block text-right text-sm font-medium"
            >
              End Time
            </label>
            <div className="col-span-8 flex items-center gap-2">
              <DatePicker
                label="Select end date"
                date={new Date()}
                onSubmitDate={(e) => console.log(e)}
              />
              <TimePicker
                label="End time"
                date={new Date()}
                onSubmitDate={(e) => console.log(e)}
              />
            </div>
          </div>
        )}
      </div>
    </BodyCard>
  )
}
