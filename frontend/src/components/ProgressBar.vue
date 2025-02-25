<script setup lang="ts">
import { defineProps } from "vue";

// Define props for the progress bar
defineProps<{
  progress: number; // The current progress value (0-100%)
}>();
</script>

<template>
  <div class="progress-bar">
    <div class="progress-track"></div>
    <div class="progress-dot" :style="{ left: progress + '%' }"></div>
  </div>
</template>

<style scoped>
.progress-bar {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 8px;
  display: flex;
  align-items: center;
  z-index: 100;
}

.progress-track {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  transform: translateY(-50%);
}

.progress-dot {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: rgba(76, 175, 80, 0.8);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: left 0.1s ease-out;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.7);
}
</style>
