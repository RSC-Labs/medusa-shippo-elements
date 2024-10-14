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

import { Heading, Select } from "@medusajs/ui"
import { useState } from 'react'
import { CircularProgress, Grid2 } from "@mui/material";
import { useAdminOrder } from "medusa-react"
import { Fulfillment, Order } from "@medusajs/medusa";
import { isFulfillmentReady } from "./utils/helpers";

export type ChooseFulFillmentProps = {
  order: Order,
  setFulfillment: (chosenFulfillment: Fulfillment) => void
}

const SelectFulfillment = (props: ChooseFulFillmentProps) => {

  const { order, isLoading } = useAdminOrder(props.order.id, {
    fields: "fulfillments,fulfillment_status",
  });

  const [ value , setValue ] = useState<string | undefined>();

  const handleChange = (fulfilmentId: string) => {
    setValue(fulfilmentId);
    props.setFulfillment(props.order.fulfillments.find(fulfillment => fulfillment.id == fulfilmentId))
  };

  return (
    <Select size="base" onValueChange={handleChange} value={value}>
      <Select.Trigger>
        <Select.Value placeholder="Select a fulfillment" />
      </Select.Trigger>
      <Select.Content>
          {isLoading && <CircularProgress/>}
          {order && order.fulfillments && order.fulfillments.filter(ful => isFulfillmentReady(ful))
            .sort((a, b) => a.created_at.getTime() - b.created_at.getTime()).map((fulfillment) => (
              <Select.Item key={fulfillment.id} value={fulfillment.id}>
                {`Created at: ${new Date(fulfillment.created_at).toDateString()}`}
              </Select.Item>
          ))}
      </Select.Content>
    </Select>
  )
}
type SetFulfillmentCallback = (chosenFulfillment: Fulfillment) => void;

export const OrderFulfillmentsList = ({order, setFulfillment} : {order: Order, setFulfillment: SetFulfillmentCallback}) => {
  return (
    <Grid2 container direction={'column'} rowSpacing={4} alignItems={'center'} paddingTop={4}>
      <Grid2>
        <Heading level="h3">Choose fulfillment to create a label</Heading>
      </Grid2>
      <Grid2>
        <SelectFulfillment order={order} setFulfillment={setFulfillment}/>
      </Grid2>
    </Grid2>
  )
}