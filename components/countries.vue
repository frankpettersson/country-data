<template lang="pug">
  .countries-container
    .card-first.item-container
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
      .card-last.active-filters(v-if="showActiveFilters")
        a.active-filter(role="button" v-for="filter in letterFilter" @click="removeFilter")
          span.active-filter-text.rmR {{ filter }}
          span.active-filter-remove
        .card-overlay
      .card-overlay
    .card-last.country-grid
      figure.card.country(v-for="country in filteredCountries" @click="extendInformation(country)")
        img(:src="country.flag" :alt="country.name" width="120px" height="100px" loading="lazy")
        figcaption.rmR {{ country.name }}
        .card-overlay
      .card-overlay
    .extended-country-wrapper(v-show="showExtendedInfo === true")
      .card.extended-country
        .exit-button(@click="collapseExtendedInfo")
        .card.ec-header.ec-name
          h1.rmR {{ extendedCountry.name }}
          .card-overlay
        .card.ec-main.ec-region
          b.rmR Region:
          p.rmR {{ extendedCountry.region }}
          .card-overlay
        .card.ec-main.ec-subregion
          b.rmR Subregion:
          p.rmR {{ extendedCountry.subregion }}
          .card-overlay
        .card.ec-main.ec-coordinates
          b.rmR Coordinates:
          p.rmR(v-for="latlng in extendedCountry.latlng") {{ latlng }}
          .card-overlay
        .card.ec-main.ec-demonym
          b.rmR Demonym:
          p.rmR {{ extendedCountry.demonym }}
          .card-overlay
        .card.ec-main.ec-area
          b.rmR Area:
          p.rmR {{ extendedCountry.area }}
          .card-overlay
        .card.ec-main.ec-bordering
          b.rmR Bordering countries:
          p.rmR(v-for="border in extendedCountry.borders") {{ border }}
          .card-overlay
        .card.ec-main.ec-currencies
          b.rmR Currencies:
          p.rmR(v-for="currency in extendedCountry.currencies") {{ currency.name }}: {{ currency.symbol }}
          .card-overlay
        .card.ec-sidebar.ec-figure
          figure
            img(:src="extendedCountry.flag" :alt="extendedCountry.name" width="120px" height="100px" loading="lazy")
            figcaption.rmR {{ extendedCountry.name }}
          .card-overlay
        .card.ec-sidebar.ec-native-name
          b.rmR Native name:
          p.rmR {{ extendedCountry.nativeName }}
          .card-overlay
        .card.ec-sidebar.ec-alternative-spellings
          b.rmR Alternative spellings:
          p.rmR(v-for="altSpelling in extendedCountry.altSpellings") {{ altSpelling }}
          .card-overlay
        .card.ec-sidebar.ec-capital
          b.rmR Capital:
          p.rmR {{ extendedCountry.capital }}
          .card-overlay
        .card.ec-sidebar.ec-timezones
          b.rmR Timezones:
          p.rmR(v-for="timezone in extendedCountry.timezones") {{ timezone }}
          .card-overlay
        .card.ec-sidebar.ec-languages
          b.rmR Languages:
          p.rmR(v-for="language in extendedCountry.languages") {{ language.name }}
          .card-overlay
        .card-last.ec-sidebar.ec-translations
          b.rmR Name in other languages:
          p.rmR Deutch: {{ extendedCountry.translations.de }}
          .card-overlay
        .card-overlay
</template>

<script>
import axios from 'axios';
export default {
  name: 'countries',
  data() {
    return {
      allCountries: [],
      letterFilter: [],
      showActiveFilters: false,
      searchCountry: '',
      showExtendedInfo: false,
      extendedCountry: {
        name: '',
        topLevelDomain: '',
        alpha2Code: '',
        alpha3Code: '',
        callingCodes: '',
        capital: '',
        altSpellings: '',
        region: '',
        subregion: '',
        population: 0,
        latlng: 0,
        demonym: '',
        area: 0,
        gini: 0,
        timezones: '',
        borders: '',
        nativeName: '',
        numericCode: '',
        currencies: [
          {
            code: '',
            name: '',
            symbol: ''
          }
        ],
        languages: [
          {
            iso639_1: '',
            iso639_2: '',
            name: '',
            nativeName: ''
          }
        ],
        translations: {
          de: '',
          es: '',
          fr: '',
          ja: '',
          it: '',
          br: '',
          pt: '',
          nl: '',
          hr: '',
          fa: ''
        },
        flag: '',
        regionalBlocs: [
          {
            acronym: '',
            name: '',
            otherAcronyms: [],
            otherNames: []
          }
        ],
        cioc: ''
      }
    };
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
  head() {
    return {
      title: 'Country Data',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Responsive information about countries'
        }
      ]
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
    },
    extendInformation(country) {
      this.extendedCountry = country;
      this.showExtendedInfo = true;
    },
    collapseExtendedInfo() {
      this.showExtendedInfo = false;
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/style/countries.scss';
@import '@/assets/style/search.scss';
</style>
