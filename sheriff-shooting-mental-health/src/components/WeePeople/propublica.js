var width = 720,
        height = 720,
        margin = {
            left: 10,
            top: 10,
            right:10,
            bottom: 10
        };

     var chart = d3.select('#one')
    var svg = chart.append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 750 750")
        .attr("transform", function() {
            return "translate(0,-40)";
          })
    var alphabet = "abcdefghijklmnopqrsuvwxyzABCDEFGHIJKLMNOPQRSUVWXYZ".split("");
    var totalDots = 40
    var blankData = d3.range(totalDots).map(function(i){
      var theta = 2 * Math.PI * i * (Math.sqrt(5) - 1) / 2,
      r = Math.sqrt(i) * 6.5;
      return {
        x: width / 2 + r * Math.cos(theta) + Math.random() * 10 +5 ,
        y: height / 2 + r * Math.sin(theta) + Math.random() * 10 +5,
        idx: i,
        r:6
      };
    });

    chart.append("p").attr("class","instruction").html("(Each <span class='weepeople'>n</span> represents about 1,000 jobs)")


    //  var totaljobs = d3.sum(originalData.map(function (d) {
    //   return +d.Promised;
    // }));

    var simulation = d3
        .forceSimulation()
        .force("collide", d3.forceCollide().strength(0.1)
        .radius(function (d) {
          return d.r
        }));

    var quadtree = d3.quadtree()
      .x(function (d) {return d.x})
      .y(function (d) {return d.y})
      .addAll(blankData);

    function update(data,forceStrength,stepNumber){
      var points = svg.selectAll(".point")
        .data(data, function(d) { return d.idx; });

      var newPoints = points.enter().append("g")
        .classed("point", true)
        .style("opacity", 1)


      // newPoints.append("circle")
      //   .attr("r", 3)
      //   .attr("class", "circle");

      newPoints.append("text")
      .attr("class","weepeople").text(function(d) {
        var letter = d3.shuffle(alphabet)[0];
        return letter
      })

      var merged = newPoints.merge(points);
        merged.attr("transform", function(d) {
          return "translate(" + width/2 + "," + height/2 + ")";
        })

        simulation
          .force("cx", d3.forceX().x(function (d) {
            return width/2
          }).strength(forceStrength))
          .force("cy", d3.forceY().y(function (d) {
            return height/2
          }).strength(forceStrength))

          .nodes(data).alpha(1).restart().stop();

      if (stepNumber == 1) {

        requestAnimationFrame(tickThreeTimes);

      }

      function tickThreeTimes() {
          simulation.tick();
          simulation.tick();
          simulation.tick();
          simulation.tick();
          simulation.tick();
          simulation.tick();

          merged.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });
          if (simulation.alpha() > 0.001) {
            requestAnimationFrame(tickThreeTimes);
          }
        }

      var transitions = 0;

      points.exit().style("opacity", 1).transition()
      .duration(500).style("opacity", 0.2)
      .on( "start", function() {
        transitions++;
        }).on( "end", function() {
          if( --transitions === 0 ) {
            callbackWhenAllIsDone();
          }
        })
        .remove();

      function callbackWhenAllIsDone() {
          requestAnimationFrame(tickThreeTimes);
      }






    }

    update(blankData,0.001,1);