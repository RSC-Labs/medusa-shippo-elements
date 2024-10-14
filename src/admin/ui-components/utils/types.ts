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

export enum WeightUnit {
  G = 'g',
  KG = 'kg',
  OZ = 'oz',
  LB = 'lb'

}

export interface Address {
  name: string;
  company?: string;
  street_no?: string;
  street1: string;
  street2?: string;
  street3?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}
export interface Item {
  id?: number;
  title: string;
  sku?: string;
  quantity: number;
  currency: string;
  unit_amount: string;
  unit_weight: string;
  weight_unit: string;
  country_of_origin?: string;
}
export interface OrderDetails {
  address_from?: Address;
  address_to: Address;
  line_items: Item[];
  address_return?: Address;
  object_id?: string;
  order_number?: string;
  order_status?: string;
  placed_at?: string;
  notes?: string;
  // end of order information
  shipment_date?: Date;
  extras?: {
    insurance?: {
      amount: string;
      currency: string;
    };
    signature_confirmation?: string;
  };
}
