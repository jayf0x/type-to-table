<script setup lang="ts">
type Props = {
  /** Foo value. @default 'bar' */
  foo?: string;
};
defineProps<Props>();
</script>

<template>
  <div>{{ foo }}</div>
</template>
