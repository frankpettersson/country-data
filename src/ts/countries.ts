;(async function(d) {
  d.documentElement.style.display = 'none'
  d.head.insertAdjacentHTML(
    'beforeend',
    '<link rel="stylesheet" href="style/countries.css" onload="document.documentElement.style.display = \'\'">'
  )

  async function getData(url) {
    const response = await fetch(url)
    return await response.json()
  }

  function createOverlayEl(element, overlayDepth) {
    const overlayEl = d.createElement('div')
    overlayEl.className = 'card-overlay ' + overlayDepth
    element.appendChild(overlayEl, element)
  }

  function createContainerElement(element, name, insertInto) {
    element.classList.add('item-container')

    const headerEl = d.createElement('h2')
    headerEl.className = 'rmR'
    headerEl.textContent = name
    element.appendChild(headerEl)

    const itemGridEl = d.createElement('div')
    itemGridEl.className = 'item-grid'
    element.appendChild(itemGridEl)

    if (insertInto) insertInto.appendChild(element)
  }

  function createFilterElement(element, name, insertInto) {
    const filterWrapper = d.createElement('div')
    filterWrapper.className = 'filter card'

    if (Array.isArray(element)) {
      element.forEach(function(e) {
        console.log(e.tagName)
        if (e.tagName === 'LABEL') {
          e.textContent = name
        }
        filterWrapper.appendChild(e)
      })
    } else {
      const headerEl = d.createElement('h3')
      headerEl.className = 'rmR'
      headerEl.textContent = name
      filterWrapper.appendChild(headerEl)
      filterWrapper.appendChild(element)
    }

    createOverlayEl(filterWrapper, 'card-overlay-depth-2')
    if (insertInto) insertInto.lastChild.appendChild(filterWrapper)
  }

  function filterElements(showArray, hideArray) {
    hideArray.forEach(e => e.classList.add('hidden'))
    showArray.forEach(e => e.classList.remove('hidden'))
  }

  try {
    const data = await getData('assets/data/countries.json')

    const countryContainerEl = d.createElement('section')
    countryContainerEl.className = 'country-container card'
    createOverlayEl(countryContainerEl, 'card-overlay-depth-1')

    const countryGridEl = d.createElement('div')
    countryGridEl.className = 'country-grid'

    //Country Elements
    data.forEach(country => {
      const { name, flag } = country

      const countryEl = d.createElement('figure')
      countryEl.className = 'country'

      const countryImage = d.createElement('img')
      countryImage.src = flag
      countryImage.alt = name
      countryImage.loading = 'lazy'
      countryEl.appendChild(countryImage)

      const countryName = d.createElement('figcaption')
      countryName.className = 'rmR'
      countryName.textContent = name
      countryEl.appendChild(countryName)

      countryGridEl.appendChild(countryEl)
    })

    //Filter Elements
    const filterContainerEl = d.createElement('div')
    createContainerElement(filterContainerEl, 'Filter', countryContainerEl)

    const activeFiltersEl = d.createElement('div')
    activeFiltersEl.className = 'active-filters card hidden'
    createOverlayEl(activeFiltersEl, 'card-overlay-depth-2')

    const allCountries = countryGridEl.childNodes
    let activeFiltersArr = []
    let elementsToShow = []
    let elementsToHide = []

    const searchFilterEl = d.createElement('input')
    searchFilterEl.id = 'search-filter'
    searchFilterEl.type = 'text'

    const searchFilterLabelEl = d.createElement('label')
    searchFilterLabelEl.setAttribute('for', 'search-filter')
    searchFilterLabelEl.className = 'rmR h3'

    searchFilterEl.addEventListener('keyup', function() {
      let searchFilter = searchFilterEl.value.toUpperCase()
      allCountries.forEach(function(country) {
        const countryName = country.lastChild.textContent.toUpperCase()
        if (countryName.includes(searchFilter)) {
          if (!elementsToShow.includes(country)) {
            elementsToShow.push(country)
          }
        } else {
          const countryToRemove = elementsToShow.indexOf(country)
          if (elementsToShow.includes(country)) {
            elementsToShow.splice(countryToRemove, 1)
          }
        }

        if (!countryName.includes(searchFilter)) {
          if (!elementsToHide.includes(country)) {
            elementsToHide.push(country)
          }
        } else {
          const countryToRemove = elementsToHide.indexOf(country)
          if (elementsToHide.includes(country)) {
            elementsToHide.splice(countryToRemove, 1)
          }
        }
      })
      filterElements(elementsToShow, elementsToHide)
      console.log(elementsToShow, elementsToHide)
    })
    createFilterElement(
      [searchFilterLabelEl, searchFilterEl],
      'Filter by search',
      filterContainerEl
    )

    const countryInitialFilterEl = d.createElement('div')
    countryInitialFilterEl.className = 'country-initial-filter'

    const countryInitials = Array.prototype.slice
      .call(allCountries)
      .map(letter => letter.lastChild.textContent.substring(0, 1))
      .filter((v, i, a) => a.indexOf(v) === i) //Removes duplicates.
      .sort() //Sorts countryInitials in alphabetical order

    countryInitials.forEach(letter => {
      const letterEl = d.createElement('a')
      letterEl.className = 'filter-by-letter rmR'
      letterEl.setAttribute('role', 'button')
      letterEl.textContent = letter

      countryInitialFilterEl.appendChild(letterEl)

      letterEl.addEventListener('click', e => {
        const clickedLetter = e.target.textContent
        if (!activeFiltersArr.includes(letter)) {
          allCountries.forEach(function(country) {
            const countryInitial = country.lastChild.textContent.substring(0, 1)
            if (
              countryInitial === clickedLetter ||
              activeFiltersArr.includes(countryInitial)
            ) {
              if (!elementsToShow.includes(country)) {
                elementsToShow.push(country)
              }
              const countryToRemove = elementsToHide.indexOf(country)
              if (elementsToHide.includes(country)) {
                elementsToHide.splice(countryToRemove, 1)
              }
            } else {
              if (!elementsToHide.includes(country)) {
                elementsToHide.push(country)
              }
              const countryToRemove = elementsToShow.indexOf(country)
              if (elementsToShow.includes(country)) {
                elementsToShow.splice(countryToRemove, 1)
              }
            }
          })
          filterElements(elementsToShow, elementsToHide)

          const activeFilterEl = d.createElement('a')
          activeFilterEl.className = 'active-filter'
          activeFilterEl.setAttribute('role', 'button')

          const activeFilterTextEl = d.createElement('span')
          activeFilterTextEl.className = 'active-filter-text rmR'
          activeFilterTextEl.textContent = letter
          activeFilterEl.appendChild(activeFilterTextEl)

          const activeFilterRemoveEl = d.createElement('span')
          activeFilterRemoveEl.className = 'active-filter-remove'
          activeFilterEl.appendChild(activeFilterRemoveEl)

          activeFiltersEl.appendChild(activeFilterEl)

          activeFilterEl.addEventListener('click', e => {
            const clickedLetter = e.target.textContent
            allCountries.forEach(function(country) {
              const countryInitial = country.lastChild.textContent.substring(
                0,
                1
              )
              if (countryInitial === clickedLetter) {
                if (!elementsToHide.includes(clickedLetter)) {
                  elementsToHide.push(country)
                }
                const countryToRemove = elementsToShow.indexOf(country)
                if (elementsToShow.includes(country)) {
                  elementsToShow.splice(countryToRemove, 1)
                }
              }
            })
            filterElements(elementsToShow, elementsToHide)
            e.target.remove()
            activeFiltersArr = activeFiltersArr.filter(
              filter => filter !== letter
            )
            if (activeFiltersArr.length < 1) {
              elementsToHide = []
              elementsToShow = []
              allCountries.forEach(function(country) {
                elementsToShow.push(country)
                country.classList.remove('hidden')
              })
            }
            activeFiltersArr.length > 0
              ? activeFiltersEl.classList.remove('hidden')
              : activeFiltersEl.classList.add('hidden')

            console.log('SHOWN')
            console.log(elementsToShow)
            console.log('HIDDEN')
            console.log(elementsToHide)
          })
          activeFiltersArr.push(letter)
        }
        activeFiltersArr.length > 0
          ? activeFiltersEl.classList.remove('hidden')
          : activeFiltersEl.classList.add('hidden')

        console.log('SHOWN')
        console.log(elementsToShow)
        console.log('HIDDEN')
        console.log(elementsToHide)
      })
    })
    createFilterElement(
      countryInitialFilterEl,
      'Filter by letter',
      filterContainerEl
    )

    //Sort Elements
    const sortContainerEl = d.createElement('div')
    createContainerElement(sortContainerEl, 'Sort', countryContainerEl)

    //Stats Elements
    const statsContainerEl = d.createElement('div')
    createContainerElement(statsContainerEl, 'Stats', countryContainerEl)

    //Append Elements
    //filterContainerEl.appendChild(searchFilterEl);
    //filterContainerEl.appendChild(countryInitialFilterEl);
    filterContainerEl.appendChild(activeFiltersEl)
    countryContainerEl.appendChild(sortContainerEl)
    countryContainerEl.appendChild(filterContainerEl)
    countryContainerEl.appendChild(countryGridEl)
    d.querySelector('main').appendChild(countryContainerEl)
  } catch (error) {
    console.error(error)
  }
})(document)
