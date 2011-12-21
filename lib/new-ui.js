$(function() {
  
  var renderTimeline = function() {
    var width  = $(window).width(),
        height = $(window).height() - 154,
        rows,
        cols;
        
    if (width > 256*3) {
      cols = 4;
    } else if (width <= 256*3 && width > 256*2) {
      cols = 3;
    } else {
      cols = 2;
    }
    
    rows = 12 / cols;  
    var rowHeight = parseInt((1.0*height) / rows);
    if (rowHeight < 120) rowHeight = 120;
    var boxsize = parseInt((1.0*width)/cols) - 12/cols - 12;
    
    $('#timeline > div').width(boxsize).height(rowHeight);
  }
  
  var populateYears = function(years) {
    var $years = $('#years');
    $years.html('');
    years.map(function(year) {
      var shortYear = year.substr(2);
      var yearString = '<a href="#' + year +'" id="year-' + year + '">' + shortYear + '</a> ';
      $('#years').append(yearString);
    });
    client.getYear(years[0], updateMonthView);
  }
  
  $('#years a').live('click', function() {
    var year = $(this).attr('href').substr(1);
    client.getYear(year, updateMonthView);
  });
  
  var updateMonthView = function(yearData) {
    $('#timeline .month').hide();
    $('#years a').removeClass('selected');
    $('#year-' + yearData.year).addClass('selected');
    $('#year-selector h1').text(yearData.year);
    yearData.months.forEach(function(month) {
      var selector = '#month-' + month.month;
      $(selector).show().attr('data-dates', JSON.stringify(month.dates))
                        .attr('data-key', JSON.stringify({ year: yearData.year, month: month.month }));
    });
    renderTimeline();
  }
  
  $('#timeline > div').click(function() {
    var w = $(this).width(),
        h = $(this).height();
    $('#timeline > div').width(w/1.4).height(w/1.4);
    $(this).width(w*2).height(h*2);
  });
  
  _.debounce(renderTimeline, 50);
  client.getYears(populateYears);
  
  $(window).resize(renderTimeline);
  
});