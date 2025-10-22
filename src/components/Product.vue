<script setup lang="ts">
import { computed, toRef } from "vue";
import type { Product } from "@/lib/types/product";
import { formatCurrency } from "@/lib/utils";
import { Plus, Minus, X } from "lucide-vue-next";

const props = defineProps<{ product: Product }>();
const emit = defineEmits<{
  (e: "remove"): void;
  (e: "changeQty", qty: number): void;
}>();

const product = toRef(props, "product");

const qty = computed(() => product.value.quantity ?? 1);
const unitPrice = computed(() => product.value.price ?? 0);
const total = computed(() => unitPrice.value * qty.value);

// pre-format for template
const unitPriceFormatted = computed(() => formatCurrency(unitPrice.value));
const totalFormatted = computed(() => formatCurrency(total.value));

function onDecrement() {
  if (qty.value > 1) emit("changeQty", qty.value - 1);
}
function onIncrement() {
  emit("changeQty", qty.value + 1);
}
function onRemove() {
  emit("remove");
}
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-6 items-center gap-4 border-b border-slate-200 pb-4">
    <div class="col-span-2 md:col-span-3 flex items-start gap-4">
      <div class="relative h-20 w-20 shrink-0 rounded-lg bg-slate-200">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.title"
          class="h-full w-full rounded-lg object-cover"
        />
        <button
          @click="onRemove"
          class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black p-1 text-[10px] font-bold text-white hover:opacity-90"
          aria-label="Remove"
          type="button"
        >
          <X class="h-3 w-3" />
        </button>
      </div>

      <div class="space-y-1">
        <h3 class="text-sm font-semibold text-gray-900">
          {{ product.title }}
        </h3>
        <p v-if="product.category" class="text-sm text-gray-400">
          Category: <span class="ml-1">{{ product.category }}</span>
        </p>
        <p v-if="product.rating" class="text-sm text-gray-400">
          Rating: <span class="ml-1">{{ product.rating.rate }}</span>
        </p>

        <!-- Mobile-only inline prices -->
        <div class="mt-1 space-y-0.5 md:hidden">
          <div class="text-[13px]">Unit: {{ unitPriceFormatted }}</div>
          <div class="text-[13px]">Total: {{ totalFormatted }}</div>
        </div>
      </div>
    </div>

    <!-- Unit price (desktop only) -->
    <span class="hidden md:block">
      {{ unitPriceFormatted }}
    </span>

    <!-- Quantity -->
    <div class="col-span-1">
      <div class="inline-flex items-center rounded-md border border-slate-200 bg-slate-100/60">
        <button
          class="px-1 py-1 text-sm bg-slate-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="qty <= 1"
          @click="onDecrement"
          aria-label="Decrease quantity"
          type="button"
        >
          <Minus class="h-3 w-3" />
        </button>
        <span class="select-none px-3 text-xs text-gray-600">
          {{ qty }}
        </span>
        <button
          class="px-1 py-1 text-sm bg-slate-200 cursor-pointer"
          @click="onIncrement"
          aria-label="Increase quantity"
          type="button"
        >
          <Plus class="h-3 w-3" />
        </button>
      </div>
    </div>

    <!-- Total (desktop only) -->
    <span class="hidden md:block">
      {{ totalFormatted }}
    </span>
  </div>
</template>
