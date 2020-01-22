<template lang="pug">
  #app
    header.card-first-last
      Heading
      .card-overlay
    main.card
      Countries
      .card-overlay
    footer.card-first-last
      Footer
      .card-overlay
</template>

<script>
import Heading from '~/components/heading.vue';
import Footer from '~/components/footer.vue';
import Countries from '~/components/countries.vue';

export default {
  components: {
    Heading,
    Footer,
    Countries
  }
};
</script>

<style lang="scss">
@import '~/assets/style/app', '~/assets/style/fonts';
</style>
