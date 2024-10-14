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

import { useState } from "react"
import type { OrderDetailsWidgetProps, WidgetConfig } from "@medusajs/admin"
import { CircularProgress, Grid2 } from "@mui/material";
import { Container, Heading, Tabs, Alert } from "@medusajs/ui"
import { useAdminCustomQuery, useAdminRegion } from "medusa-react";
import { Fulfillment, Order, Return } from "@medusajs/medusa";
import { OrderFulfillmentsList } from "../ui-components/order-fulfillments-list";
import { OrderReturnsList } from "../ui-components/order-returns-list";
import { ShippoFulfillmentElement } from "../ui-components/shippo-fulfillment-element";
import { ShippoReturnElement } from "../ui-components/shippo-return-element";
import { Toaster } from "@medusajs/ui"

type AdminShippoAuthGetReq = {}

type ShippoAuthResponse = {
  token: string,
  expiresIn: number
}

const ShippoShipmentArea = ({ token, order } : { token: string, order: Order}) => {
  const [chosenFulfillment, setChosenFulfillment] = useState<Fulfillment>(undefined);
  return (
    <Grid2 container direction={'column'} justifyContent={'center'}>
      <Grid2>
        <OrderFulfillmentsList order={order} setFulfillment={setChosenFulfillment}/>
      </Grid2>
      {chosenFulfillment && <Grid2 paddingTop={3}>
        <ShippoFulfillmentElement token={token} order={order} fulfillment={chosenFulfillment}/>
      </Grid2>}
    </Grid2>
  )
}

const ShippoReturnArea = ({ token, order } : { token: string, order: Order}) => {
  const [chosenReturn, setChosenReturn] = useState<Return>(undefined);
  return (
    <Grid2 container direction={'column'} justifyContent={'center'}>
      <Grid2>
        <OrderReturnsList order={order} setReturn={setChosenReturn}/>
      </Grid2>
      {chosenReturn && <Grid2 paddingTop={3}>
        <ShippoReturnElement token={token} order={order} ret={chosenReturn}/>
      </Grid2>}
    </Grid2>
  )
}

const ShippoArea = ({ order } : { order: Order}) => {
  const { data, isError, error, isLoading } = useAdminCustomQuery
    <AdminShippoAuthGetReq, ShippoAuthResponse>(
      "/fulfillments/shippo/auth",
      [''],
      {
      }
    )

  if (isError) {
    const trueError = error as any;
    const errorText = `Error: ${trueError?.response?.data?.message}`
    return <Alert variant="error">{errorText}</Alert>
  }
  return (
    <Grid2 container direction={'column'} justifyContent={'center'} alignItems={'center'}>
      <Grid2>
        {!isLoading && data &&
        <Tabs defaultValue='shipment'>
          <Tabs.List style={ { justifyContent: 'center' } }>
            <Tabs.Trigger value='shipment'>Shipment</Tabs.Trigger>
            <Tabs.Trigger value='return'>Return</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value='shipment'>
            <ShippoShipmentArea token={data.token} order={order}/>
          </Tabs.Content>
          <Tabs.Content value='return'>
            <ShippoReturnArea token={data.token} order={order}/>
          </Tabs.Content>
        </Tabs>
        }
        {isLoading && 
          <CircularProgress size={8}/>}
      </Grid2>
    </Grid2>
  );
}

const ShippoFulfillmentCheck = ({ order, } : { order: Order }) => {
  return (
    <Container>
      <Grid2 container direction={'column'} justifyContent={'center'}>
        <Grid2>
          <Heading level="h1">Shippo fulfillment</Heading>
        </Grid2>
        <Grid2 paddingTop={3}>
          <ShippoArea order={order} />
        </Grid2>
      </Grid2>
    </Container>
  ); 
}

const OrderShippoWidget = ({
  order,
  notify
} : OrderDetailsWidgetProps) => {

  return (
    <>
    <Toaster position="top-right"/>
    <ShippoFulfillmentCheck order={order}/>
    </>
  )
}

export const config: WidgetConfig = {
  zone: "order.details.after",
}

export default OrderShippoWidget