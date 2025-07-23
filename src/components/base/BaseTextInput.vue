<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "Enter your email" },
  type: { type: String, default: "text" },
});
const emit = defineEmits(["update:modelValue"]);
</script>
<style scoped>
input::placeholder {
  color: #a0aec0;
  opacity: 1;
}
</style>
