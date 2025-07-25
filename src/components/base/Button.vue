<script setup>
const props = defineProps({
  label: String,
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
      :style="`background:${props.color}`"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
    >
      {{ props.label }}
    </button>
  </div>
</template>
