<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import Product from "@/components/Product.vue";
import Button from "@/components/Button.vue";
import { formatCurrency } from "@/lib/utils";
import { TAX_RATE, SHIPPING_FLAT } from "@/lib/config";
import { productsService } from "@/lib/services/products";
import { cartService } from "@/lib/services/cart";
import { useCartStore } from "@/store/cart";
import { useToast } from "vue-toastification";
import { LoaderCircle } from "lucide-vue-next";

const cartStore = useCartStore();
const toast = useToast();
const { isLoading, initializeCart } = cartStore;

// Fetch initial cart data
onMounted(() => {
  initializeCart();
});

const addProductToCart = async () => {
  const newProduct = await cartService.addProduct();
  cartStore.addProduct(newProduct);
  toast.success("Product added!");
};

const proceedToCheckout = () => {
  toast.success("Proceeding to checkout!");
};
</script>

<template>
  <div class="min-h-screen px-6 py-10 lg:px-12">
    <div class="mx-auto max-w-7xl">
      <div class="grid gap-10 lg:grid-cols-6">
        <!-- LEFT: product list -->
        <section class="lg:col-span-4">
          <!-- headers -->
          <header class="grid grid-cols-6 gap-4 items-center mb-12">
            <div class="col-span-3 text-xl font-semibold">Product</div>
            <div class="text-xl font-semibold">Price</div>
            <div class="text-xl font-semibold">Quantity</div>
            <div class="text-xl font-semibold">Total</div>
          </header>

          <!-- items -->
          <main>
            <span v-if="cartStore.isLoading">
              <LoaderCircle class="animate-spin" />
            </span>

            <div
              v-else
              v-for="product in cartStore.products"
              :key="product.id"
              class="pb-4"
            >
              <Product
                :product="product"
                @remove="cartStore.removeProduct(product.id)"
                @changeQty="
                  (quantity) =>
                    cartStore.changeProductQuantity(product.id, quantity)
                "
              />
            </div>

            <!-- footer actions -->
            <div class="mt-6 flex items-center justify-between">
              <Button @click="addProductToCart" label="Add item" />
              <Button
                label="Clear Cart"
                @click="cartStore.clearCart"
                variant="secondary"
              />
            </div>
          </main>
        </section>

        <!-- RIGHT: summary + shipping -->
        <aside class="lg:col-span-2">
          <h2 class="mb-12 text-center text-xl font-semibold">Cart Totals</h2>
          <span v-if="cartStore.isLoading">
            <LoaderCircle class="animate-spin" />
          </span>
          <div v-else class="rounded-2xl bg-slate-100 p-6 shadow-sm">
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Subtotals:</span>
                <span class="font-semibold">
                  {{ cartStore.getAmount }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-semibold">
                  {{ formatCurrency(SHIPPING_FLAT) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Tax ({{ TAX_RATE * 100 }}%)</span>
                <span class="font-semibold">
                  {{ cartStore.getTaxAmount }}
                </span>
              </div>
              <hr class="my-2 border-slate-200" />
              <div class="flex items-center justify-between">
                <span class="text-gray-800 font-medium">Totals:</span>
                <span class="font-semibold">
                  {{ cartStore.getTotal }}
                </span>
              </div>
            </div>

            <Button
              class="mt-4"
              label="Proceed To Checkout"
              variant="primary"
              block
              @click="proceedToCheckout"
            />
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
