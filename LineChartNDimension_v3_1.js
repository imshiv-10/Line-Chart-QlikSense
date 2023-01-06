define(["jquery", "./js/d3.min", "./js/senseD3utils", "./js/senseUtils_ND_v3_1"],
	function($) {
		'use strict';

		//Use requirejs toUrl to get the URL.
		//Load external CSS instead of inlining to work in desktop/server/mashups
		$("<link/>", {
			rel: "stylesheet",
			type: "text/css",
			href: require.toUrl( "extensions/LineChartNDimension_v3_1/LineChartNDimension_v3_1.css")
		}).appendTo("head");

		//var lastUsedChart = -1;
		return {
			initialProperties: {
				version: 1.0,
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						// qWidth: 5,
						// qHeight: 2000
						qWidth: 11,
						qHeight: 909
					}]
				}
			},
			// definition: {
				// type: "items",
				// component: "accordion",
				// items: {
					// dimensions: {
						// uses: "dimensions",
						// min: 0
					// },
					// measures: {
						// uses: "measures",
						// min: 0,
						// max: 1
					// },
					// sorting: {
						// uses: "sorting"
					// },
					// addons: {  
						 // uses: "addons",  
						 // items: {  
							  // dataHandling: {  
								   // uses: "dataHandling"  
							  // }  
						 // }  
					// },
					// settings: {
						// uses: "settings",
						// items: {
							// ChartDropDown: {
								// type: "string",
								// component: "dropdown",
								// label: "Chart",
								// ref: "chart",
								// options: content_options,
								// defaultValue: 1
							// },
							// ResponsiveCheckbox: {
								// type: "boolean",
								// component: "switch",
								// label: "Responsive",
								// ref: "responsive",
								// options: responsive_options,
								// defaultValue: true
							// }
						// }
					// }
				// }
			// },
			definition: {
				type: "items",
				component: "accordion",
				items: {
					dimensions: {
						uses: "dimensions",
						min: 10,
						max: 10
					},
					measures: {
						uses: "measures",
						min: 1,
						max: 1
					},
					sorting: {
						uses: "sorting"
					},
					addons: {  
						 uses: "addons",  
						 items: {  
							  dataHandling: {  
								   uses: "dataHandling"  
							  }  
						 }  
					},
					settings: {
						uses: "settings" ,
						items: {
							// ChartDropDown: {
								// type: "string",
								// component: "dropdown",
								// label: "Chart",
								// ref: "chart",
								// options: content_options,
								// defaultValue: 1
							// },
							GridLinesCheckbox: {
								type: "boolean",
								component: "switch",
								label: "GridLines",
								ref: "gridline",
								options: gridline_options,
								defaultValue: false
							}
						}
					}
				}
			},
			snapshot: {
				canTakeSnapshot: true
			},
			paint: function($element, layout) {
				var self = this;
				
				// Responsive: change between multi-dim bar chart types
				/*if(typeof layout.responsive == 'undefined'){
					layout.responsive = true;
				}
				if(layout.responsive){
					if((layout.chart == 2) || (layout.chart == 3) || (layout.chart == 4)) {
						var w = $element.width();

						if(w <= 640){
							layout.chart = 4;
						}else if(w <= 1024){
							layout.chart = 3;
						}else{
							layout.chart = 2;
						}
					}
				}*/

				senseUtils_ND_v3_1.extendLayout(layout, self);
				var dim_count = layout.qHyperCube.qDimensionInfo.length;
				var measure_count = layout.qHyperCube.qMeasureInfo.length;
				// console.log("dimcount:"+dim_count);
				// console.log("Meacount:"+measure_count);
				// console.log(layout.qHyperCube.qDataPages[0].qMatrix[1].length);
				
				if(dim_count < 4 || measure_count < 1)
				{
					$element.html("This chart requires 4 dimensions and 1 measure");
				}
				var src = "multi_series_line_chart_v3_1.js";
				var url =require.toUrl( "extensions/LineChartNDimension_v3_1/library/" + src);

						// Load in the appropriate script and viz
						jQuery.getScript(url, function() {
							viz_ND_v3_1($element, layout, self);
							//lastUsedChart = layout.chart;
						});
				
				// if ((dim_count < charts.filter(function(d) {
						// return d.id === layout.chart
					// })[0].min_dims || dim_count > charts.filter(function(d) {
						// return d.id === layout.chart
					// })[0].max_dims) || measure_count < charts.filter(function(d) {
						// return d.id === layout.chart
					// })[0].measures) {
					// $element.html("This chart requires " + charts.filter(function(d) {
						// return d.id === layout.chart
					// })[0].min_dims + " dimensions and " + charts.filter(function(d) {
						// return d.id === layout.chart
					// })[0].measures + " measures.");
				// } else {
					// $element.html("");

					// if (layout.chart != lastUsedChart) {
						// // Determine URL based on chart selection
						// var src = charts.filter(function(d) {
							// return d.id === layout.chart
						// })[0].src;

						// var url =require.toUrl( "extensions/LineChartNDimension_v3_1/library/" + src);

						// // Load in the appropriate script and viz
						// jQuery.getScript(url, function() {
							// viz_ND_v3_1($element, layout, self);
							// lastUsedChart = layout.chart;
						// });


					// } else {
						// viz_ND_v3_1($element, layout, self);
					// }

				// }

			},
			resize:function($el,layout){
				this.paint($el,layout);
			}
		};

	});


// Helper functions
// function getLabelWidth(axis, svg) {
	// // Create a temporary yAxis to get the width needed for labels and add to the margin
	// svg.append("g")
		// .attr("class", "y axis temp")
		// .attr("transform", "translate(0," + 0 + ")")
		// .call(axis);

	// // Get the temp axis max label width
	// var label_width = d3.max(svg.selectAll(".y.axis.temp text")[0], function(d) {
		// return d.clientWidth
	// });

	// // Remove the temp axis
	// svg.selectAll(".y.axis.temp").remove();

	// return label_width;
// }
var gridline_options = [
	{
		value: false,
		label: "No"
	}, {
		value: true,
		label: "Yes"
	}];