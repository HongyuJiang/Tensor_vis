function createMatrix2(data){

    let svg = d3.select("#matrix").select('svg');

    let focused_persons = {
        'Military Forces of Algeria (1999-)':1,
        'Protesters (International)':2,
        'MSJI: Saharan Sons for Islamic Justice Movement':3,
        'Rioters':4,
        'Military Forces of Morocco (1999-)':5,
        'Unidentified Armed Group (Libya)':6,

    }

    let tooltip = d3.selectAll(".tooltip")

    let colors = d3.scaleOrdinal(d3.schemeSet2)

    let g = svg.append('g').attr('transform',"translate(0,320)")

    let mat_data = {}

    let mat_data2 = {}

    let z_factor = 0.4

    let min_year = 1999;

    let max_year = 1;

    let pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    data.forEach(function(d){

        if(focused_persons[d.source] != undefined && focused_persons[d.target] != undefined){

            let year = parseInt(d.date.split('/')[0])

            if(min_year > year) min_year = year;
            if(max_year < year) max_year = year;

            let month = parseInt(d.date.split('/')[1])

            let type = d.type

            if(mat_data[year] != undefined){

                if(mat_data[year][month] != undefined){

                    if(mat_data[year][month][type] != undefined){

                        mat_data[year][month][type] += 1
                    }
                    else{

                        mat_data[year][month][type] = 1
                    }
                }
                else{

                    mat_data[year][month] = {}
                    mat_data[year][month][type] = 1
                }
            }
            else{

                mat_data[year] = {}
                mat_data[year][month] = {}
                mat_data[year][month][type] = 1
            }
        }

    })

    for(let year = min_year; year < max_year; year++){

        for(let month = 0; month < 12; month++){

            if(mat_data[year] != undefined){

                if(mat_data[year][month] != undefined){

                    let meta_data = []

                    let sum = 0;

                    for(head in mat_data[year][month]){

                        let key = head;
                        let value = mat_data[year][month][head]
                        meta_data.push({'key':key, 'value':value})
                        sum += value
                    }

                    let x = (year - min_year) * 16  + 8

                    let y =parseInt(month) * 16 + 8

                    let arc = g.append("g")
                        .attr('transform', function(d){
                            return  'translate(' + x
                                + ','
                                + y
                                + ')'
                        })

                    let path = d3.arc()
                        .outerRadius(sum*1.2)
                        .innerRadius(0);

                    arc.selectAll(".arc")
                        .data(pie(meta_data))
                        .enter()
                        .append("path")
                        .attr("d", path)
                        .attr("fill", function(d) {
                            return colors(d.data.key)
                        })
                        .attr('opacity', 0.7)
                        .attr("stroke", 'white')
                        .attr("stroke-width",0.5)
                        .on("mouseover", function (d) {
                            tooltip.transition()
                                .duration(200)
                                .style("opacity", .9);

                            tooltip.html('Key: ' + d.data.key + '<br>' + 'Value: ' + d.value)
                                .style("left", (d3.event.pageX + 15) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                        })
                        .on("mouseout", function (d) {
                            tooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                }
            }

        }
    }

    for(let year = min_year; year < max_year; year++){

        for(let month = 0; month < 12; month++){

            let value = -1

            let value2 = -1

            if(mat_data[year] != undefined){

                if(mat_data[year][month] != undefined){

                    value = mat_data[year][month] * 2

                }
            }

            if(mat_data2[year] != undefined){

                if(mat_data2[year][month] != undefined){

                    value2 = mat_data2[year][month] * 2

                }
            }

            if(value < 0 && value2 < 0){

                g.append('rect')
                    .attr('x', function(d){
                        return parseInt(year - min_year) * 16
                    })
                    .attr('y', function(d){
                        return parseInt(month) * 16
                    })
                    .attr('fill', function(d){
                        return '#999'
                    })
                    .attr('opacity', function(d){
                        return 0.3
                    })
                    .attr('width', function(d){
                        if(value < 0) return 15
                        return value / z_factor
                    })
                    .attr('height', function(d) {
                        if(value < 0) return 15
                        return value / z_factor
                    })


            }

        }
    }

    let month_label_text = []

    for(let i = 1;i<13;i++){

        month_label_text.push(i)
    }


    g.append('g')
        .selectAll('.month_label')
        .data(month_label_text)
        .enter()
        .append('text')
        .attr('y', function(d, i){

            return i * 16 + 10
        })
        .attr('x', -30)
        .attr('font-size', 12)
        .text(function(d){
            return d
        })

    let year_label_text = []

    for(let i = min_year;i<max_year;i++){

        year_label_text.push(i)
    }

    g.append('g')
        .selectAll('.year_label')
        .data(year_label_text)
        .enter()
        .append('g')
        .attr('transform', function(d, i){

            let x = i * 16
            let y = 13 * 16

            return 'translate(' + x + ',' + y + ')'
        })
        .append('text')
        .attr('transform','rotate(45)')
        .attr('font-size','11')
        .text(function(d){
            return d
        })

    g.append('rect')
        .attr('width',5)
        .attr('height', 16 * 12)
        .attr('x', -0)
        .attr('y', 0)
        .attr('fill','black')

    g.append('text')
        .attr('x', 25)
        .attr('y', -20)
        .text('Year / Month')
        .attr('font-size', 12)

    g.append('rect')
        .attr('x', 20)
        .attr('y', -30)
        .attr('width', 30)
        .attr('height', 15)
        .attr('opacity',0.1)

    g.append('rect')
        .attr('x', 55)
        .attr('y', -30)
        .attr('width', 40)
        .attr('height', 15)
        .attr('opacity',0.1)

}