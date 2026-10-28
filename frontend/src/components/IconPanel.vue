<script setup lang="ts">
export type IconAction = 'settings' | 'favorites' | 'upload' | 'refresh'

const actions: { name: IconAction; icon: string; label: string }[] = [
  { name: 'settings', icon: 'gear', label: 'Settings' },
  { name: 'favorites', icon: 'heart', label: 'Favorites' },
  { name: 'upload', icon: 'upload', label: 'Upload' },
  { name: 'refresh', icon: 'arrows-rotate', label: 'Refresh' },
]

const emit = defineEmits<{ select: [action: IconAction] }>()
</script>

<template>
  <div class="icon-panel">
    <button
      v-for="action in actions"
      :key="action.name"
      class="icon-button"
      @click="emit('select', action.name)"
    >
      <i :class="['fas', `fa-${action.icon}`]"></i>
      <span class="tooltip">{{ action.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.icon-panel {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@media screen and (min-width: 768px) {
  .icon-panel {
    right: 40px;
    gap: 20px;
  }
}

@media screen and (min-width: 1024px) {
  .icon-panel {
    right: 80px;
  }
}

@media screen and (min-width: 1440px) {
  .icon-panel {
    right: 140px;
  }
}

.icon-button {
  position: relative;
  width: 45px;
  height: 45px;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.2s;
  color: #ffffff;
  font-family: inherit;
  font-weight: 500;
}

.icon-button i {
  font-size: 18px;
  transition: color 0.2s;
}

@media screen and (min-width: 768px) {
  .icon-button {
    width: 60px;
    height: 60px;
  }

  .icon-button i {
    font-size: 24px;
  }
}

.icon-button:hover {
  transform: scale(1.1);
  background-color: rgba(0, 0, 0, 0.8);
  color: #ff4500;
}

.tooltip {
  position: absolute;
  right: 70px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  opacity: 0;
  transform: translateX(-10px);
  transition:
    opacity 0.2s,
    transform 0.2s;
  pointer-events: none;
  white-space: nowrap;
}

@media screen and (max-width: 767px) {
  .tooltip {
    right: 55px;
    padding: 3px 8px;
    font-size: 12px;
  }
}

.icon-button:hover .tooltip {
  opacity: 1;
  transform: translateX(0);
}
</style>
