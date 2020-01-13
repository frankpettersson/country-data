<template lang="pug">
  section.country-container.card
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
          label.rmR.h3(for="search-filter") Filter by search
          input#search-filter(type="text" v-model="value" @keyup="filterBySearch({{ value }})")
          .card-overlay.card-overlay-depth-2
        .filter.card
          h3.rmR Filter by letter
          .country-initial-filter
          .card-overlay.card-overlay-depth-2
      .active-filters.card.hidden
        .card-overlay.card-overlay-depth-2
    section(v-if="errored")
      h2.error Unable to get countries, try again later.
    section(v-else)
      .loading(v-if="loading")
        h2 Loading...
      .country-grid(v-else)
        figure.country(v-for="country in allCountries")
          img(:src="country.flag" :alt="country.name" loading="lazy")
          figcaption.rmR {{ country.name }}
</template>

<script lang="ts">
import json from '../assets/data/countries.json';
import { Country } from '../types/index';
export default {
  name: 'countries',
  data(): Object {
    return {
      allCountries: json,
      elementsToShow: [],
      elementsToHide: [],
      countryInitials: null, //Sorts countryInitials in alphabetical order
      loading: false,
      errored: false,
      textToggle: false
    };
  },
  methods: {
    filterElements(showArray: HTMLElement[], hideArray: HTMLElement[]) {
      hideArray.forEach(e => e.classList.add('hidden'));
      showArray.forEach(e => e.classList.remove('hidden'));
    },
    filterBySearch(searchFilter) {
      searchFilter = searchFilter.toUpperCase();
      this.allCountries.forEach(function(country) {
        const countryEl = <HTMLElement>country;
        const countryName = countryEl?.lastChild?.textContent?.toUpperCase();
        if (countryName?.includes(searchFilter)) {
          if (!this.elementsToShow.includes(countryEl)) {
            this.elementsToShow.push(countryEl);
          }
        } else {
          const countryToRemove = this.elementsToShow.indexOf(countryEl);
          if (this.elementsToShow.includes(countryEl)) {
            this.elementsToShow.splice(countryToRemove, 1);
          }
        }

        if (!countryName?.includes(searchFilter)) {
          if (!this.elementsToHide.includes(countryEl)) {
            this.elementsToHide.push(countryEl);
          }
        } else {
          const countryToRemove = this.elementsToHide.indexOf(countryEl);
          if (this.elementsToHide.includes(countryEl)) {
            this.elementsToHide.splice(countryToRemove, 1);
          }
        }
      });
      this.filterElements(this.elementsToShow, this.elementsToHide);
    }
  },
  async mounted() {
    this.countryInitials = Array.prototype.slice
      .call(this.allCountries)
      .map(letter => letter.lastChild.textContent.substring(0, 1))
      .filter((v, i, a) => a.indexOf(v) === i) //Removes duplicates.
      .sort();
    /*
    /*
    this.createFilterElement(
      [searchFilterLabelEl, searchFilterEl],
      'Filter by search',
      filterContainerEl
    );

    const countryInitialFilterEl = document.createElement('div');
    countryInitialFilterEl.className = 'country-initial-filter';

    const countryInitials = Array.prototype.slice
      .call(allCountries)
      .map(letter => letter.lastChild.textContent.substring(0, 1))
      .filter((v, i, a) => a.indexOf(v) === i) //Removes duplicates.
      .sort(); //Sorts countryInitials in alphabetical order
*/
    /*countryInitials.forEach(function(letter) {
      const letterEl = document.createElement('a');
      letterEl.className = 'filter-by-letter rmR';
      letterEl.setAttribute('role', 'button');
      letterEl.textContent = letter;

      countryInitialFilterEl.appendChild(letterEl);

      letterEl.addEventListener('click', e => {
        const clickedLetter = (e?.target as HTMLElement).textContent;
        if (!activeFiltersArr.includes(letter)) {
          allCountries.forEach(function(country) {
            const countryEl = <HTMLElement>country;
            const countryInitial = countryEl?.lastChild?.textContent?.substring(
              0,
              1
            );
            if (
              countryInitial === clickedLetter ||
              activeFiltersArr.includes(<string>countryInitial)
            ) {
              if (!elementsToShow.includes(countryEl)) {
                elementsToShow.push(countryEl);
              }
              const countryToRemove = elementsToHide.indexOf(countryEl);
              if (elementsToHide.includes(countryEl)) {
                elementsToHide.splice(countryToRemove, 1);
              }
            } else {
              if (!elementsToHide.includes(countryEl)) {
                elementsToHide.push(countryEl);
              }
              const countryToRemove = elementsToShow.indexOf(countryEl);
              if (elementsToShow.includes(countryEl)) {
                elementsToShow.splice(countryToRemove, 1);
              }
            }
          });
          this.filterElements(elementsToShow, elementsToHide);

          const activeFilterEl = document.createElement('a');
          activeFilterEl.className = 'active-filter';
          activeFilterEl.setAttribute('role', 'button');

          const activeFilterTextEl = document.createElement('span');
          activeFilterTextEl.className = 'active-filter-text rmR';
          activeFilterTextEl.textContent = letter;
          activeFilterEl.appendChild(activeFilterTextEl);

          const activeFilterRemoveEl = document.createElement('span');
          activeFilterRemoveEl.className = 'active-filter-remove';
          activeFilterEl.appendChild(activeFilterRemoveEl);

          activeFiltersEl.appendChild(activeFilterEl);

          activeFilterEl.addEventListener('click', e => {
            const clickedLetter = e?.target as HTMLElement;
            allCountries.forEach(function(country) {
              const countryEl = <HTMLElement>country;
              const countryInitial = countryEl?.lastChild?.textContent?.substring(
                0,
                1
              );
              if (countryInitial === clickedLetter.textContent) {
                if (!elementsToHide.includes(clickedLetter)) {
                  elementsToHide.push(countryEl);
                }
                const countryToRemove = elementsToShow.indexOf(countryEl);
                if (elementsToShow.includes(countryEl)) {
                  elementsToShow.splice(countryToRemove, 1);
                }
              }
            });
            this.filterElements(elementsToShow, elementsToHide);
            (e.target as HTMLElement).remove();
            activeFiltersArr = activeFiltersArr.filter(
              filter => filter !== letter
            );
            if (activeFiltersArr.length < 1) {
              elementsToHide = [];
              elementsToShow = [];
              allCountries.forEach(function(country) {
                const countryEl = <HTMLElement>country;
                elementsToShow.push(countryEl);
                countryEl.classList.remove('hidden');
              });
            }
            activeFiltersArr.length > 0
              ? activeFiltersEl.classList.remove('hidden')
              : activeFiltersEl.classList.add('hidden');

            console.log('SHOWN');
            console.log(elementsToShow);
            console.log('HIDDEN');
            console.log(elementsToHide);
          });
          activeFiltersArr.push(letter);
        }
        activeFiltersArr.length > 0
          ? activeFiltersEl.classList.remove('hidden')
          : activeFiltersEl.classList.add('hidden');

        console.log('SHOWN');
        console.log(elementsToShow);
        console.log('HIDDEN');
        console.log(elementsToHide);
      });
    });
    this.createFilterElement(
      countryInitialFilterEl,
      'Filter by letter',
      filterContainerEl
    );

    //Sort Elements
    const sortContainerEl = document.createElement('div');
    this.createContainerElement(sortContainerEl, 'Sort', countryContainerEl);

    //Stats Elements
    const statsContainerEl = document.createElement('div');
    this.createContainerElement(statsContainerEl, 'Stats', countryContainerEl);

    //Append Elements
    //filterContainerEl.appendChild(searchFilterEl);
    //filterContainerEl.appendChild(countryInitialFilterEl);
    filterContainerEl.appendChild(activeFiltersEl);
    countryContainerEl.appendChild(sortContainerEl);
    countryContainerEl.appendChild(filterContainerEl);
    countryContainerEl.appendChild(countryGridEl);
    document?.querySelector('main')?.appendChild(countryContainerEl);
    */
    //.then(response => (this.vinyls = response.data.records))
    //.catch(() => (this.errored = true))
  }
};
</script>

<style lang="scss" scoped>
@import '../style/countries.scss';
</style>
