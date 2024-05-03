<script setup lang="ts">
import TheCard from './components/TheCard.vue'
</script>

<template>
  <header>Client</header>

  <main>
    <TheCard />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>
