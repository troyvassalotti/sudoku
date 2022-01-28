<script setup>
const props = defineProps({
  field: Object,
  onChange: Function
})

function handleChange(e) {
  const el = e.target
  const value = e.target.value === '' ? null : parseInt(e.target.value, 10)
  props.onChange({...props.field, value: value, el: el})
}
</script>

<template>
  <input class="field" inputmode="numeric" maxlength="1" pattern="[0-9]*" :value="props.field.value || ''" :readonly="props.field.readonly" @change="handleChange">
</template>

<style lang="scss" scoped>
.field {
  --lightness: 8%;
  aspect-ratio: 1 / 1;
  border: 1px solid var(--eerie-black);
  color: hsl(0deg, 0%, var(--lightness));
  font: {
    size: var(--step-1);
  }
  text-align: center;

  &[readonly] {
    --lightness: 30%;
    cursor: not-allowed;
  }

  &:nth-of-type(3) {
    border-inline-end-width: var(--thickness);
  }

  &:nth-of-type(6) {
    border-inline-end-width: var(--thickness);
  }

  &.wrong:not([readonly]) {
    background-color: rgb(255 0 0 / 0.3);
  }

  &.correct:not([readonly]) {
    background-color: rgba(0 255 0 / 0.3);
  }
}
</style>