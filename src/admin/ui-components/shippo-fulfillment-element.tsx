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

import React, { useEffect, useState } from "react"
import { Grid2 } from "@mui/material";
import { Alert, Button, toast } from "@medusajs/ui"
import { Fulfillment, Order } from "@medusajs/medusa";
import { getAddressToFromOrder, getLineItemsFromFulfillment } from "./utils/shippo-utils";
import { getWeightUnit, isFulfillmentReady } from "./utils/helpers";

declare global {
  interface Window { shippo: any; }
}
window.shippo = window.shippo || {};

function checkFulfillment(fulfillment: Fulfillment) : Fulfillment | undefined {
  if (isFulfillmentReady(fulfillment)) {
    return fulfillment;
  }
  return undefined;
}

export const ShippoFulfillmentElement = ({token, order, fulfillment } : 
  {token: string, order: Order, fulfillment: Fulfillment}) => {

  const [error, setError] = useState<string | undefined>(undefined);

  const [labelOpen, setLabelOpen] = useState<boolean>(true);

  useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "https://js.goshippo.com/embeddable-client.js";
    script.async = true;
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const listenForEvents = React.useCallback(() => {
    if (window.shippo) {
      window.shippo.on('CLOSE_BUTTON_CLICKED', (e: any) => {
        setLabelOpen(false);
      });
      window.shippo.on('LABEL_PURCHASED_SUCCESS', (e: any) => {
        console.log('Label was successfully purchased!', e);
        toast.success("Label", {
          description: 'Label was successfully purchased!',
        })
      });
      window.shippo.on('ORDER_CREATED', (e: any) => {
        console.log('Order created through Elements', e);
        toast.info("Order", {
          description: 'Order created through Elements',
        })
      });
      window.shippo.on('ERROR', (e: any) => {
        console.error('An error occurred!', e);
        toast.error("Label", {
          description: 'An error occurred!',
        })
      });
    }
  }, []);

  const purchaseLabel = React.useCallback(() => {
    const shippoFulfillment = checkFulfillment(fulfillment);
    if (shippoFulfillment) {
      setError(undefined);
      setLabelOpen(true);
      if (window.shippo) {
        window.shippo.init({
          token,
          locale: 'en',
          theme: {
            width: '600px',
            height: '800px',
          },
        });
        listenForEvents();
        window.shippo.labelPurchase('#shippo-label-purchase', {
          address_to: getAddressToFromOrder(order),
          line_items: getLineItemsFromFulfillment(order, shippoFulfillment),
          order_number: order.display_id.toString(),
          weight_unit: getWeightUnit()
        });
      }
    } else {
      setError("Fulfillment is not created for this order.");
    }
  }, [token, listenForEvents, order]);

  return (
    <Grid2 container direction={'column'} alignItems={'center'} rowSpacing={4}>
      <Grid2>
        <Button className="App-purchase-label-btn" onClick={purchaseLabel}>Generate fulfilment label</Button>
      </Grid2>
      {error && <Grid2>
          <Alert variant="error">{error}</Alert>
      </Grid2>}
      {labelOpen && <Grid2>
        <div id="shippo-label-purchase" className="App-purchase-label-container"></div>
      </Grid2>}
    </Grid2>
  );
}