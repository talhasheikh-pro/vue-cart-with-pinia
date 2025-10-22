# Vue 3 Based Cart Page with Pinia for State Management

### 📝 Project features & specifications

1. **Cart Interactivity:**
    - Controls to allow users to adjust the quantity of each item.
    - Functionality to remove an individual item from the cart (e.g., via the 'X' button).
    - The "Clear Cart" button functionality to remove all items.
    - The "Add Item" button functionality to add some product using POST at https://fakestoreapi.com/docs#tag/Products:
2. **Calculations & Summary:**
    - Dynamically calculate and display the overall Subtotal for the items in the cart.
    - Display the Total in the "Cart Totals" section + tax 20% (configurable).
    - Include the static "Proceed to Checkout" button (no functionality needed, simple notification is enough).
3. **State Management**
    - State management being handled via pinia for Cart
4. **Vitest & Testing Library**    
    - Vitest, in combination with React testing library for testing purpose
5. **Configurations**
    - Under the `lib/config.ts`, you can configure `currency`, `Tax rate` and `Shipping cost`


### To run the project, follow the below steps:

1. Run `npm run setup` (This will install the dependencies)
2. Run `npm run dev`   (This will start the development server)

Alternatively, you can also do the following based on your package manager

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Available commands

1. `npm run setup`  - To install dependencies
2. `npm run dev`    - To run development server
3. `npm run test`   - To run tests
4. `npm run build`  - To create build for deployment
