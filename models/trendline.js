function createTrendLine(data){

    let svg = d3.select("#trendline").append('svg'),
        width = +$('#trendline').width() * 0.9,
        height = +$('#trendline').height();

    svg.attr('width', width + 100)
        .attr('height', height)

    svg = svg.append('g')
        .attr('transform','translate(30,-60)')

    let grouper = {}

    let grouper2 = {}

    let grouper3 = {}

    data.forEach(function(d){

        let year = parseInt(d.date.split('/')[0])
        let month = parseInt(d.date.split('/')[1])
        let date = year * 12 + month

        if(d.type == 'Remote violence'){

            if(grouper[date] != undefined){

                grouper[date] += 1
            }
            else{

                grouper[date] = 1
            }
        }
        else if(d.type == 'Violence against civilians'){

            if(grouper2[date] != undefined){

                grouper2[date] += 1
            }
            else{

                grouper2[date] = 1
            }
        }

        else if(d.type == 'Riots/Protests'){

            if(grouper3[date] != undefined){

                grouper3[date] += 1
            }
            else{

                grouper3[date] = 1
            }
        }

    })

    drawTrendline(grouper3, 320, 'Riots/Protests')

    drawTrendline(grouper, 0, 'Battle-No change of territory')

    drawTrendline(grouper2, 160, 'Strategic development')



    function drawTrendline (grouper, global_y, name){

        let brush = d3.brushX()
            .extent([[0, 0], [width, height/4]])
            .on("end", brushed);

        function brushed(){

           // createGantt(data, focused_persons1)
           // createRank(data, focused_persons1)
        }


        let lineData = []

        let fixed_height = 112

        let container1 = svg.append('g')
            .attr('transform', 'translate(0,' + global_y + ')')

        let xScale = d3.scaleLinear().rangeRound([0, width]);

        let yScale = d3.scaleLinear().rangeRound([height/5, 0]);

        let min_date = d3.min(d3.keys(grouper), function(d) { return (d)});

        let max_date = d3.max(d3.keys(grouper), function(d) { return (d)});

        for(let i = min_date; i<max_date; i++){

            if(grouper[i] != undefined) lineData.push({'key':i,'value':grouper[i]})
            else lineData.push({'key':i,'value':0})
        }

        xScale.domain([min_date, max_date]);

        yScale.domain([d3.min(lineData, function(d) { return parseInt(d.value); }), d3.max(lineData, function(d) { return parseInt(d.value); })]);

        container1.append("rect")
            .attr('x', 0)
            .attr('y', height/4)
            .attr('fill', function(d){return colors(name)})
            .attr('width', width)
            .attr('height', fixed_height)

        container1.append('path')
            .attr('fill', function(d){return d3.color(colors(name)).brighter(0.5)})
            .attr('stroke','white')
            .attr('stroke-width','1')
            .datum(lineData)
            .attr('d',
                d3.area()
                    .curve(d3.curveBasis)
                    .x0(function(d) { return xScale(d.key); })
                    .y0(function(d) { return height/2 - 25; })
                    .x1(function(d) { return xScale(d.key) ; })
                    .y1(function(d) { return height/2 - 25 - yScale(d.value)/1.5; })
            )

        container1.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (height/2-20) + ")")
            .call(d3.axisBottom(xScale).ticks(8).tickFormat(function(d){
                return parseInt(d/12) + '/' + ((d % 12) + 1)
            }));

        container1.append("g")
            .attr("class", "brush")
            .attr('transform','translate(0,' + (height/2 + 85) + ')')
            .call(brush)

        container1.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + 0 + ',' + height/4 + ")")
            .call(d3.axisLeft(yScale).ticks(5));

        container1.append("rect")
            .attr('x', width - 250)
            .attr('y', height/4)
            .attr('fill', '#000')
            .attr('opacity', '0.1')
            .attr('width', 250)
            .attr('height', 20)

        container1.append("rect")
            .attr('x', width - 250)
            .attr('y', (height/4))
            .attr('fill', '#fff')
            .attr('width', 3)
            .attr('height', 20)

        container1.append("text")
            .attr('x', width - 230)
            .attr('y', height/4 + 15)
            .text(name)
            .attr('fill', 'white')

        container1.selectAll('.axis').selectAll('path').remove()
        container1.selectAll('.axis').selectAll('line').remove()

    }

    svg.append('text')
        .attr('x', 0)
        .attr('y', 90)
        .text('TRENDLINE')

    svg.append('line')
        .attr('stroke','black')
        .attr('x1', 85)
        .attr('y1', 85)
        .attr('x2', 95)
        .attr('y2', 85)

    svg.append('text')
        .attr('x', 100)
        .attr('y', 90)
        .text('Date/Heat')
        .attr('font-size', 12)

}