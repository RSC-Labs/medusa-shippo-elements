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
import { Return, Order } from "@medusajs/medusa";

export type ChooseFulFillmentProps = {
  order: Order,
  setReturn: (chosenReturn: Return) => void
}

const SelectReturn = (props: ChooseFulFillmentProps) => {

  const { order, isLoading } = useAdminOrder(props.order.id, {
    fields: "returns",
  });

  const [ value , setValue ] = useState<string | undefined>();

  const handleChange = (retId: string) => {
    setValue(retId);
    props.setReturn(props.order.returns.find(ret => ret.id == retId))
  };

  return (
    <Select size="base" onValueChange={handleChange} value={value}>
      <Select.Trigger>
        <Select.Value placeholder="Select a return" />
      </Select.Trigger>
      <Select.Content>
          {isLoading && <CircularProgress/>}
          {order && order.returns && order.returns.sort((a, b) => a.created_at.getTime() - b.created_at.getTime()).map((ret) => (
            <Select.Item key={ret.id} value={ret.id}>
              {`Created at: ${new Date(ret.created_at).toDateString()}`}
            </Select.Item>
          ))}
      </Select.Content>
    </Select>
  )
}
type SetReturnCallback = (chosenReturn: Return) => void;

export const OrderReturnsList = ({order, setReturn} : {order: Order, setReturn: SetReturnCallback}) => {
  return (
    <Grid2 container direction={'column'} rowSpacing={4} alignItems={'center'} paddingTop={4}>
      <Grid2>
        <Heading level="h3">Choose return to create a label</Heading>
      </Grid2>
      <Grid2>
        <SelectReturn order={order} setReturn={setReturn}/>
      </Grid2>
    </Grid2>
  )
}