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
import { Order, Return } from "@medusajs/medusa";
import { getAddressToFromOrder, getLineItemsFromReturn } from "./utils/shippo-utils";

declare global {
  interface Window { shippo: any; }
}
window.shippo = window.shippo || {};

function checkReturn(ret: Return) : Return | undefined {
  if (ret && 
    (ret.status === "requested" || ret.status === 'requires_action')) {
    return ret;
  }
  return undefined;
}

export const ShippoReturnElement = ({token, order, ret} : 
  {token: string, order: Order, ret: Return}) => {

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
    const shippoReturn = checkReturn(ret);
    if (shippoReturn) {
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
          line_items: getLineItemsFromReturn(order, shippoReturn),
          order_number: order.display_id.toString()
        });
      }
    } else {
      setError("Chosen Return does not exist or has wrong status");
    }
  }, [token, listenForEvents, order]);

  return (
    <Grid2 container direction={'column'} alignItems={'center'} rowSpacing={4}>
      <Grid2>
        <Alert variant="warning">{`Remember to switch address for the return`}</Alert>
      </Grid2>
      <Grid2>
        <Button className="App-purchase-label-btn" onClick={purchaseLabel}>Generate label</Button>
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