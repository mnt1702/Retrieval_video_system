function toggleClass(d3obj, name) {
  d3obj.classed(name, !d3obj.classed(name))
}

d3.select('body')
  .on('keydown', e => {
    if (e.code != 'Tab')
      return;
    e.preventDefault();
    toggleClass(d3.select('#search'), 'hidden');
    toggleClass(d3.select('#submission'), 'hidden');
  })
  .on('wheel', e => {
    if (!e.shiftKey)
      return;
    let v = +getComputedStyle(document.documentElement).getPropertyValue('--list-columns')
    let d = e.deltaY > 0 ? 1 : -1
    v += d
    if (v < 1)
      v = 1
    if (v > 12)
      v = 12
    document.documentElement.style.setProperty('--list-columns', v);
  })