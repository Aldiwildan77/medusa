/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the shipping profile to create.
 */
export interface AdminPostShippingProfilesReq {
  /**
   * The name of the Shipping Profile
   */
  name: string
  /**
   * The type of the Shipping Profile
   */
  type: "default" | "gift_card" | "custom"
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
}
