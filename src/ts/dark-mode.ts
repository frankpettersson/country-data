;(async function(d) {
  if (window.matchMedia('(prefers-color-scheme: dark)').media === 'not all') {
    document.documentElement.style.display = 'none'
    document.head.insertAdjacentHTML(
      'beforeend',
      '<link rel="stylesheet" href="style/light.css" onload="document.documentElement.style.display = \'\'">'
    )
  }
})(document)
