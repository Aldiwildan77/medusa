import { useState } from "react"
import DatePicker from "../../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../../components/atoms/date-picker/time-picker"
import BodyCard from "../../../../components/organisms/body-card"
import Checkbox from "../../../../components/atoms/checkbox"
import { FieldErrors, UseFormSetValue } from "react-hook-form"
import { TargettedCampaignForm } from "./targettedCampaignSchema"

type Props = {
  errors: Partial<FieldErrors<TargettedCampaignForm>>
  setValue: UseFormSetValue<TargettedCampaignForm>
  values: TargettedCampaignForm
}

export function BasicInformation(props: Props) {
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
            Name <span className="ml-1 text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            className="col-span-8 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
            placeholder="Please enter a campaign name"
            required
            value={props.values.name}
          />
          {props.errors.name && (
            <span className="col-span-2 text-sm text-red-500">
              {props.errors.name.message}
            </span>
          )}
        </div>
        <div className="grid grid-cols-12 items-center gap-2">
          <label
            htmlFor="startTime"
            className="col-span-2 mb-2 block text-right text-sm font-medium"
          >
            Start Time <span className="text-red-70 ml-1">*</span>
          </label>
          <div className="col-span-8 flex flex-row">
            <div className="flex w-full flex-row items-center gap-2">
              <DatePicker
                label="Select start date"
                date={
                  props.values.startTime
                    ? new Date(props.values.startTime)
                    : null
                }
                onSubmitDate={(e) => {
                  if (e) {
                    props.setValue("startTime", e.toISOString())
                  }
                }}
              />
              <TimePicker
                label="Start time"
                date={
                  props.values.startTime
                    ? new Date(props.values.startTime)
                    : null
                }
                onSubmitDate={(e) => {
                  if (e) {
                    props.setValue("startTime", e.toISOString())
                  }
                }}
              />
            </div>
            {props.errors.startTime && (
              <span className="text-sm text-red-500">
                {props.errors.startTime.message}
              </span>
            )}
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Checkbox
              label="Set end time"
              name="setEndTime"
              id="setEndTime"
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
              End Time <span className="text-red-70 ml-1">*</span>
            </label>
            <div className="col-span-8 flex flex-col">
              <div className="flex w-full flex-row items-center gap-2">
                <DatePicker
                  label="Select end date"
                  // date={new Date(props.values?.endTime ?? null)}
                  date={
                    props.values?.endTime
                      ? new Date(props.values.endTime)
                      : null
                  }
                  onSubmitDate={(e) => {
                    if (e) {
                      props.setValue("endTime", e.toISOString())
                    }
                  }}
                  required={true}
                />
                <TimePicker
                  label="End time"
                  // date={new Date(props.values.endTime ?? null)}
                  date={
                    props.values?.endTime
                      ? new Date(props.values.endTime)
                      : null
                  }
                  onSubmitDate={(e) => {
                    if (e) {
                      props.setValue("endTime", e.toISOString())
                    }
                  }}
                />
              </div>
              {props.errors.endTime && (
                <span className="text-sm text-red-500">
                  {props.errors.endTime.message}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </BodyCard>
  )
}
