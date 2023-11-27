function toggleClass(d3obj, name) {
    d3obj.classed(name, !d3obj.classed(name))
  }
  
  function toggleFocus() {
    e.preventDefault()
    toggleClass(d3.select('#search'), 'hidden');
    toggleClass(d3.select('#submission'), 'hidden');
  }
  
  d3.select('body')
    .on('keydown', e => {
      if (e.code == 'Space' && e.shiftKey)
        toggleFocus();
      if (e.code == "ArrowLeft" || e.code == 'ArrowRight') {
        let list = d3.select('#img_near')
        if (list.empty())
          return;
        e.preventDefault()
        let imgs = list.selectAll('img')
          .filter((d, i) => i == 4 || i == 6)
          .nodes()
        
        if (e.code == "ArrowLeft")
          $(imgs[0]).click()
        else
          $(imgs[1]).click()
      }
      if (e.code == 'Enter' && d3.select('button[name="submitBtn"]')) {
        $('button[name="submitBtn"]').click()
      }
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
    d3.select('#ta-trans')
      .on('keypress', e => {
        if (e.key != 'Enter')
          return;
        e.preventDefault();
        $("#trl_btn").click()
        $("#textQuery").focus();
      })
  
    d3.select('#textQuery-form')
      .selectAll('textarea')
      .on('keypress', e => {
        if (e.key != 'Enter')
          return;
        e.preventDefault();
        $("#search-btn").click()
      })
  });