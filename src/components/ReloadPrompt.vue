<script setup>
import { useRegisterSW } from "virtual:pwa-register/vue";

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>

<template>
  <div v-if="offlineReady || needRefresh" class="pwa-toast" role="alert">
    <div class="message">
      <p v-if="offlineReady">App ready to work offline</p>
      <p v-else>New content available, click on reload button to update.</p>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">Reload</button>
    <button @click="close">Close</button>
  </div>
</template>

<style>
.pwa-toast {
  background-color: rgb(0 0 0 / 0.9);
  border: 1px solid #8885;
  border-radius: 4px;
  box-shadow: 3px 4px 5px 0 #8885;
  color: rgb(255 255 255 / 0.9);
  inset-block-end: 0;
  inset-inline-end: 0;
  margin: 1rem;
  padding: 0.75rem;
  position: fixed;
  text-align: start;
  z-index: 1;
}
</style>
