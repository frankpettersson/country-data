<template lang="pug">
  .countries-container
    .item-container.card-first
      .item-grid
        .item-wrapper
          .item.centered
            .form__group.field.rmR
              input.form__field(type="input" v-model="searchCountry" placeholder="Search for country" name="searchCountry" id='search-country')
              label.form__label(for="search-country") Search
        .item-wrapper
          .item.centered
            .country-initial-filter
              a.filter-by-letter.rmR(role="button" v-for="initial in countryInitials" @click="addFilter") {{ initial }}
      .active-filters.card-last(v-if="showActiveFilters")
        a.active-filter(role="button" v-for="filter in letterFilter" @click="removeFilter")
          span.active-filter-text.rmR {{ filter }}
          span.active-filter-remove
        .card-overlay
      .card-overlay
    .item-container.card
      .item-grid
        .item-wrapper
          .item.centered
            h3.rmR Results: {{ numberOfResults }}
        .item-wrapper
          .item
            h3.rmR Countries by region: 
            ul.regions.rmR
              li.region(v-for="region in countriesByRegion")
                p.rmR(v-if="region === 'Africa'") {{ region }}: {{ countriesByRegionCount.Africa }}
                p.rmR(v-else-if="region === 'Americas'") {{ region }}: {{ countriesByRegionCount.Americas }}
                p.rmR(v-else-if="region === 'Asia'") {{ region }}: {{ countriesByRegionCount.Asia }}
                p.rmR(v-else-if="region === 'Europe'") {{ region }}: {{ countriesByRegionCount.Europe }}
                p.rmR(v-else-if="region === 'Oceania'") {{ region }}: {{ countriesByRegionCount.Oceania }}
                p.rmR(v-else-if="region === 'Polar'") {{ region }}: {{ countriesByRegionCount.Polar }}
      .card-overlay
    .country-grid.card-last
      figure.country.card(v-for="country in filteredCountries")
        img(:src="country.flag" :alt="country.name" width="120px" height="100px" loading="lazy")
        figcaption.rmR {{ country.name }}
        .card-overlay
      .card-overlay
    .clickedCountry.card-last(v-for="country in filteredCountries")
      figure.country.card
        img(:src="country.flag" :alt="country.name" width="120px" height="100px" loading="lazy")
        figcaption.rmR {{ country.name }}
        .card-overlay
      .card 
        b.rmR Native name:
        p.rmR {{ country.nativeName }}
        .card-overlay
      .card
        b.rmR Alternative spellings:
        p.rmR(v-for="altSpelling in country.altSpellings") {{ altSpelling }}
        .card-overlay
      .card
        b.rmR Capital:
        p.rmR {{ country.capital }}
        .card-overlay
      .card
        b.rmR Region:
        p.rmR {{ country.region }}
        .card-overlay
      .card
        b.rmR Subregion:
        p.rmR {{ country.subregion }}
        .card-overlay
      .card
        b.rmR Coordinates:
        p.rmR(v-for="latlng in country.latlng") {{ latlng }}
        .card-overlay
      .card
        b.rmR Demonym:
        p.rmR {{ country.demonym }}
        .card-overlay
      .card
        b.rmR Area:
        p.rmR {{ country.area }}
        .card-overlay
      .card
        b.rmR Bordering countries:
        p.rmR(v-for="border in country.borders") {{ border }}
        .card-overlay
      .card
        b.rmR Timezones:
        p.rmR(v-for="timezone in country.timezones") {{ timezone }}
        .card-overlay
      .card
        b.rmR Currencies:
        p.rmR(v-for="currency in country.currencies") {{ currency.name }}: {{ currency.symbol }}
        .card-overlay
      .card
        b.rmR Languages:
        p.rmR(v-for="language in country.languages") {{ language.name }}
        .card-overlay
      .card
        b.rmR Name in other languages:
        p.rmR Deutch: {{ country.translations.de }}
        .card-overlay
      .card-overlay

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
      searchCountry: ''
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
            country.name
              .toLowerCase()
              .includes(this.searchCountry.toLowerCase()) &&
            this.letterFilter.includes(country.name.substring(0, 1))
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return country.name
            .toLowerCase()
            .includes(this.searchCountry.toLowerCase());
        }
      });
    },
    countryInitials() {
      return this.allCountries
        .map(country => country.name.substring(0, 1))
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
    },
    numberOfResults() {
      return this.filteredCountries.length;
    },
    countriesByRegion() {
      return this.filteredCountries
        .map(country => country.region)
        .filter((v, i, a) => a.indexOf(v) === i)
        .filter(e => e !== '')
        .sort();
    },
    countriesByRegionCount() {
      return this.filteredCountries.reduce(function(obj, v) {
        obj[v.region] = (obj[v.region] || 0) + 1;
        return obj;
      }, {});
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../style/countries.scss';
@import '../style/search.scss';
</style>
