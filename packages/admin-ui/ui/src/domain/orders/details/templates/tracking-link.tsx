import { TrackingLink as TrackingLinkType } from "@medusajs/medusa"
import ClipboardCopyIcon from "../../../../components/fundamentals/icons/clipboard-copy-icon"

export const TrackingLink = ({
  trackingLink,
}: {
  trackingLink: TrackingLinkType
}) => {
  const handleCopyTrackingNumber = () => {
    navigator.clipboard.writeText(trackingLink.tracking_number)
    alert("Tracking number copied to clipboard")
  }

  if (trackingLink.url) {
    return (
      <a
        style={{ textDecoration: "none" }}
        target="_blank"
        href={trackingLink.url}
        rel="noreferrer"
      >
        <div className="text-blue-60 ml-2">{trackingLink.tracking_number} </div>
      </a>
    )
  } else {
    return (
      <span
        className="text-blue-60 ml-2 inline-flex cursor-pointer flex-row items-center gap-1 font-semibold"
        onClick={handleCopyTrackingNumber}
      >
        {trackingLink.tracking_number} <ClipboardCopyIcon />
      </span>
    )
  }
}
