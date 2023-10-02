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

addEventListener("DOMContentLoaded", evt => {
  // console.log(evt)
  d3.select('#ta-trans')
    .on('keypress', e => {
      if (e.key != 'Enter')
        return;
      e.preventDefault();
      $("#trl-btn").click()
    })

  d3.select('#query-form')
    .selectAll('textarea')
    .on('keypress', e => {
      if (e.key != 'Enter')
        return;
      e.preventDefault();
      $("#query-btn").click()
    })
});