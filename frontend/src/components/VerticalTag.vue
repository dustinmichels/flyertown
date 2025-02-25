<script setup lang="ts">
interface Props {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
}

withDefaults(defineProps<Props>(), {
  text: "Flyer Town",
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
}

.tag-content {
  padding: 1.5rem 0.5rem;
  border-radius: 0 8px 8px 0;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  pointer-events: auto; /* Enable pointer events */
  cursor: pointer; /* Show pointer cursor on hover */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Add smooth transitions */
  transform: translateX(0); /* Initial position */
}

.tag-content:hover {
  transform: translateX(5px); /* Move 5px to the right on hover */
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25); /* Enhanced shadow */
}

.tag-content:active {
  transform: translateX(8px); /* Move 8px to the right when clicked */
}

.vertical-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.letter {
  font-size: 1.8rem;
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

  .tag-content:hover {
    transform: translateX(3px); /* Smaller movement for mobile */
  }

  .tag-content:active {
    transform: translateX(5px); /* Smaller movement for mobile */
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
