<script setup lang="ts">
import { defineProps } from "vue";

interface Props {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  text: "FLYER TOWN",
  backgroundColor: "rgba(240, 240, 240, 0.8)",
  textColor: "#546a7b",
});
</script>

<template>
  <div class="vertical-tag">
    <div
      class="tag-content"
      :style="{
        backgroundColor: backgroundColor,
        color: textColor,
      }"
    >
      <div class="vertical-text">
        <span v-for="(char, index) in text" :key="index" class="letter">
          {{ char }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vertical-tag {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  pointer-events: none; /* Allow clicks to pass through */
}

.tag-content {
  padding: 1.5rem 0.5rem;
  border-radius: 0 8px 8px 0;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
}

.vertical-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.letter {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.2;
  text-transform: uppercase;
  margin: 0.2rem 0;
}

/* For touch devices and smaller screens */
@media (max-width: 768px) {
  .tag-content {
    padding: 1rem 0.4rem;
  }

  .letter {
    font-size: 1.2rem;
    margin: 0.15rem 0;
  }
}

/* For very small screens */
@media (max-width: 480px) {
  .tag-content {
    padding: 0.8rem 0.3rem;
  }

  .letter {
    font-size: 1rem;
    margin: 0.1rem 0;
  }
}
</style>
