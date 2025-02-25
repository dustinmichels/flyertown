<script setup lang="ts">
import { watch } from "vue";

// Props for the modal component
const props = defineProps<{
  show: boolean;
  imageUrl: string;
  title: string;
  description: string;
}>();

// Emit events to control modal
const emit = defineEmits(["close"]);

// Handle ESC key to close modal
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    emit("close");
  }
};

// Add and remove event listeners
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling while modal is open
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; // Restore scrolling
    }
  }
);

// Close on overlay click
const closeModal = () => {
  emit("close");
};

// Prevent modal content clicks from closing the modal
const preventClose = (e: Event) => {
  e.stopPropagation();
};
</script>

<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click="preventClose">
          <button class="modal-close" @click="closeModal" aria-label="Close">
            ×
          </button>
          <div class="modal-content">
            <div class="modal-image">
              <img :src="imageUrl" :alt="title" />
            </div>
            <div class="modal-details">
              <h2 class="modal-title">{{ title }}</h2>
              <div class="modal-description">{{ description }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  max-width: 90%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  width: 1000px;
  color: #f0f0f0;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: rgba(255, 69, 0, 0.8);
}

.modal-content {
  display: flex;
  flex-direction: row;
  height: 100%;
}

@media (max-width: 768px) {
  .modal-content {
    flex-direction: column;
  }

  .modal-container {
    max-height: 80vh;
  }

  .modal-image {
    max-height: 50vh !important;
  }
}

.modal-image {
  flex: 3;
  max-height: 80vh;
  overflow: hidden;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.modal-details {
  flex: 2;
  padding: 30px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #ffffff;
  font-weight: 600;
}

.modal-description {
  font-size: 16px;
  line-height: 1.6;
  color: #d0d0d0;
}

/* Transition effects */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
