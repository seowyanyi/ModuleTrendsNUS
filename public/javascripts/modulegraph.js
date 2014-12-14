var width = 960,
    height = 900,
    color = d3.scale.category20(); //random color palette maybe?


d3.json("/javascripts/data/abp1415-min.json", function(error, json) {

	if (error) return console.warn(error);

	var nodesData = _.each(json, function(item) {
		item.radius = item["AveragePoints"]/50;
    item.fontsize = 5 + item.radius/5;
  })

  // the physics
    var force = d3.layout.force()
    			.gravity(0.05)
    			.charge(function(d, i) { return i ? 0 : -2000; })
    			.nodes(nodesData)
    			.size([width, height]);

    force.start();

    var svgContainer = d3.select("body").append("svg")
    				.attr("width", width)
    				.attr("height", height);

    var circle = svgContainer.append("g")
    			.attr("class", "nodes")
    			.selectAll(".circle")
    				.data(nodesData)
    			.enter().append("circle")
   					.attr("r", function(d) {return d.radius;})
   					.style("fill", function(d, i) { return color(i % 20);});
   	
   	var text = svgContainer.append("g")
   				.attr("class", "labels")
   			.selectAll("text")
   				.data(nodesData)
   			.enter().append("text")
		   		.attr("text-anchor", "middle")
		  		.attr("font-family", "sans-serif")
		  		.attr("font-size", function(d) {return d.fontsize;})
		  		.attr("fill", "black")
		  		.text(function(d) {return d.ModuleCode;});


  

  //what occurs in every step of the animation
  force.on("tick", function() {
    var q = d3.geom.quadtree(nodesData), //q is a quadtree factory
        i = 0, 
        n = nodesData.length; //number of nodes

    while (++i < n)
    	q.visit(collide(nodesData[i])); //visit each node in quad tree

    circle.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    text.attr("x", function(d) {return d.x;})
    	.attr("y", function(d) {return d.y;});

  });


  //Collision detection function.
  //without it, nodes would overlap
  function collide(node) {  
    var r = node.radius + 25, //add buffer distance for collision
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;

    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y), //distance between two points
            r = node.radius + quad.point.radius;
        if (l < r) {
          l = (l - r) / l * .5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y; //move nodes apart
        }
      }
      //if return true, children not visited
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1; 
    };
  }

});                   



