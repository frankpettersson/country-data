export const countries = async function(d: HTMLDocument) {
  d.documentElement.style.display = 'none';
  d.head.insertAdjacentHTML(
    'beforeend',
    '<link rel="stylesheet" href="style/countries.css" onload="document.documentElement.style.display = \'\'">'
  );

  async function getData(url: string) {
    const response = await fetch(url);
    return await response.json();
  }

  function createOverlayEl(element: HTMLElement, overlayDepth: string) {
    const overlayEl = d.createElement('div');
    overlayEl.className = 'card-overlay ' + overlayDepth;
    element.appendChild(overlayEl);
  }

  function createContainerElement(
    element: HTMLElement,
    name: string,
    insertInto: HTMLElement
  ) {
    element.classList.add('item-container');

    const headerEl = d.createElement('h2');
    headerEl.className = 'rmR';
    headerEl.textContent = name;
    element.appendChild(headerEl);

    const itemGridEl = d.createElement('div');
    itemGridEl.className = 'item-grid';
    element.appendChild(itemGridEl);

    if (insertInto) insertInto.appendChild(element);
  }

  function createFilterElement(
    element: HTMLElement | HTMLElement[],
    name: string,
    insertInto: HTMLElement
  ) {
    const filterWrapper = d.createElement('div');
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
      const headerEl = d.createElement('h3');
      headerEl.className = 'rmR';
      headerEl.textContent = name;
      filterWrapper.appendChild(headerEl);
      filterWrapper.appendChild(element);
    }

    createOverlayEl(filterWrapper, 'card-overlay-depth-2');
    insertInto?.lastChild?.appendChild(filterWrapper);
  }

  function filterElements(showArray: HTMLElement[], hideArray: HTMLElement[]) {
    hideArray.forEach(e => e.classList.add('hidden'));
    showArray.forEach(e => e.classList.remove('hidden'));
  }

  try {
    const data = await getData('assets/data/countries.json');

    const countryContainerEl = d.createElement('section');
    countryContainerEl.className = 'country-container card';
    createOverlayEl(countryContainerEl, 'card-overlay-depth-1');

    const countryGridEl = d.createElement('div');
    countryGridEl.className = 'country-grid';

    //Country Elements
    interface JsonCountryData {
      name: string;
      flag: string;
    }

    data.forEach(function(country: JsonCountryData) {
      const { name, flag } = country;

      const countryEl = d.createElement('figure');
      countryEl.className = 'country';

      const countryImage = d.createElement('img');
      countryImage.src = flag;
      countryImage.alt = name;
      countryImage.setAttribute('loading', 'lazy');
      countryEl.appendChild(countryImage);

      const countryName = d.createElement('figcaption');
      countryName.className = 'rmR';
      countryName.textContent = name;
      countryEl.appendChild(countryName);

      countryGridEl.appendChild(countryEl);
    });

    //Filter Elements
    const filterContainerEl = d.createElement('div');
    createContainerElement(filterContainerEl, 'Filter', countryContainerEl);

    const activeFiltersEl = d.createElement('div');
    activeFiltersEl.className = 'active-filters card hidden';
    createOverlayEl(activeFiltersEl, 'card-overlay-depth-2');

    const allCountries: NodeList = countryGridEl.childNodes;
    let activeFiltersArr: string[];
    let elementsToShow: HTMLElement[];
    let elementsToHide: HTMLElement[];

    const searchFilterEl = d.createElement('input');
    searchFilterEl.id = 'search-filter';
    searchFilterEl.type = 'text';

    const searchFilterLabelEl = d.createElement('label');
    searchFilterLabelEl.setAttribute('for', 'search-filter');
    searchFilterLabelEl.className = 'rmR h3';

    searchFilterEl.addEventListener('keyup', function() {
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
      filterElements(elementsToShow, elementsToHide);
      console.log(elementsToShow, elementsToHide);
    });
    createFilterElement(
      [searchFilterLabelEl, searchFilterEl],
      'Filter by search',
      filterContainerEl
    );

    const countryInitialFilterEl = d.createElement('div');
    countryInitialFilterEl.className = 'country-initial-filter';

    const countryInitials = Array.prototype.slice
      .call(allCountries)
      .map(letter => letter.lastChild.textContent.substring(0, 1))
      .filter((v, i, a) => a.indexOf(v) === i) //Removes duplicates.
      .sort(); //Sorts countryInitials in alphabetical order

    countryInitials.forEach(letter => {
      const letterEl = d.createElement('a');
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
          filterElements(elementsToShow, elementsToHide);

          const activeFilterEl = d.createElement('a');
          activeFilterEl.className = 'active-filter';
          activeFilterEl.setAttribute('role', 'button');

          const activeFilterTextEl = d.createElement('span');
          activeFilterTextEl.className = 'active-filter-text rmR';
          activeFilterTextEl.textContent = letter;
          activeFilterEl.appendChild(activeFilterTextEl);

          const activeFilterRemoveEl = d.createElement('span');
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
            filterElements(elementsToShow, elementsToHide);
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
    createFilterElement(
      countryInitialFilterEl,
      'Filter by letter',
      filterContainerEl
    );

    //Sort Elements
    const sortContainerEl = d.createElement('div');
    createContainerElement(sortContainerEl, 'Sort', countryContainerEl);

    //Stats Elements
    const statsContainerEl = d.createElement('div');
    createContainerElement(statsContainerEl, 'Stats', countryContainerEl);

    //Append Elements
    //filterContainerEl.appendChild(searchFilterEl);
    //filterContainerEl.appendChild(countryInitialFilterEl);
    filterContainerEl.appendChild(activeFiltersEl);
    countryContainerEl.appendChild(sortContainerEl);
    countryContainerEl.appendChild(filterContainerEl);
    countryContainerEl.appendChild(countryGridEl);
    d?.querySelector('main')?.appendChild(countryContainerEl);
  } catch (error) {
    console.error(error);
  }
};
