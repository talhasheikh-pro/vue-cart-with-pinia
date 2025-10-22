<script setup lang="ts">
import { computed } from "vue";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    label?: string;
    variant?: Variant;
    block?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
  }>(),
  {
    variant: "primary",
    block: false,
    disabled: false,
    type: "button",
  }
);

const emit = defineEmits<{ (e: "click", evt: MouseEvent): void }>();

const base =
  "rounded-md font-medium hover:opacity-95 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 \
   disabled:cursor-not-allowed cursor-pointer px-4 py-2.5";

const variantClass = computed(() =>
  props.variant === "secondary"
    ? " bg-pink-500 text-white focus:ring-indigo-400"
    : "bg-emerald-500 text-white focus:ring-emerald-400"
);

const widthClass = computed(() => (props.block ? "w-full" : ""));

function onClick(evt: MouseEvent) {
  if (!props.disabled) emit("click", evt);
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[base, variantClass, widthClass]"
    @click="onClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>
