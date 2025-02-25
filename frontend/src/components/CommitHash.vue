<script setup lang="ts">
const commitHash = import.meta.env.VITE_GIT_COMMIT || 'dev'
</script>

<template>
  <div class="commit-hash">v. {{ commitHash }}</div>
</template>

<style scoped>
.commit-hash {
  position: fixed;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 8px;
  z-index: 20;
}
</style>
