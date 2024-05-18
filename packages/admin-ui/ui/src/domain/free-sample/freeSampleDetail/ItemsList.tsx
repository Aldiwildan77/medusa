import { FreeSampleItem } from "../../../types/freeSample"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"
import { Card } from "../../../components/organisms/Card"

type Props = {
  items: FreeSampleItem[]
}

export const ItemsList = ({ items }: Props) => {
  return (
    <Card title="Items List">
      {items?.map((item) => (
        <div
          key={item.serial}
          className="hover:bg-grey-5 rounded-rounded mx-[-5px] mb-1 flex h-[64px] justify-between px-[5px] py-2"
        >
          <div className="flex justify-center space-x-4">
            <div className="rounded-rounded flex h-[48px] w-[36px] overflow-hidden">
              {item.product_variant.thumbnail ? (
                <img
                  src={item.product_variant.thumbnail}
                  className="object-cover"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            <div className="flex max-w-[185px] flex-col justify-center">
              <span className="inter-small-regular text-grey-90 truncate">
                {item.product_variant.title}
              </span>
            </div>
          </div>
        </div>
      ))}
    </Card>
  )
}
