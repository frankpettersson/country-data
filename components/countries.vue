<template lang="pug">
  .countries-container
    .card-first.filter-container
      .filter-grid
        .filter-wrapper
          .filter
            input.rmR(type="input" v-model="searchCountry" placeholder="Search" name="searchCountry" id='search-country')
            label(for="search-country") Search
        .filter-wrapper
          .filter
            .country-initial-filter
              a.filter-by-letter.rmM(role="button" v-for="initial in countryInitials" @click="addFilter") {{ initial }}
      .card-last.active-filters(v-if="showActiveFilters")
        a.active-filter(role="button" v-for="filter in letterFilter" @click="removeFilter")
          span.active-filter-text.rmR {{ filter }}
          span.active-filter-remove
        .card-overlay
      .card-overlay
    .card.country-grid
      figure.card.country(v-for="country in filteredCountries" @click="extendInformation(country)")
        img(:src="country.flag" :alt="country.name" width="130px" height="90px" loading="lazy")
        figcaption.rmM {{ country.name }}
        .card-overlay
      .card-overlay
    .extended-country-wrapper(v-show="showExtendedInfo === true")
      .card.extended-country
        .exit-button(@click="collapseExtendedInfo")
        .card.ec.ec-header.ec-name
          h1.rmR {{ extendedCountry.name }}
          .card-overlay
        .card.ec.ec-region
          p.rmM Region
          hr
          p.rmR {{ extendedCountry.region }}
          .card-overlay
        .card.ec.ec-subregion
          p.rmM Subregion
          hr
          p.rmR {{ extendedCountry.subregion }}
          .card-overlay
        .card.ec.ec-demonym
          p.rmM Demonym
          hr
          p.rmR {{ extendedCountry.demonym }}
          .card-overlay
        .card.ec.ec-area
          p.rmM Area
          hr
          p.rmR {{ formatLongNumber(extendedCountry.area) }} km
            sup 2
          .card-overlay
        .card.ec.ec-bordering
          p.rmM Bordering countries
          hr
          p.rmR(v-for="border in extendedCountry.borders") {{ border }}
          .card-overlay
        .card.ec.ec-currencies
          p.rmM Currencies
          hr
          p.rmR(v-for="currency in extendedCountry.currencies") {{ currency.name }} {{ currency.symbol }}
          .card-overlay
        .card.ec.ec-img
          img(:src="extendedCountry.flag" :alt="extendedCountry.name" width="250px" height="170px" loading="lazy")
          .card-overlay
        .card.ec.ec-native-name
          p.rmM Native name
          hr
          p.rmR {{ extendedCountry.nativeName }}
          .card-overlay
        .card.ec.ec-alternative-spellings
          p.rmM Alternative spellings
          hr
          p.rmR(v-for="altSpelling in extendedCountry.altSpellings") {{ altSpelling }}
          .card-overlay
        .card.ec.ec-capital
          p.rmM Capital
          hr
          p.rmR {{ extendedCountry.capital }}
          .card-overlay
        .card.ec.ec-timezones
          p.rmM Timezones
          hr
          p.rmR(v-for="timezone in extendedCountry.timezones") {{ timezone }}
          .card-overlay
        .card.ec.ec-languages
          p.rmM Languages
          hr
          p.rmR(v-for="language in extendedCountry.languages") {{ language.name }}
          .card-overlay
        .card-last.ec.ec-translations
          p.rmM Name in other languages
          hr
          table.rmR
            tbody
              tr
                td
                  p Deutsch:
                td
                  p {{ extendedCountry.translations.de }}
              tr
                td
                  p Español:
                td
                  p {{ extendedCountry.translations.es }}
              tr
                td
                  p Français:
                td
                  p {{ extendedCountry.translations.fr }}
              tr
                td
                  p Japanese:
                td
                  p {{ extendedCountry.translations.ja }}
              tr
                td
                  p Fārsi:
                td
                  p {{ extendedCountry.translations.fa }}
          .card-overlay
        .card-overlay
</template>

<script lang="ts">
import axios from 'axios';
import Vue from 'vue';
import { mockCountry } from '../assets/util/mockObjects';
import { Country } from '../assets/types/index';

export default Vue.extend({
  name: 'Countries',
  data() {
    return {
      allCountries: [] as Country[],
      letterFilter: [] as string[],
      searchCountry: '' as string,
      showActiveFilters: false as boolean,
      showExtendedInfo: false as boolean,
      extendedCountry: mockCountry as Country
    };
  },
  computed: {
    filteredCountries(): Country[] {
      return this.allCountries.filter((country: Country) => {
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
    countryInitials(): string[] {
      const newArr = this.allCountries.map((country: Country) =>
        country.name.substring(0, 1)
      ) as string[];

      return [...new Set(newArr)].sort() as string[];
    }
  },
  async created() {
    const config = {
      headers: {
        Accept: 'application/json'
      }
    };

    try {
      const res = await axios.get(
        'https://restcountries.eu/rest/v2/all',
        config
      );

      this.allCountries = res.data;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    addFilter(e: Event) {
      const letter = (e.target as Element).textContent as string;
      if (this.letterFilter.includes(letter) === false) {
        this.letterFilter.push(letter);
      }
      if (this.letterFilter.length !== 0) {
        this.showActiveFilters = true;
      }
    },
    removeFilter(e: Event) {
      const letter = (e.target as Element).textContent as string;
      const i: number = this.letterFilter.indexOf(letter);
      if (this.letterFilter.includes(letter)) {
        this.letterFilter.splice(i, 1);
      }
      if (this.letterFilter.length === 0) {
        this.showActiveFilters = false;
      }
    },
    extendInformation(country: Country) {
      this.extendedCountry = country;
      this.showExtendedInfo = true;
    },
    collapseExtendedInfo() {
      this.showExtendedInfo = false;
    },
    formatLongNumber(number: number) {
      if (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/style/countries.scss';
@import '@/assets/style/search.scss';
</style>
