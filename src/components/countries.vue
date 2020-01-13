<template lang="pug">
  section.countr-container.card
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
          input#search-filter(type="text")
          .card-overlay.card-overlay-depth-2
        .filter.card
          h3.rmR Filter by letter
          .country-initial-filter
      .active-filters.card.hidden
        .card-overlay.card-overlay-depth-2
    section(v-if="errored")
      h2.error Unable to get countries, try again later.
    section(v-else)
      .loading(v-if="loading")
        h2 Loading...
      .country-grid(v-else)
        figure.country(v-for="country in allCountries" v-if="!vinyl.fields.Såld")
          img(:src="country.flag" :alt="country.name" loading="lazy")
          figcaption.rmR {{ country.name }}
</template>

<script lang="ts">
import json from '../assets/data/countries.json';
export default {
  name: 'countries',
  data() {
    return {
      allCountries: json,
      elementsToShow: [],
      elementsToHide: [],
      countryInitials: Array.prototype.slice
        .call(this.allCountries)
        .map(letter => letter.lastChild.textContent.substring(0, 1))
        .filter((v, i, a) => a.indexOf(v) === i) //Removes duplicates.
        .sort(), //Sorts countryInitials in alphabetical order
      loading: true,
      errored: false,
      textToggle: false
    };
  },
  methods: {
    createOverlayEl(element: HTMLElement, overlayDepth: string) {
      const overlayEl = document.createElement('div');
      overlayEl.className = 'card-overlay ' + overlayDepth;
      element.appendChild(overlayEl);
    },
    createContainerElement(
      element: HTMLElement,
      name: string,
      insertInto: HTMLElement
    ) {
      element.classList.add('item-container');

      const headerEl = document.createElement('h2');
      headerEl.className = 'rmR';
      headerEl.textContent = name;
      element.appendChild(headerEl);

      const itemGridEl = document.createElement('div');
      itemGridEl.className = 'item-grid';
      element.appendChild(itemGridEl);

      if (insertInto) insertInto.appendChild(element);
    },
    createFilterElement(
      element: HTMLElement | HTMLElement[],
      name: string,
      insertInto: HTMLElement
    ) {
      const filterWrapper = document.createElement('div');
      filterWrapper.className = 'filter card';

      if (Array.isArray(element)) {
        element.forEach(function(e) {
          console.log(e.tagName);
          if (e.tagName === 'LABEL') {
            e.textContent = name;
          }
          filterWrapper.appendChild(e);
        });
      } else {
        const headerEl = document.createElement('h3');
        headerEl.className = 'rmR';
        headerEl.textContent = name;
        filterWrapper.appendChild(headerEl);
        filterWrapper.appendChild(element);
      }

      this.createOverlayEl(filterWrapper, 'card-overlay-depth-2');
      insertInto?.lastChild?.appendChild(filterWrapper);
    },
    filterElements(showArray: HTMLElement[], hideArray: HTMLElement[]) {
      hideArray.forEach(e => e.classList.add('hidden'));
      showArray.forEach(e => e.classList.remove('hidden'));
    },
    filterBySearch(searchValue: string) {
      let searchFilter = searchValue.toUpperCase();
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
          if (!this.this.elementsToHide.includes(countryEl)) {
            this.this.elementsToHide.push(countryEl);
          }
        } else {
          const countryToRemove = this.elementsToHide.indexOf(countryEl);
          if (this.this.elementsToHide.includes(countryEl)) {
            this.this.elementsToHide.splice(countryToRemove, 1);
          }
        }
      });
      this.filterElements(this.elementsToShow, this.this.elementsToHide);
    }
  },
  async mounted() {
    const countryContainerEl = document.createElement('section');
    countryContainerEl.className = 'country-container card';
    this.createOverlayEl(countryContainerEl, 'card-overlay-depth-1');

    const countryGridEl = document.createElement('div');
    countryGridEl.className = 'country-grid';

    //Country Elements
    interface JsonCountryData {
      name: string;
      flag: string;
    }

    this.allCountries.forEach(function(country: JsonCountryData) {
      const { name, flag } = country;

      const countryEl = document.createElement('figure');
      countryEl.className = 'country';

      const countryImage = document.createElement('img');
      countryImage.src = flag;
      countryImage.alt = name;
      countryImage.setAttribute('loading', 'lazy');
      countryEl.appendChild(countryImage);

      const countryName = document.createElement('figcaption');
      countryName.className = 'rmR';
      countryName.textContent = name;
      countryEl.appendChild(countryName);

      countryGridEl.appendChild(countryEl);
    });

    //Filter Elements
    const filterContainerEl = document.createElement('div');
    this.createContainerElement(
      filterContainerEl,
      'Filter',
      countryContainerEl
    );

    const activeFiltersEl = document.createElement('div');
    activeFiltersEl.className = 'active-filters card hidden';
    this.createOverlayEl(activeFiltersEl, 'card-overlay-depth-2');

    const allCountries: NodeList = countryGridEl.childNodes;
    let activeFiltersArr: string[];
    let elementsToShow: HTMLElement[];
    let elementsToHide: HTMLElement[];

    const searchFilterEl = document.createElement('input');
    searchFilterEl.id = 'search-filter';
    searchFilterEl.type = 'text';

    const searchFilterLabelEl = document.createElement('label');
    searchFilterLabelEl.setAttribute('for', 'search-filter');
    searchFilterLabelEl.className = 'rmR h3';

    searchFilterEl.addEventListener('keyup', () => {
      let searchFilter = searchFilterEl.value.toUpperCase();
      allCountries.forEach(function(country) {
        const countryEl = <HTMLElement>country;
        const countryName = countryEl?.lastChild?.textContent?.toUpperCase();
        if (countryName?.includes(searchFilter)) {
          if (!elementsToShow.includes(countryEl)) {
            elementsToShow.push(countryEl);
          }
        } else {
          const countryToRemove = elementsToShow.indexOf(countryEl);
          if (elementsToShow.includes(countryEl)) {
            elementsToShow.splice(countryToRemove, 1);
          }
        }

        if (!countryName?.includes(searchFilter)) {
          if (!elementsToHide.includes(countryEl)) {
            elementsToHide.push(countryEl);
          }
        } else {
          const countryToRemove = elementsToHide.indexOf(countryEl);
          if (elementsToHide.includes(countryEl)) {
            elementsToHide.splice(countryToRemove, 1);
          }
        }
      });
      this.filterElements(elementsToShow, elementsToHide);
    });
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

    countryInitials.forEach(function(letter) {
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
    //.then(response => (this.vinyls = response.data.records))
    //.catch(() => (this.errored = true))
    //.finally(() => (this.loading = false));
  }
};
</script>

<style lang="scss">
@import '../scss/countries.scss';
</style>
