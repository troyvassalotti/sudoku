<script setup>
const props = defineProps({
  field: Object,
  onChange: Function
})

function handleChange(e) {
  const value = e.target.value === '' ? null : parseInt(e.target.value, 10)
  props.onChange({...props.field, value: value})
}
</script>

<template>
  <input class="field" inputmode="numeric" maxlength="1" pattern="[0-9]*" :value="props.field.value || ''" :readonly="props.field.readonly" @change="handleChange">
</template>

<style lang="scss" scoped>
.field {
  --lightness: 40%;
  aspect-ratio: 1 / 1;
  border: 1px solid var(--eerie-black);
  color: hsl(0deg, 0%, var(--lightness));
  font: {
    size: var(--step-1);
  }
  text-align: center;

  &[readonly] {
    --lightness: 8%;
    cursor: not-allowed;
  }

  &:nth-of-type(3) {
    border-inline-end-width: var(--thickness);
  }

  &:nth-of-type(6) {
    border-inline-end-width: var(--thickness);
  }
}
</style>