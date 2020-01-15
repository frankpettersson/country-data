<template lang="pug">
  section.country-container.card
    h1 {{ test }}
    .card-overlay.card-overlay-depth-1
    .item-container
      h2.rmR Stats
      .item-grid
    .item-container
      h2.rmR Sort
    .item-container
      h2.rmR Filter
      .item-grid
        .filter.card
          .filter-wrapper
            .form__group.field.rmR
              input.form__field(type="input" v-model="search" placeholder="Name" name="name" id='name')
              label.form__label(for="name") Search
            //label.rmR.h3(for="search-filter") Search
            //input#search-filter(type="text" v-model="search")
          .card-overlay.card-overlay-depth-3
        .filter.card
          .filter-wrapper
            h3.rmR Initial
            .country-initial-filter
              a.filter-by-letter.rmR(role="button" v-for="initial in countryInitials" @click="addFilter") {{ initial }}
          .card-overlay.card-overlay-depth-3
      .active-filters.card(v-if="showActiveFilters")
        a.active-filter(role="button" v-for="filter in letterFilter" @click="removeFilter")
          span.active-filter-text.rmR {{ filter }}
          span.active-filter-remove
        .card-overlay.card-overlay-depth-2
    .country-grid
        figure.country(v-for="country in filteredCountries")
          img(:src="country.flag" :alt="country.name" width="120px" height="100px" loading="lazy")
          figcaption.rmR {{ country.name }}
</template>

<script>
import json from '../assets/data/countries.json';
import { Country } from '../types/index';
export default {
  name: 'countries',
  data: function() {
    return {
      allCountries: json,
      letterFilter: [],
      showActiveFilters: false,
      search: '',
      showLog: '',
      test: ''
    };
  },
  methods: {
    addFilter(e) {
      const letter = e.target.textContent;
      if (!this.letterFilter.includes(letter)) this.letterFilter.push(letter);
      if (!this.showActiveFilters) this.showActiveFilters = true;
    },
    removeFilter(e) {
      const letter = e.target.textContent;
      const i = this.letterFilter.indexOf(letter);
      if (this.letterFilter.includes(letter)) this.letterFilter.splice(i, 1);
      if (this.letterFilter.length === 0) this.showActiveFilters = false;
    }
  },
  computed: {
    filteredCountries() {
      return this.allCountries.filter(country => {
        if (this.letterFilter.length > 0) {
          if (
            country.name.toLowerCase().includes(this.search.toLowerCase()) &&
            this.letterFilter.includes(country.name.substring(0, 1))
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return country.name.toLowerCase().includes(this.search.toLowerCase());
        }
      });
    },
    countryInitials() {
      return this.allCountries
        .map(country => country.name.substring(0, 1))
        .filter((v, i, a) => a.indexOf(v) === i) //Removes duplicates.
        .sort();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../style/countries.scss';
</style>
