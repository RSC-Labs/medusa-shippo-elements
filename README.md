# Medusa Shippo Elements

## What is it?

Medusa Shippo Elements is a plugin which provides functionality for generating labels directly from the Admin UI.

## How to install?

1. Install the package with `yarn add @rsc-labs/medusa-shippo-elements` or `npm i @rsc-labs/medusa-shippo-elements`.
2. In `medusa-config.js`, add the plugin to the `plugins` array and set `enableUI`

```js
const plugins = [
  // ... other plugins
  {
    resolve: `@rsc-labs/medusa-shippo-elements`,
    options: {
      token: SHIPPO_API_TOKEN,
      enableUI: true
    }
  }
]
```

## Getting started

Before running a Medusa please remember to set your `SHIPPO_API_TOKEN`  in configuration.

After plugin installation, you can go to one of your orders and you will see additional UI element at the bottom.

You have there two tabs - `Shipping` and `Return`.

### Shipping

This tab is used for creating a shipping label to send your items to customer. 

Before that, you need to create a fulfillment using `Create fulfillment` option, which is visible above (it is a part of default Admin UI functionalities).

After creating a fulfillment, you can choose such fulfillment from the list and the label configuration will be automatically filled by the items which you have chosen in fulfillment. For your convenience, also the weight is calculated, so you have all information needed to generate a label.

### Return

This tab is used for creating a return label which can be used by your customer.

Before that, you need to create a return using `Create return` option, which is available on the right sidebar (it is a part of default Admin UI functionalities).

After creating a return, you can choose such return from the list and the label configuration will be automatically filled. 

**_NOTE:_**
Shippo Elements does not provide ability to change sender address from API level. It means that you need to do manually through Shippo Elements. Please remember to switch addresses for the returns.

## Configuration

### Weight unit

By default Shippo Elements are using `g` (`Gram`) as the weight unit. If you would like to change it, you have 4 options:
- 'g'
- 'kg'
- 'oz'
- 'lb'

To apply other weight unit, please export environment variable called `MEDUSA_ADMIN_SHIPPO_WEIGHT_UNIT`. For example: `export MEDUSA_ADMIN_SHIPPO_WEIGHT_UNIT='oz'`

## Proposals, bugs, improvements

If you have an idea, what could be the next highest priority functionality, do not hesistate raise issue here: [Github issues](https://github.com/RSC-Labs/medusa-shippo-elements/issues)

## License

MIT

---

© 2024 RSC https://rsoftcon.com/