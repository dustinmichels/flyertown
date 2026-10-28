<script setup lang="ts">
const words = [
  { text: 'Flyer', color: '#546a7b' },
  { text: 'Town', color: '#34414c' },
]
</script>

<template>
  <div class="vertical-tag">
    <div v-for="word in words" :key="word.text" class="word" :style="{ color: word.color }">
      <span v-for="(char, i) in word.text" :key="i" class="letter">{{ char }}</span>
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
  padding: 1.5rem 0.5rem;
  border-radius: 0 8px 8px 0;
  background-color: rgba(240, 240, 240, 0.8);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    translate 0.3s ease,
    box-shadow 0.3s ease;
}

.vertical-tag:hover {
  translate: 5px 0;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
}

.vertical-tag:active {
  translate: 8px 0;
}

.word {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* One blank letter-height between words. */
.word + .word {
  margin-top: calc(1em + 0.4rem);
}

.letter {
  margin: 0.1rem 0;
}

@media (max-width: 768px) {
  .vertical-tag {
    padding: 1rem 0.4rem;
    font-size: 1.2rem;
  }

  .letter {
    margin: 0.08rem 0;
  }

  .vertical-tag:hover {
    translate: 3px 0;
  }

  .vertical-tag:active {
    translate: 5px 0;
  }
}

@media (max-width: 480px) {
  .vertical-tag {
    padding: 0.8rem 0.3rem;
    font-size: 1rem;
  }

  .letter {
    margin: 0.05rem 0;
  }
}
</style>
