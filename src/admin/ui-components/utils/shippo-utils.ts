/*
 * Copyright 2024 RSC-Labs, https://rsoftcon.com/
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Fulfillment, Order, Return } from "@medusajs/medusa"
import { Address, Item } from "./types"
import { getWeightUnit } from "./helpers"

export function getLineItemsFromOrder(order: Order) : Item[] {
  return order.items.map(item => {
    return {
      currency: order.currency_code,
      quantity: item.quantity,
      sku: item.variant.sku !== null ? item.variant.sku : undefined,
      title: item.variant.product.title,
      unit_amount: `${(item.unit_price / Math.pow(10, 2)).toFixed(2)}`,
      variantTitle: item.variant.title,
      unit_weight: (item.variant.weight ? item.variant.weight.toString() : 
        (item.variant.product.weight ? item.variant.product.weight.toString() : undefined)),
      weight_unit: getWeightUnit()
    }
  })
}

export function getLineItemsFromFulfillment(order: Order, fulfillment: Fulfillment) : Item[] {

  return order.items.filter(item => {
    return fulfillment.items.find(fulItem => fulItem.item_id === item.id)
  }).map(item => {
    return {
      currency: order.currency_code,
      quantity: fulfillment.items.find(fulItem => fulItem.item_id === item.id).quantity,
      sku: item.variant.sku !== null ? item.variant.sku : undefined,
      title: item.variant.product.title,
      unit_amount: `${(item.unit_price / Math.pow(10, 2)).toFixed(2)}`,
      variantTitle: item.variant.title,
      unit_weight: (item.variant.weight ? item.variant.weight.toString() : 
        (item.variant.product.weight ? item.variant.product.weight.toString() : undefined)),
      weight_unit: getWeightUnit()
    }
  })
}

export function getLineItemsFromReturn(order: Order, ret: Return) : Item[] {

  return order.items.filter(item => {
    return ret.items.find(retItem => retItem.item_id === item.id)
  }).map(item => {
    return {
      currency: order.currency_code,
      quantity: ret.items.find(retItem => retItem.item_id === item.id).quantity,
      sku: item.variant.sku !== null ? item.variant.sku : undefined,
      title: item.variant.product.title,
      unit_amount: `${(item.unit_price / Math.pow(10, 2)).toFixed(2)}`,
      variantTitle: item.variant.title,
      unit_weight: (item.variant.weight ? item.variant.weight.toString() : 
        (item.variant.product.weight ? item.variant.product.weight.toString() : undefined)),
      weight_unit: getWeightUnit()
    }
  })
}


export function getAddressToFromOrder(order: Order, isReturn?: boolean) : Address {
  return {
    name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
    company: order.shipping_address.company,
    street1: order.shipping_address.address_1,
    street2: order.shipping_address.address_2,
    city: order.shipping_address.city,
    state: order.shipping_address.province,
    zip: order.shipping_address.postal_code,
    country: order.shipping_address.country_code,
    phone: order.shipping_address.phone,
    email: order.email
  }
}