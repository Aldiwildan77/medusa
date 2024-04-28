import BodyCard from "../../../../components/organisms/body-card"
import Checkbox from "../../../../components/atoms/checkbox"
import { FieldErrors, UseFormSetValue } from "react-hook-form"
import { TargettedCampaignForm } from "./targettedCampaignSchema"
import ReactDatePicker from "react-datepicker"

import dayjs from "dayjs"

type Props = {
  errors: Partial<FieldErrors<TargettedCampaignForm>>
  setValue: UseFormSetValue<TargettedCampaignForm>
  values: TargettedCampaignForm
}

export function BasicInformation(props: Props) {
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
            className="col-span-2 block text-right text-sm font-medium"
          >
            Name <span className=" text-red-600">*</span>
          </label>
          <div className="col-span-8 flex flex-col gap-1">
            <input
              name="name"
              type="text"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
              placeholder="Please enter a campaign name"
              required
              value={props.values.name}
              onChange={(e) => props.setValue("name", e.target.value)}
            />
            {props.errors.name && (
              <span className="col-span-2 text-sm  text-red-600">
                {props.errors.name.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 items-center gap-2">
          <label
            htmlFor="startTime"
            className="col-span-2 block text-right text-sm font-medium"
          >
            Start Time <span className=" text-red-600">*</span>
          </label>
          <div className="col-span-8 flex flex-row">
            <div className="flex w-full flex-row items-center gap-2">
              <ReactDatePicker
                showTimeSelect
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                wrapperClassName="w-full"
                placeholderText="Please select a start time"
                value={
                  props.values.startTime
                    ? dayjs(props.values.startTime).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )
                    : undefined
                }
                minDate={new Date()}
                selected={
                  props.values?.startTime
                    ? new Date(props.values.startTime)
                    : null
                }
                onChange={(e) => {
                  if (e) {
                    props.setValue("startTime", e.toISOString())
                  }
                }}
                required={true}
              />
            </div>
            {props.errors.startTime && (
              <span className="text-sm  text-red-600">
                {props.errors.startTime.message}
              </span>
            )}
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Checkbox
              label="Set end time"
              name="setEndTime"
              id="setEndTime"
              onChange={(e) => props.setValue("showEndTime", e.target.checked)}
            />
          </div>
        </div>
        {props.values.showEndTime && (
          <div className="grid grid-cols-12 items-center gap-2">
            <label
              htmlFor="endTime"
              className="col-span-2 block text-right text-sm font-medium"
            >
              End Time <span className="text-red-600">*</span>
            </label>
            <div className="col-span-8 flex flex-col">
              <div className="flex w-full flex-row items-center gap-2">
                <ReactDatePicker
                  showTimeSelect
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  wrapperClassName="w-full"
                  placeholderText="Please select an end time"
                  value={
                    props.values?.endTime
                      ? dayjs(props.values.endTime).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      : undefined
                  }
                  minDate={
                    props.values?.startTime
                      ? new Date(props.values.startTime)
                      : null
                  }
                  selected={
                    props.values?.endTime
                      ? new Date(props.values.endTime)
                      : null
                  }
                  onChange={(e) => {
                    if (e) {
                      props.setValue("endTime", e.toISOString())
                    }
                  }}
                  required={true}
                />
              </div>
              {props.errors.endTime && (
                <span className="text-sm  text-red-600">
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
