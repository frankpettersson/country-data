<template lang="pug">
  #app
    main.card
      countries
</template>

<script>
import countries from '@/components/countries.vue'
export default {
  components: {
    countries
  }
}
</script>

<style lang="scss">
@import '@/assets/style/main', '@/assets/style/fonts';
</style>
