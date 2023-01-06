var viz_ND_v3_1 = function($element,layout,self) {

	var id = senseUtils_ND_v3_1.setupContainer($element,layout,"d3vl_multi_line_v3_1"),
		ext_width = $element.width(),
		ext_height = $element.height(),
		classDim = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle.replace(/\s+/g, '-')
		//classDim_ae = layout.qHyperCube.qDimensionInfo[5].qFallbackTitle.replace(/\s+/g, '-')
		;
		
		
	if (document.getElementById("legend")) {						// to create separate div for legend
				// if it has been created, empty it's contents so we can redraw it
				$("#" + "legend").empty();
			}
	else {
			$element.append($('<div />').attr("id", "legend")
			.width(120)
			// .width(100)
            .height(ext_height - 70)
			.addClass("d3vl_multi_line_v3_1"));
		}
	
	var data = layout.qHyperCube.qDataPages[0].qMatrix;
	
	// console.log($element);
	// console.log(layout);
	//console.log(data);
	var ae1 = []; 									//get the number of adverse events to spread across the y-axis
	for (var i=0; i<data.length; i++) {  
		if(data[i][3].qText !== "-")
			ae1.push(data[i][3].qText+":"+data[i][2].qText); 
	} 
	
	var ae = ae1.filter(function(item, pos) {
					// console.log(item);
					return ae1.indexOf(item) == pos;
					});
	var margin = {top: 20, right: 20, bottom: 30, left: 20},
	    width = ext_width - margin.left - margin.right,
	    height = ext_height - margin.top - margin.bottom;


	//var x = d3.scale.ordinal();
    var x = d3.scale.linear()
		//.range([0,width - 250]);
		.range([0,width - 155]);
		
	var y = d3.scale.linear()
	    .range([height, 25]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
		// .tickSize(-height)
		// .tickPadding(10)	
	//.tickSubdivide(true)
	;
	
	var xAxis1 = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
		// .tickSize(-width)
		// .tickPadding(10)	
	//.tickSubdivide(true)
	;

	var line = d3.svg.line()
	    .interpolate("linear")
	    //.x(function(d) { return x(d.dim(1).qText); })
		.y(function(d) { if (d.measure(1) !== undefined && !isNaN(d.measure(1).qNum)) return y(d.measure(1).qNum); })
		//.defined(function(d) { return y(d.measure(1).qNum); }) // Omit empty values.
		.x(function(d) { if (d.dim(1) !== undefined && !isNaN(d.dim(1).qNum)) return x(d.dim(1).qNum); })
		//.defined(function(d) { return x(d.measure(1).qNum); })
		;
		
		
	var symbol = function(i) {
            // var symbols = ["circle", "diamond", "square",
                           // "triangle-up", "triangle-down", "cross"];
			var symbols = ["circle"];
            return d3.svg.symbol()
                     .size(21)
                     .type(symbols[i % symbols.length]);
        };
		
	var symbol_2 = function(i) {
            // var symbols = ["circle", "diamond", "square",
                           // "triangle-up", "triangle-down", "cross"];
			var symbols = ["triangle-up"];
            return d3.svg.symbol()
                     .size(81)
                     .type(symbols[i % symbols.length]);
        };
	var dims = layout.qHyperCube.qDimensionInfo;
	var meas = layout.qHyperCube.qMeasureInfo;
	var minMaxArray, minMaxArray_y, max_y, min_y;
	 //console.log(dims[6]);
	// console.log(meas);
	if((dims[0].qMin == dims[0].qMax && dims[0].qMin == 0) )
	{
		if(dims[2].qMin == dims[4].qMax )
			minMaxArray = [-1 , 1, dims[2].qMin  ];
		else minMaxArray = [-1 , 1 , dims[4].qMax ];
		
	}else
	if( dims[0].qMin == dims[0].qMax || dims[0].qMin == dims[4].qMax )
	{
		minMaxArray = [dims[0].qMin*0.8, dims[0].qMax*1.2  , dims[4].qMax*1.2 ];
	}
    else 
	{
		minMaxArray = [dims[0].qMin ,dims[0].qMax , dims[4].qMax];
	}
	
	if(isNaN(meas[0].qMin) || (meas[0].qMin == meas[0].qMax && (meas[0].qMin == 0 )))
	{ 
		//console.log("Ymin1"+dims[7].qMin);
		minMaxArray_y = [-1 , 1 , dims[6].qMax, dims[7].qMax];
		if(isNaN(dims[6].qMax) && isNaN(dims[7].qMax))
		{
			max_y = Math.max(-1 , 1 );
			min_y = Math.min(-1 , 1 );
		}else if(isNaN(dims[6].qMax))
		{
			max_y = Math.max(-1 , 1 , dims[7].qMax);
			min_y = Math.min(-1 , 1 , dims[7].qMax);
		}else if(isNaN(dims[7].qMax))
		{
			max_y = Math.max(-1 , 1 , dims[6].qMax);
			min_y = Math.min(-1 , 1 , dims[6].qMax);
		}else 
		{
			max_y = Math.max(-1 , 1 , dims[6].qMax, dims[7].qMax);
			//console.log("Ymin3"+max_y);
			min_y = Math.min(-1 , 1 , dims[6].qMax, dims[7].qMax);
		}
		
	}else
	{
		if(meas[0].qMin == meas[0].qMax )
		{
			if(dims[6].qMax == dims[7].qMax)
			{
				
				minMaxArray_y = [meas[0].qMin*0.8 , meas[0].qMax*1.2 , dims[6].qMax*0.8, dims[6].qMax*1.2];
				if(isNaN(dims[6].qMax))
				{
					max_y = Math.max(meas[0].qMin*0.8 , meas[0].qMax*1.2);
					min_y = Math.min(meas[0].qMin*0.8 , meas[0].qMax*1.2);
				}else 
				{
					max_y = Math.max(meas[0].qMin*0.8 , meas[0].qMax*1.2 , dims[6].qMax*0.8, dims[6].qMax*1.2);
					min_y = Math.min(meas[0].qMin*0.8 , meas[0].qMax*1.2 , dims[6].qMax*0.8, dims[6].qMax*1.2);
				}
				
			}
			else 
			{
				
				minMaxArray_y = [meas[0].qMin*0.8 , meas[0].qMax*1.2 , dims[6].qMax, dims[7].qMax];
				max_y = Math.max(meas[0].qMin*0.8 , meas[0].qMax*1.2 , dims[6].qMax, dims[7].qMax);
				min_y = Math.min(meas[0].qMin*0.8 , meas[0].qMax*1.2 , dims[6].qMax, dims[7].qMax);
			}
		}
		else 
		{
			minMaxArray_y = [meas[0].qMin , meas[0].qMax , dims[6].qMax, dims[7].qMax];
			
			if(isNaN(dims[6].qMax) && isNaN(dims[7].qMax))
			{
				max_y = Math.max(meas[0].qMin , meas[0].qMax );
				//console.log("Ymin3"+meas[0].qMin + meas[0].qMax + dims[6].qMax+ dims[7].qMax);
				min_y = Math.min(meas[0].qMin , meas[0].qMax);
			}else if(isNaN(dims[6].qMax))
			{
				max_y = Math.max(meas[0].qMin , meas[0].qMax , dims[7].qMax);
				//console.log("Ymin3"+meas[0].qMin + meas[0].qMax + dims[6].qMax+ dims[7].qMax);
				min_y = Math.min(meas[0].qMin , meas[0].qMax , dims[7].qMax);
			}else if(isNaN(dims[7].qMax))
			{
				max_y = Math.max(meas[0].qMin , meas[0].qMax , dims[6].qMax);
				//console.log("Ymin3"+meas[0].qMin + meas[0].qMax + dims[6].qMax+ dims[7].qMax);
				min_y = Math.min(meas[0].qMin , meas[0].qMax , dims[6].qMax);
			}else 
			{
				max_y = Math.max(meas[0].qMin , meas[0].qMax , dims[6].qMax, dims[7].qMax);
				//console.log("Ymin3"+meas[0].qMin + meas[0].qMax + dims[6].qMax+ dims[7].qMax);
				min_y = Math.min(meas[0].qMin , meas[0].qMax , dims[6].qMax, dims[7].qMax);
			}
			// max_y = Math.max(meas[0].qMin , meas[0].qMax , dims[6].qMax, dims[7].qMax);
			// console.log("Ymin3"+meas[0].qMin + meas[0].qMax + dims[6].qMax+ dims[7].qMax);
			// min_y = Math.min(meas[0].qMin , meas[0].qMax , dims[6].qMax, dims[7].qMax);
		}
	}
	
		//use the extent of minMaxArray for domain
    x.domain(d3.extent(minMaxArray)).nice();
    y.domain(d3.extent(minMaxArray_y)).nice();
	
	
	var svg = d3.select("#" + id).append("svg")
	    //.attr("width", width -190)
		.attr("width", width -75)
	    .attr("height", height + margin.top + margin.bottom )
		//.attr("height", height + 40)
		.append("g")
		 //.attr("width", width -250)
		 .attr("width", width -100)
		 .attr("height", height + margin.top)
	    // .attr("height", height + margin.top + margin.bottom)
	    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr('transform', 'translate(80,-20)')
		.call(d3.behavior.zoom()
			.x(x)
            .y(y)
			//.scaleExtent([0.5, 10])
			.on("zoom", function () {												//Zoom functionality
				
				svg.select("g.x.axis").call(xAxis);
				svg.select("g.y.axis").call(yAxis);
				
				svg.selectAll(".series").attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
				svg.selectAll(".series_ae").attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
				svg.selectAll(".hirefseries").attr("transform", "translate(0," +d3.event.translate[1]  + ")" + " scale(1," + d3.event.scale + ")");
				svg.selectAll(".lowrefseries").attr("transform", "translate(0," +d3.event.translate[1]  + ")" + " scale(1," + d3.event.scale + ")");
				
				//svg.selectAll(".series").attr("transform", "translate(" + d3.event.translate[0]+",0" + ")" + " scale(" + d3.event.scale + ")")
							
			}));
		
	
	svg.append("rect")												//Added for zoom
      //.attr("width", width - 250)
	  .attr("width", width - 150)
      .attr("height", height + margin.bottom - 5)
	  .attr('transform', 'translate(0,-20)')
	  ;

	var plot = svg.append("svg")
	    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		.classed("objects", true)
		//.attr("width", width - 250)
		.attr("width", width - 150)
		.attr("height", height)
        ;
		
		
	color.domain(data.map(function(d) { return d.dim(10).qText; }));

	var nest = d3.nest()
				.key(function(d) { return d.dim(10).qText})
				.entries(data);
	var nest_ae = d3.nest()
				.key(function(d) { return d.dim(2).qText})
				.entries(data);			
	// console.log(data);
	
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + (height)+ ")")
	      .call(xAxis)
		  .append("text")
	      .attr("y", 45)
		   .attr('x',(width - 190)*0.25)
	      .attr("dy", ".51em")
	      .style("text-anchor", "middle")
		  .attr('fill', 'grey')
			  .attr('stroke', 'none')
			  .style('font-weight','normal')
			  .style('font-size', '10px;')
	      //.text(senseUtils_ND_v3_1.getDimLabel(1,layout) +", "+ senseUtils_ND_v3_1.getDimLabel(2,layout) +", "+ senseUtils_ND_v3_1.getDimLabel(3,layout) );
		   ;

	svg.append("g")
	    .attr("class", "y axis")
		  // .attr("transform", "translate(0," + (-20)+ ")")
		.attr("transform", "translate(0,0)")
	    .call(yAxis)
	    .append("text")
		.attr("transform", "rotate(-90)")
	    .attr("y", -55)
		.attr('x', -(height)/2)
	      //.attr("dy", ".51em")
	    .style("text-anchor", "middle")
		.attr('fill', 'grey')
		.attr('stroke', 'none')
		.style('font-weight','normal')
		.style('font-size', '10px;')
	    .text(senseUtils_ND_v3_1.getMeasureLabel(1,layout));
		  
	var gridseries = plot.selectAll(".gridseries")				//grid lines
	      .data(nest_ae)
	    .enter().append("g")
	      .attr("class", "gridseries");
		
	
		  
	// var hirefseries = plot.selectAll(".hirefseries")			// reference line high and low
	      // .data(nest)
	    // .enter().append("g")
	      // .attr("class", "hirefseries");
		  
	var series = plot.selectAll(".series")				
	      .data(nest)
	    .enter().append("g")
	      .attr("class", "series");
		  
	var series_ae = plot.selectAll(".series_ae")				
	      .data(nest_ae)
	    .enter().append("g")
	      .attr("class", "series_ae");
		  
		  
	
	///////////////////////////////////////////////////////////////////////////////////
	if(layout.gridline)
	{
		gridseries.selectAll("line.horizontalGrid").data(y.ticks(4)).enter()
    .append("line")
        .attr(
        {
            "class":"horizontalGrid",
            "x1" : 0,
            "x2" : width,
            "y1" : function(d){ return y(d);},
            "y2" : function(d){ return y(d);},
            "fill" : "none",
            "shape-rendering" : "crispEdges",
            "stroke" : "lightgrey",
            "stroke-width" : "1px"
        });

		
	}
	
///////////////////////////////////////////////////////////////////////////////////////	
				
		
	  /* Lines to represent the selected test */
		series.append("path")
			.attr("class", "line "+classDim)
			.attr("id", function(d) { return d.key; })
			.attr("d", function(d) { 									
									return line(d.values); 
									 })
			.style("stroke", function(d) { return color(d.key); })
			.attr('stroke-width',2)
			
			;
			
							
	var hiref_var = [];
	var lowref_var = [];
	var labtest_var = [];
	
	/*Show only 1st Dimension data points if user opts for only 2 dimensions and 1 measure*/
	if(nest.length == 0)
	{
		
	}
	else
	{
		if(nest[0].values[0].length == 3)
		{
			nest.forEach(function(dataset) {
			dataset.values = dataset.values.map(function(d,i) {
					return {
							"key":d.dim(2).qText,
							"dx":d.dim(1).qNum,
							"dy":d.measure(1).qNum
							};
					});
			})
			
			nest.forEach(function(data, i) {
				//Individual points
					
				series.selectAll(".point.dataset-" + i)
					.data(data.values)
				  .enter().append("path")
					.attr("class", "point dataset-" + i)
					.attr("fill", function(d) { return color(d.key); })
					//.attr("stroke", color(i))
					.style("stroke", function(d) { return color(d.key); })
					.attr("d", symbol(i))
					.attr("transform", function(d) {
						 //console.log ("Testing for Null Values:"+ d.x + ":"+ d.dy);
						 if(!isNaN(d.dy))					 
						return "translate(" + x(d.dx) + "," + y(d.dy) + ")";
						})
					.append("title").text(function(d) {
						var str = " ";
						str = senseUtils_ND_v3_1.getDimLabel(2,layout)+":\t\t\t"+d.key+"\n"+senseUtils_ND_v3_1.getDimLabel(1,layout)+":\t\t\t"+d.dx+"\n"+ senseUtils_ND_v3_1.getMeasureLabel(1,layout)+":\t\t\t"+d.dy;
						return str;
					});
						
					
			})
					
		} 
		else //if(nest[0].values[0].length == 7)
			{
				
				nest.forEach(function(dataset) {
				
					dataset.values = dataset.values.map(function(d,i) {
						
						if(i>0)
						{  
							hiref_var.push(d.dim(7).qText);
							lowref_var.push(d.dim(8).qText);
							labtest_var.push(d.dim(10).qText);
							return {
								 "key":d.dim(10).qText,     						//Lab Category|Lab Test
								"subject":d.dim(2).qText,     						//USUBJID or SUBJID								
								"dx":d.dim(1).qNum,									//Study Day
								"dy":d.measure(1).qNum,								//Test Result
								"dz":d.dim(3).qNum,									//AE Start Day
								"dt":d.dim(5).qNum,									//AE End Day
								"dx_prev":dataset.values[i-1].dim(1).qNum,
								"dy_prev":dataset.values[i-1].measure(1).qNum,
								"dim4":d.dim(4).qText,								//Adverse Event
								"aetoxgr":d.dim(6).qText,							//AE Toxicity Grade
								"refhi":d.dim(7).qText,								//Lab High
								"reflo":d.dim(8).qText,								// Lab Low
								"aerel":d.dim(9).qText.substring(0,d.dim(9).qText.indexOf("|")),  //AE Causality
								"aerelCombo":d.dim(9).qText.substring(d.dim(9).qText.indexOf("|")+1,d.dim(9).qText.len), //AE Relationship to Combination Therapy
								"labcat":d.dim(10).qText.substring(0,d.dim(10).qText.indexOf("|")),  		//Lab Category
								"labtest":d.dim(10).qText.substring(d.dim(10).qText.indexOf("|")+1,d.dim(10).qText.len) //Lab Test
								
							};
						}else
						{
							hiref_var.push(d.dim(7).qText);
							lowref_var.push(d.dim(8).qText);
							labtest_var.push(d.dim(10).qText);
							return {
								"key":d.dim(10).qText, 								//Lab Category|Lab Test
								"subject":d.dim(2).qText,     						//USUBJID or SUBJID								
								"dx":d.dim(1).qNum,									//Study Day
								"dy":d.measure(1).qNum,								//Test Result
								"dz":d.dim(3).qNum,									//AE Start Day
								"dt":d.dim(5).qNum,									//AE End Day
								"dx_prev":null,
								"dy_prev":null,
								"dim4":d.dim(4).qText,								//Adverse Event
								"aetoxgr":d.dim(6).qText,							//AE Toxicity Grade
								"refhi":d.dim(7).qText,								//Lab High
								"reflo":d.dim(8).qText,								// Lab Low
								"aerel":d.dim(9).qText.substring(0,d.dim(9).qText.indexOf("|")),  //AE Causality
								"aerelCombo":d.dim(9).qText.substring(d.dim(9).qText.indexOf("|")+1,d.dim(9).qText.len), //AE Relationship to Combination Therapy
								"labcat":d.dim(10).qText.substring(0,d.dim(10).qText.indexOf("|")),  		//Lab Category
								"labtest":d.dim(10).qText.substring(d.dim(10).qText.indexOf("|")+1,d.dim(10).qText.len) //Lab Test
								
							};
						}	
					});
				
					for(var k = 1; k<dataset.values.length; k++)
					{	
						if(dataset.values[k].dx === dataset.values[k].dx_prev && dataset.values[k].dy === dataset.values[k].dy_prev)
						{
							dataset.values[k].dx_prev = dataset.values[k-1].dx_prev;
							dataset.values[k].dy_prev = dataset.values[k-1].dy_prev;
							//console.log(dataset.values[k].dx +":"+dataset.values[k].dx_prev);
						}
						  
											
					}
					
					
				})
			hiref_var = hiref_var.filter(function(item, pos) {        //unique ref lab high
					return hiref_var.indexOf(item) == pos;
					});
					
			lowref_var = lowref_var.filter(function(item, pos) {		//unique ref lab low
					return lowref_var.indexOf(item) == pos;
					});
					
			labtest_var = labtest_var.filter(function(item, pos) {		//unique ref lab low
					return labtest_var.indexOf(item) == pos;
					});
			
			var hirefseries = plot.selectAll(".hirefseries")			// reference line high and low
				  .data(hiref_var)
				.enter().append("g")
				  .attr("class", "hirefseries");
		    var lowrefseries = plot.selectAll(".lowrefseries")			// reference line high and low
				  .data(lowref_var)
				.enter().append("g")
				  .attr("class", "lowrefseries");
		  
			hiref_var.forEach(function(d) {
				 
				hirefseries.append('line')								// reference line high
					.attr('x1', function(d,i) { 
						if(!isNaN(d)) 
							//return x(0);
							return 0;
						
					})
					.attr('x2', function(d) {
						if(!isNaN(d)) 
							//return x(width-150);
						return width;
					})
					.attr('y1', function (d) {
							
						if(!isNaN(d)) 
						{
							return y(d);
						}
						
						
					})
					.attr('y2', function (d) {
						
						if(!isNaN(d))
							return y(d);
						  
					})
					.attr('stroke', function (d,i){
						if(!isNaN(d))
							return "green";
						else return "transparent";
					})
					.attr('stroke-width',0.5)
									
					;
					
					hirefseries.append("text")									// reference line high text
						.attr("transform", function(d) { if(!isNaN(d)) return "translate(" + (width-245) + "," + y(d) + ")"; })
						.attr("x", 3)
						.attr("dy", ".85em")
						.text(function(d) { 
							if(!isNaN(d))
								return ("High("+d+")"); 
							else return "";
						
						})
						.attr('fill', 'green')
						.style('font-weight','normal')
						.style('font-size', '8px;')
						;	
			});
			
			lowref_var.forEach(function(d) {
					lowrefseries.append('line')									// reference line low
								.attr('x1', function(d,i) { 
									if(!isNaN(d)) 
										return 0;
									
								})
								.attr('x2', function(d) {
									if(!isNaN(d)) 
										return width;
								})
								.attr('y1', function (d) {
										
									if(!isNaN(d)) 
										return y(d);
									
								})
								.attr('y2', function (d) {
									
									if(!isNaN(d))
										return y(d);
									  
								})
								.attr('stroke', function (d,i){
									if(!isNaN(d))
										return "red";
									else return "transparent";
								})
								.attr('stroke-width',0.5)
								;
								
					lowrefseries.append("text")									// reference line low text
						.attr("transform", function(d) { if(!isNaN(d)) return "translate(" + (width-245) + "," + y(d) + ")"; })
						.attr("x", 3)
						.attr("dy", "-.25em")
						.text(function(d) { 
							if(!isNaN(d))
								return ("Low("+d+")"); 
							else return "";
							
						})
						.attr('fill', 'red')
						//.attr('stroke','red')
						.style('font-weight','normal')
						.style('font-size', '8px;')
					;	
				});	
			
			var ae_var = [];
			nest_ae.forEach(function(dataset) {
					
					dataset.values = dataset.values.map(function(d,i) {
						
						
							if(ae_var.indexOf(d.dim(4).qText+":"+d.dim(3).qNum) < 0)
							{
								ae_var.push(d.dim(4).qText+":"+d.dim(3).qNum);
								return {
								"key":d.dim(2).qText,     							//USUBJID or SUBJID								
								"dz":d.dim(3).qNum,									//AE Start Day
								"dt":d.dim(5).qNum,									//AE End Day
								"dim4":d.dim(4).qText,								//Adverse Event
								"aetoxgr":d.dim(6).qText,							//AE Toxicity Grade
								"aerel":d.dim(9).qText.substring(0,d.dim(9).qText.indexOf("|")),	//AE Causality
								"aerelCombo":d.dim(9).qText.substring(d.dim(9).qText.indexOf("|")+1,d.dim(9).qText.len) //AE Relationship to Combination Therapy
								
								};
							}
							
							
					});
					
					
				})
					
			var line = d3.svg.line()
						.interpolate("linear")
						//.x(function(d) { return x(d.dim(1).qText); })
						//.defined(function(d) { return (typeof d.value !== '-'); })
						.defined(function(d) { if(!isNaN(d.dx) && !isNaN(d.dy)) return !isNaN(y(d.dy)); }) // Omit empty values.
						.defined(function(d) { if(!isNaN(d.dx) && !isNaN(d.dy)) return !isNaN(x(d.dx)); })
						.y(function(d) { if(!isNaN(d.dx) && !isNaN(d.dy) ) return y(d.dy); })
						
						.x(function(d) { if(!isNaN(d.dx) && !isNaN(d.dy) ) {
							return x(d.dx); 
						}})
						;
			
			/* Line datapoints to plot using path for the selected test*/
				nest.forEach(function(dataset, i){
						
					series.selectAll(".point.dataset-" + i)
						.data(dataset.values)
					  .enter().append("path")
						.attr("class", "point dataset-" + i)
						.attr("fill", function(d) { 
									if(!isNaN(d.dy)) 
									{
										return color(d.key);
									}
										
									else return "transparent";
						})
						//.attr("stroke", color(i))
						.style("stroke", function(d) { 
									if(!isNaN(d.dy)) {
										// console.log(d.key+":"+color(d.key));
										return color(d.key);
									}
									else return "transparent";
									})
						.attr("d", symbol(i))
						.attr("transform", function(d) {
							if(!isNaN(d.dy))
								return "translate(" + x(d.dx) +
											  "," + y(d.dy) + ")";
						})
						.append("title").text(function(d) {
							var str = " ";
							str = senseUtils_ND_v3_1.getDimLabel(2,layout)+":\t\t\t"+d.subject+"\n"+senseUtils_ND_v3_1.getDimLabel(1,layout)+":\t\t"+d.dx+"\n"+"Lab Category:\t\t"+d.labcat+"\n"+"Lab Test:\t\t\t"+d.labtest+"\n"+ senseUtils_ND_v3_1.getMeasureLabel(1,layout)+":\t\t"+d.dy;
						
							return str;
							
						});
				
				});
				
				
				
				nest_ae.forEach(function(dataset, i){
					var dist = 0;	
					var dist = -1, dist1 = -1, dist2 = -1, dist3 = -1;
					var dumbBellAE = series_ae.selectAll('.dumbBellAE-' + i).data(dataset.values).enter().append('g').attr('class', 'dumbBellAE' +i);
					
		
		/*Adverse Events Start Day*/
		
					dumbBellAE.append("polygon")													
						.attr("points", function (d) {
							
							if(d !== undefined)
							{
								if(!isNaN(d.dz)){
									dist2 = dist2 + 1; 
									var str = " ";
									var yCor ;	
									
									if (isNaN(meas[0].qMin))
									{
										yCor = y(1- (2)* dist2/ae.length);
										//console.log(dist2/ae.length);
									}else {
										
										if(max_y == min_y )
										{											
											yCor = y(max_y*1.2 - (max_y*1.2-min_y*0.8)* dist2/ae.length) ;
											
										}
										else 
										{											
											var yCor = y(max_y - (max_y-min_y)* dist2/ae.length) ;
										}
									}
										
										str = (x(d.dz) -7 ) + ',' + (yCor - 7) + ',' + x(d.dz) + ',' + (yCor) + ',' + (x(d.dz) - 7) + ',' + (yCor +7);
									return str;
								
								}
							}								
						})
						.attr('fill', function (d){ 
							
							if(d !== undefined)
							{
								if(!isNaN(d.dt) || !isNaN(x(d.dz)) || !isNaN(y(((d.dy - d.dy_prev)* (d.dz - d.dx_prev)/(d.dx - d.dx_prev) ) + d.dy_prev)) )
								{
									if(d.aetoxgr == "1" || d.aetoxgr == "Grade 1")
									{
										return "#969696";
									}else if(d.aetoxgr == "2" || d.aetoxgr == "Grade 2")
									{
										return "gold";
									}else if(d.aetoxgr == "3" || d.aetoxgr == "Grade 3")
									{
										return "#fd8d3c";
									}else if(d.aetoxgr == "4" || d.aetoxgr == "Grade 4")
									{
										return "#8c564b";
									}else if(d.aetoxgr == "5" || d.aetoxgr == "Grade 5")
									{
										return "red";
									}
									return color(d.key);
								}							
								else return "transparent";
							}
						
						})
						.append("title").text(function(d) {
							if(d !== undefined)
							{
								var str = " ";
								if(!isNaN(d.dz) && !isNaN(d.dt))
								{					//If AE start day is not null and AE end day is not null
								
									str = senseUtils_ND_v3_1.getDimLabel(2,layout)+":\t\t\t"+d.key+"\n"+ senseUtils_ND_v3_1.getDimLabel(4,layout)+":\t\t"+d.dim4+"\n"+ senseUtils_ND_v3_1.getDimLabel(3,layout)+":\t\t"+d.dz+"\n"+ senseUtils_ND_v3_1.getDimLabel(5,layout)+":\t\t"+d.dt+"\n"+ "REL-Study:\t\t"+d.aerel+"\n"+ "REL-Combo:\t\t"+d.aerelCombo; 
									return str;
								}else if(!isNaN(d.dz) && isNaN(d.dt))
								{					//If AE start day is not null and AE end day is null
								
									str = senseUtils_ND_v3_1.getDimLabel(2,layout)+":\t\t\t"+d.key+"\n"+ senseUtils_ND_v3_1.getDimLabel(4,layout)+":\t\t"+d.dim4+"\n"+ senseUtils_ND_v3_1.getDimLabel(3,layout)+":\t\t"+d.dz+"\n"+ senseUtils_ND_v3_1.getDimLabel(5,layout)+":\t\tOngoing"+"\n"+ "REL-Study:\t\t"+d.aerel+"\n"+ "REL-Combo:\t\t"+d.aerelCombo; 
									return str;
								}
								return str;
							}
							
							
						})
						;
	/*Adverse Events End Day*/					
					dumbBellAE.append("polygon")													//To represent End Day triangles AE 
						.attr("points", function (d) {
							if(d !== undefined)
							{
								if(!isNaN(d.dz))
								{
									dist3 = dist3 + 1; 
									if(!isNaN(d.dt))
									{
										
										var str = " ";
										var yCor ;	
										if (isNaN(meas[0].qMin))
										{
											//yCor = y(1.2 - (1.2-0.8)* dist3/ae.length);
											yCor = y(1- (2)* dist3/ae.length);
											//console.log(dist3/ae.length);
										}else {
											
											if(max_y == min_y )
											{
												
												yCor = y(max_y*1.2 - (max_y*1.2-min_y*0.8)* dist3/ae.length) ;
											}
											else 
											{
												
												yCor = y(max_y - (max_y-min_y)* dist3/ae.length) ;
											}
										}		
										str = (x(d.dt) +7 ) + ',' + (yCor - 7) + ',' + x(d.dt) + ',' + (yCor) + ',' + (x(d.dt) + 7) + ',' + (yCor +7);
										return str;
									
									}	
								}
							}						
								
						})
						.attr('fill', function (d){ 
							if(d !== undefined)
							{
								if(!isNaN(d.dt) )
								{
									if(d.aetoxgr == "1" || d.aetoxgr == "Grade 1")
									{
										return "#969696";
									}else if(d.aetoxgr == "2" || d.aetoxgr == "Grade 2")
									{
										return "gold";
									}else if(d.aetoxgr == "3" || d.aetoxgr == "Grade 3")
									{
										return "#fd8d3c";
									}else if(d.aetoxgr == "4" || d.aetoxgr == "Grade 4")
									{
										return "#8c564b";
									}else if(d.aetoxgr == "5" || d.aetoxgr == "Grade 5")
									{
										return "red";
									}
									return color(d.key);
								}							
								else return "transparent";
							}
							
						})
						.append("title").text(function(d) {
							if(d !== undefined)
							{
								var str = " ";
								if(!isNaN(d.dt))
								{					//If AE start day is not null and AE end day is not null
								
									str = senseUtils_ND_v3_1.getDimLabel(2,layout)+":\t\t\t"+d.key+"\n"+ senseUtils_ND_v3_1.getDimLabel(4,layout)+":\t\t"+d.dim4+"\n"+ senseUtils_ND_v3_1.getDimLabel(3,layout)+":\t\t"+d.dz+"\n"+ senseUtils_ND_v3_1.getDimLabel(5,layout)+":\t\t"+d.dt+"\n"+ "REL-Study:\t\t"+d.aerel+"\n"+ "REL-Combo:\t\t"+d.aerelCombo;
									return str;
								}
								return str;
							}
														
						})
						;
			/* Line to represent AE start day and AE end day when both are not null*/
					dumbBellAE.append('line')
						.attr('x1', function(d,i) { 
							if(d !== undefined)
							{
								if(!isNaN(d.dz)) return x(d.dz);
							}						
							
						})
						.attr('x2', function(d) {
							if(d !== undefined)
							{
								if(!isNaN(d.dt)) return x(d.dt);
							}
							
						})
						.attr('y1', function (d) {
									
							if(d !== undefined)
							{
								if(!isNaN(d.dz))
								{
									dist++; 
									if (isNaN(meas[0].qMin))
									{
										
										return y(1 - (2)* dist/ae.length);
									}else {
										
										if(max_y == min_y)
										{
											//console.log((max_y*1.2 - (max_y*1.2 -min_y*0.8)* dist/ae.length));
											return y(max_y*1.2 - (max_y*1.2 -min_y*0.8)* dist/ae.length);
										}
										else 
										{
											//console.log((max_y ));
											return y(max_y - (max_y-min_y)* dist/ae.length);
										}
									}
								}
							}		
							
								
						})
						.attr('y2', function (d) {
							
							if(d !== undefined)
							{
								if(!isNaN(d.dz)) 
								{
									dist1++; 
									if (isNaN(meas[0].qMin))
									{
										
										//return y(1.2 - (1.2 - 0.8)* dist1/ae.length);
										return y(1 - (2)* dist1/ae.length);
									}else {
										
										if(max_y == min_y)
									{
										return y(max_y*1.2 - (max_y*1.2 -min_y*0.8)* dist1/ae.length);
									}
									else 
									{
										return y(max_y - (max_y-min_y)* dist1/ae.length);
									}
									}	
									
								}
							}							  
							  
						})
						.attr('stroke', function (d,i){
							if(d !== undefined)
							{
								if(!isNaN(d.dz) && !isNaN(d.dt))
								{
									if(d.aetoxgr == "1" || d.aetoxgr == "Grade 1")
									{
										return "#969696";
									}else if(d.aetoxgr == "2" || d.aetoxgr == "Grade 2")
									{
										return "gold";
									}else if(d.aetoxgr == "3" || d.aetoxgr == "Grade 3")
									{
										return "#fd8d3c";
									}else if(d.aetoxgr == "4" || d.aetoxgr == "Grade 4")
									{
										return "#8c564b";
									}else if(d.aetoxgr == "5" || d.aetoxgr == "Grade 5")
									{
										return "red";
									}
									return color(d.key);
									
								}							
								 else return "transparent";
								
							}
							
							
						})
						.attr('stroke-width',function (d,i){
							if(d !== undefined)
							{
								return 2;
							}
						})
						.append("title").text(function(d) {
							if(d !== undefined)
							{
								var yof = "";
								var str = "";
								var str = " ";
								if(!isNaN(d.dz) && !isNaN(d.dt))
								{					//If AE start day is not null and AE end day is not null
								
								str = senseUtils_ND_v3_1.getDimLabel(2,layout)+":\t\t\t"+d.key+"\n"+ senseUtils_ND_v3_1.getDimLabel(4,layout)+":\t\t"+d.dim4+"\n"+ senseUtils_ND_v3_1.getDimLabel(3,layout)+":\t\t"+d.dz+"\n"+ senseUtils_ND_v3_1.getDimLabel(5,layout)+":\t\t"+d.dt+"\n"+ "REL-Study:\t\t"+d.aerel+"\n"+ "REL-Combo:\t\t"+d.aerelCombo; 
									return str;
								}
								return str;
							
							}							
							
						})					
						;
					})
					
			  
		}
	
	

/* Legend  for AE TOXICITY GRADES*/
var legendLabels = [];
var legendLabels1 = [];
				legendLabels.push("AETOX Grade");
				legendLabels.push("Grade 1");
				legendLabels.push("Grade 2");
				legendLabels.push("Grade 3");
				legendLabels.push("Grade 4");
				legendLabels.push("Grade 5");
				legendLabels.push(" ");
				legendLabels.push(" Lab Test");
				
				legendLabels1.push("Grade 1");
				legendLabels1.push("Grade 2");
				legendLabels1.push("Grade 3");
				legendLabels1.push("Grade 4");
				legendLabels1.push("Grade 5");
				legendLabels1.push(" ");
				legendLabels1.push(" Lab Test");
	//legendLabels1 = legendLabels;
for (a = 0 ; a<labtest_var.length;a++)														//Add the unique lab tests
	{
		
		legendLabels.push(labtest_var[a].substring(labtest_var[a].indexOf("|")+1,labtest_var[a].len));		
		legendLabels1.push(labtest_var[a]);
	}
    //console.log(legendLabels1);
 	var legend_height =ext_height/4;
 
 var svg2 = d3.select("#legend")
    .append("svg")
    //.attr("width", 200)
	.attr("width", 100)
    .attr("height", 18*legendLabels.length);
	//.attr("height", ext_height-350);
        
 var legend = svg2.append("g")
                  .attr("class", "legend1")
                  .attr('transform', 'translate(-10,50)');   
				  
	legend.selectAll("polygon").data(legendLabels)
		.enter()
		.append("polygon")													
		.attr("points", function (d,i) {
											
			var str = " ";
			if (i<5)
			{
				var xOffset = 6;
			var xCor = 20;
			//var yCor = (i-1.5) *  20;
			var yCor = (i-1.6) *  15;
			var yOffset = 7;
						  
			
				str = (xCor ) + ',' + (yCor - 6) + ',' + (xCor + xOffset) + ',' + (yCor) + ',' + (xCor ) + ',' + (yCor + 8);
				return str;
			}
			
			
		})
		.attr('fill', function (d,i){ 
			if(i === 0) return "#969696";
			if(i === 1) return "gold";
			if(i === 2) return "#fd8d3c";
			if(i === 3) return "#8c564b";
			if(i === 4) return "red";
		 return "none";
		})
		;

legend.selectAll('text')
		.data(legendLabels)
		.enter()
		.append("text")
		.attr("x", 30)
		//.attr("width", 25)
		//.attr("height", 5)
		//.attr("height",0.5)
		.attr("y", function(d, i){ return (i-2) * 15 ;})
		//.attr("y", function(d, i){ return (i-1.5) *  legend_height/8;})
		
		.attr('dy', '-.35em')
		.text(function(d) {
			var labtest_trunc = d.substring(d.indexOf("|")+1,d.len);
			if (labtest_trunc.length > 11)
				labtest_trunc = labtest_trunc.substring(0,11)+'...';
			else 
				labtest_trunc = labtest_trunc;
			return labtest_trunc;
					// return d;
		})
		.attr('fill', 'grey')
		.style('font-weight','normal')
		.style('font-size', '10px;')
		.append("title").text(function(d) {return d; })		
		;
		
	legend.selectAll('circle')
  .data(legendLabels1)
  .enter()
  .append("circle")
  .attr("cx", 25)
  .attr("cy", function(d, i){
				// if (i > 6)
				return (i-1.6) *  15;
	  })
  // .attr("width", 5)
  // .attr("height", 5)
  .attr('r', 3)
  .style("fill", function(d,i) { 
	if (i > 6)
   	return color(d);
	else 
	return "transparent";
  })
  .append("title").text(function(d) {return d; })
	;
  
  legend.selectAll('line')
		.data(legendLabels1)
		.enter()
		.append("line")
		.attr('x1', 20)
		.attr('x2', 30)
		.attr('y1',function(d, i){ return (i-1.6) *  15;})
		.attr('y2',function(d, i){ return (i-1.6) *  15;})
		.attr('stroke', function (d,i){
			if (i > 6)
			return color(d);
		})
		.attr('stroke-width',2)
		.append("title").text(function(d) {return d; })
		;	
	}
	
	/////////////////////////////////////////////////////////////////////////////
	/* Legend below the X-axis*/
	var x_axis_legendLabels = [];
		x_axis_legendLabels.push(senseUtils_ND_v3_1.getDimLabel(1,layout));
		x_axis_legendLabels.push(senseUtils_ND_v3_1.getDimLabel(3,layout));
		x_axis_legendLabels.push(senseUtils_ND_v3_1.getDimLabel(5,layout));
		
	//console.log(x_axis_legendLabels);
		
	var x_axis_legend = svg.selectAll('.x_axis_legend')											//Dynamic Labels
		.data(x_axis_legendLabels).enter()
			.append('g')
				.attr('class', 'x_axis_legend')
				.attr('transform', 'translate(' + -(width/2 - 30) +','+(height*2/3 - margin.top)+')'); //low resolution
				//.attr('transform', 'translate(' + -(width/2 - 30) +','+(height*2/3 - margin.top)+')'); //high resolution
				

	
	x_axis_legend.append("polygon")													 
		.attr("points", function (d,i) {											
			var str = " ";
			//console.log(d.length);
			/////
			var yCor = height/3 + margin.bottom + margin.top + 5
				var offset = 120;
				var rightOffset = 20;
				var xOffset = 6;
				var yStartEndOffset = 6;
				var yRectOffset = 4;
				var yHighLowOffset = 5;
				//var triangle_x = width*2/3 + ((i) * 150) + d.length + ((width*2/3 + ((i + 1) * 150) - x_axis_legendLabels[2].length) - width*2/3 + ((i) * 150) - 2*d.length)/2;
			/////
			
						  
			
			if(i == 1){
				var triangle_x = width*2/3 + ((i+1) * 150) - 8*d.length ;
			////
				str = (triangle_x) + ',' + (yCor - yStartEndOffset) + ',' + (triangle_x + xOffset) + ',' + (yCor) + ',' + (triangle_x) + ',' + (yCor + yStartEndOffset);
				return str;
			}
			if(i == 2){
				var triangle_x = width*2/3 + ((i+1) * 150) - 8*d.length ;
				str = (triangle_x) + ',' + (yCor - yStartEndOffset) + ',' + (triangle_x - xOffset) + ',' + (yCor) + ',' + (triangle_x) + ',' + (yCor + yStartEndOffset);
				return str;
			}
			
		})
		.attr('fill', function (d,i){ 
			if(i === 1 || i === 2) return "#1f77b4";;
			
		 return "transparent";
		})
		;
		
	x_axis_legend.append('circle')									//To represent Test day
		.attr('cx', function(d, i) { 
			if(i == 0){
					
					 return width*2/3 + ((i) * 150) + d.length + ((width*2/3 + ((i + 1) * 150) - x_axis_legendLabels[1].length) - width*2/3 + ((i) * 150) - 2*d.length)/2;
				}
			
		})
		.attr('cy', function(d,i){
			if(i == 0)
				return (height/3 + margin.bottom + margin.top + 5);
			
		})
		.attr('r', function(d,i){
			if(i == 0)
				return 3;
			
		})
		.attr('fill', function(d,i) {
			if(i == 0) return "#1f77b4";
		});
	x_axis_legend.append('text')										//Text for legend
		.attr('x', function(d, i) { 
			
			/////
			if(i == 0) return width*2/3 + ((i) * 150) - d.length;
			if(i == 1) return width*2/3 + ((i) * 150)- d.length;
			if(i == 2) return width*2/3 + ((i) * 150)- d.length;
			
		})
		.attr('y', function(d){
			return (height/3 + margin.bottom + margin.top);
		})
		.attr('dy', '.85em')
		.attr('fill', 'grey')
		.style('font-weight','normal')
		.style('font-size', '10px;')
		.style('text-anchor', 'middle')
		.text(function (d,i) { 
			if(i === 1 || i == 0 || i == 2) //|| i == 3 || i == 4 || i == 5)
				return d; 
			else return null;
		});
	
	
	

}
