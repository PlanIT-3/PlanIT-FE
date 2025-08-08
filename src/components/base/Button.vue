<script setup>
const props = defineProps({
  label: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "#433D8B",
  },
  hoverColor: {
    type: String,
    default: "#3a3376",
  },
});

function handleMouseOver(event) {
  event.target.style.background = props.hoverColor;
}
function handleMouseLeave(event) {
  event.target.style.background = props.color;
}
</script>

<template>
  <div class="Button w-full">
    <button
      class="w-full px-6 py-4 text-white text-lg font-medium rounded-lg transition-colors"
      :class="{ 'opacity-50 cursor-not-allowed': props.disabled }"
      :style="`background:${props.disabled ? '#9ca3af' : props.color}`"
      :disabled="props.disabled"
      @mouseover="!props.disabled && handleMouseOver"
      @mouseleave="!props.disabled && handleMouseLeave"
      @click="!props.disabled && $emit('click')"
      type="button"
    >
      {{ props.label }}
    </button>
  </div>
</template>
