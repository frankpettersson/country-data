<template lang="pug">
  #app
    header.card
      Heading
    main.card
      Countries
</template>

<script>
import Heading from '~/components/heading.vue';
import Countries from '~/components/countries.vue';
export default {
  components: {
    Heading,
    Countries
  }
};
</script>

<style lang="scss">
@import '~/assets/style/main', '~/assets/style/fonts';
</style>
