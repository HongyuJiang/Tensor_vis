let colors = d3.scaleOrdinal(d3.schemeSet2)

d3.csv('./data/Algeria_conflict_sim.csv')
    .then(function(records) {

        $("#dataName").on("change", function(value) {

            d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            d3.select('#components_number').text('2')
            d3.select('#nodes_number').text('127')
            d3.select('#layer_number').text('10')
            d3.select('#time_range').text('10Y')
            d3.select('#time_range_detail').text(' 1996/9 - 2016/9')

            createNetwork(records)
            createTrendLine(records)

        });

    })