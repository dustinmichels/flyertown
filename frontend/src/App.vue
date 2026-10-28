<script setup lang="ts">
import { ref } from 'vue'
import CommitHash from './components/CommitHash.vue'
import IconPanel, { type IconAction } from './components/IconPanel.vue'
import ProgressBar from './components/ProgressBar.vue'
import TelephonePole from './components/TelephonePole.vue'
import VerticalTag from './components/VerticalTag.vue'

const progress = ref(0)

function onAction(action: IconAction) {
  console.log(`Icon clicked: ${action}`)
}
</script>

<template>
  <TelephonePole v-model:progress="progress" />
  <IconPanel @select="onAction" />
  <ProgressBar :progress="progress" />
  <VerticalTag />
  <CommitHash />
</template>
