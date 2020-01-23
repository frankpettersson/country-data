<template lang="pug">
  .card-first-last
    .footer-wrapper
      h1.footer-title.rmR Country Data
      a.footer-github(href="https://github.com/frankpettersson/country-data" target="github" rel="noreferrer")
        img(src="../assets/img/GitHub-Mark-64px.png" alt="github")
      a.footer-data-source.rmR(href="https://restcountries.eu/" target="api source" rel="noreferrer") Data source
    .card-overlay
</template>

<script>
export default {
  name: 'Footer'
};
</script>

<style lang="scss" scoped>
.footer-wrapper {
  display: grid;
  grid-template-areas:
    'title'
    'data-source'
    'github';
  grid-gap: 10px;
  text-align: center;

  .footer-title,
  .footer-github,
  .footer-data-source {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .footer-title {
    grid-area: title;
  }

  .footer-github {
    grid-area: github;

    img {
      margin: 0 auto;
      width: 64px;
      border: 1px solid white;
      border-radius: 50%;
      background-color: #fff;
      object-fit: contain;
    }
  }

  .footer-data-source {
    grid-area: data-source;
  }
}

@media only screen and (min-width: 1100px) {
  .footer-wrapper {
    display: grid;
    grid-template-areas: 'title data-source github';
    grid-template-columns: 60% 20% 20%;
    text-align: left;
  }
}
</style>
