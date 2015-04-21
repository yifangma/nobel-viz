
define(function (require) {

  var state = "NOMINEE";
  var jquery = require('jquery');
  var dc = require('dc');
  var d3 = require('d3');
  var crossfilter = require('crossfilter');
  var topojson = require('topojson');
  var bubbleOverlay  = require('bubbleOverlay');
  var globalSettings = require('globalSettings');
  var nomineesSettings = require('nomineesSettings');
  var NomineesCrossfilters = require('nomineesCrossfilters');
  var NomineesCharts = require('nomineesCharts');
  var bootstrap = require('bootstrap');
  
  var width = globalSettings.width(),
      height = globalSettings.height();

  var projection = globalSettings.projection();

  var path = globalSettings.geoPathProjection();

  var svg = globalSettings.svg();

  var g = globalSettings.g();

  var clicked = globalSettings.clicked();

  var bubbleOverlayData = globalSettings.bubbleOverlayData();

  var nomineesCharts = new NomineesCharts();
  var maleOrFemaleChart = nomineesCharts.maleOrFemaleChart();
  var yearOfBirthChart = nomineesCharts.yearOfBirthChart();
  var nominatorYearChart = nomineesCharts.nominatorYearChart();
  var prizeChart = nomineesCharts.prizeChart();
  var worldChart = globalSettings.worldChart();

  d3.json("/data/world-50m.json", function(error, world) {

    g.selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "feature")
        .on("click", clicked);
    g.append("path")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "border border--state")
        .attr("d", path);

    d3.json("/data/nominees.json", function(error, data) {

      d3.json("/data/lats-lons.json", function(error, latsAndLons) {
        
        data = nomineesSettings.validate(data,latsAndLons);

        var nomineesCrossfilters = new NomineesCrossfilters(data,latsAndLons,projection);
        var nominees = nomineesCrossfilters.getNominators();
        var nomineesAll = nomineesCrossfilters.getAll();
        var bubbleOverlayData = nomineesCrossfilters.getBubbleOverlayData();
        globalSettings.setBubbleOverlayData(bubbleOverlayData);
        globalSettings.setState(state);

        var overlay = new bubbleOverlay(worldChart,bubbleOverlayData);
        overlay.render(1,state);

        // count all the facts
        dc.dataCount(".dc-data-count")
            .dimension(nominees)
            .group(nomineesAll)
            .render();

        nomineesCharts.setCrossfilters(nomineesCrossfilters);
        nomineesCharts.render();
      });
    });
  });

  jquery( "#year-of-birth-chart-reset" ).click(function() {
    yearOfBirthChart.filterAll();
    dc.redrawAll();
  });

  jquery( "#nominator-year-chart-reset" ).click(function() {
    nominatorYearChart.filterAll();
    dc.redrawAll();
  });

  jquery( "#male-female-chart-reset" ).click(function() {
    maleOrFemaleChart.filterAll();
    dc.redrawAll();
  });

  jquery( "#prize-chart-reset" ).click(function() {
    prizeChart.filterAll();
    dc.redrawAll();
  });

  jquery( "#reset-all-filters" ).click(function() {
    dc.filterAll();
    dc.redrawAll();
  });

  jquery('#timeline a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  });

  jquery('#facebook-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('http://www.facebook.com/share.php?u='+url+'&title='+title, '_blank');
  });

  jquery('#google-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('https://plus.google.com/share?url='+url, '_blank');
  });

  jquery('#linkedin-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('http://www.linkedin.com/shareArticle?mini=true&url='+url+'&title='+title, '_blank');
  });

  jquery('#pinterest-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('http://pinterest.com/pin/create/bookmarklet/?url='+url+'&is_video=false&description='+title, '_blank');
  });

  jquery('#reddit-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('http://www.reddit.com/submit?url='+url+'&title='+title, '_blank');
  });

  jquery('#twitter-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('http://twitter.com/intent/tweet?status='+title+'+'+url, '_blank');
  });
  
  jquery(function() {
     setTimeout(function(){
      dc.filterAll();
      dc.redrawAll();
     },3000 );
    
  });

});
