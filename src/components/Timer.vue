<script setup>
import {onBeforeUnmount, onMounted, reactive} from "vue"

const props = defineProps({
  start: Date
})

const state = reactive({
  elapsed: 0,
  interval: setInterval(getTime, 1000)
})

function getTime() {
  state.elapsed = Math.floor((new Date().getTime() - props.start.getTime()) / 1000)
}

onMounted(() => {
  state.interval
})

onBeforeUnmount(() => {
  clearInterval(state.interval)
  delete state.interval
})
</script>

<template>
  <h2>Time: {{ state.elapsed }}</h2>
</template>