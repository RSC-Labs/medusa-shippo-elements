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

import { Fulfillment } from "@medusajs/medusa";
import { WeightUnit } from "./types";

export function isFulfillmentReady(fulfillment: Fulfillment | undefined) : boolean {
  return (fulfillment !== undefined && 
    fulfillment.canceled_at === null)
}

export function getWeightUnit() : WeightUnit {
  switch (process.env.MEDUSA_ADMIN_SHIPPO_WEIGHT_UNIT) {
    case 'g':
      return WeightUnit.G;
    case 'kg':
      return WeightUnit.KG;
    case 'oz':
      return WeightUnit.OZ;
    case 'lb':
      return WeightUnit.LB;
    default:
      return WeightUnit.G
  }
}