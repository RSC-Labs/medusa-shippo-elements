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

import { Logger, TransactionBaseService} from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils";

type ShippoAuthResponse = {
  token: string,
  expiresIn: number
}

export default class ShippoAuthService extends TransactionBaseService {

  protected readonly options: any;
  private readonly logger: Logger;
  private readonly token: string;

  constructor(
    container,
    options
  ) {
    super(container),
    this.options = options;
    this.logger = container.logger;
    if (options.token) {
      this.token = options.token;
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Shippo token is not set`
      )
    }
  }

  async generateToken() : Promise<ShippoAuthResponse> {
    const url = 'https://api.goshippo.com/embedded/authz';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `ShippoToken ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scope: "embedded:carriers"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      this.logger.error('Error fetching authorization token', error);
    }
  }
}