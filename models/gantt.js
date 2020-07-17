function createGantt(data,focused_persons){

    d3.select("#gantt").selectAll('*').remove()

    let svg = d3.select("#gantt").append('svg'),
        width = +$('#gantt').width() + 100,
        height = +$('#gantt').height();

    svg.attr('width', width)
        .attr('height', height)

    let tooltip = d3.selectAll(".tooltip")

    let gantt_data = []

    let source_target_group = {}

    let day_grouper = {}

    let source_target_day_grouper = []

    let source_counter = {}

    let target_counter = {}

    let width_factor = 3

    let vertical_gap = 33

    let year_dict = {}

    let tot_max = 0

    let min_date = 10000

    let max_date = 0;

    data.forEach(function(d){

        let year = parseInt(d.date.split('/')[0])

        year_dict[year] = 1

        let month = parseInt(d.date.split('/')[1])

        d.time = (year - 1996) * 12 + parseInt(month)

        if(min_date > d.time) min_date = d.time

        if(max_date <  d.time) max_date = d.time

        if(focused_persons[d.source] != undefined && focused_persons[d.target] != undefined){

            gantt_data.push(d)

            if(day_grouper[d.time] != undefined) day_grouper[d.time] += 1
            else day_grouper[d.time] = 1

            if(source_target_group[d.source + '&' + d.target] != undefined){

                source_target_group[d.source + '&' + d.target] += 1
            }
            else source_target_group[d.source + '&' + d.target] = 1

            if(source_target_day_grouper[d.time + '&' + d.source + '&' + d.target + '&' + d.type] != undefined)
                source_target_day_grouper[d.time + '&' + d.source + '&' + d.target + '&' + d.type] += 1
            else source_target_day_grouper[d.time + '&' + d.source + '&' + d.target + '&' + d.type] = 1

            if(source_counter[d.source] != undefined) source_counter[d.source] += 1
            else source_counter[d.source] = 1

            if(target_counter[d.target] != undefined) target_counter[d.target] += 1
            else target_counter[d.target] = 1
        }

    })

    for(head in source_counter){

        if(source_counter[head] > tot_max) tot_max = source_counter[head]
    }

    let horizon_gap = (max_date - min_date) /47

    let defs = svg.append("defs")

    let marker = defs.append("marker")
        .attr('id','arrow')
        .attr('viewBox','0 -5 10 10')
        .attr('refX','2.5')
        .attr('refY','0')
        .attr('markerWidth','3')
        .attr('markerHeight','3')
        .attr('orient','auto')

    marker.append("path")
        .attr("d", "M0,-2.5L5,0L0,2.5")
        .attr('opacity', 0.9)
        .attr('stroke', '#333')
        .attr('fill', '#333')
        .attr("class","arrowHead");

    svg = svg.append('g')
        .attr('transform','translate(0,50)')

    let container = svg.append('g')
        .attr('transform','translate(' + (min_date) + ',0)')

    let linearGradient = defs.append("linearGradient")
        .attr("id", "vertical-gradient");

    //Horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    //Set the color for the start (0%)
    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#00D49D"); //light blue

    //Set the color for the end (100%)
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#0BB4C1"); //dark blue

    let source_target_day_array = []

    for(head in source_target_day_grouper){

        let argments = head.split('&')

        let date = argments[0]

        let source = argments[1]

        let target = argments[2]

        let type = argments[3]

        source_target_day_array.push({'source':source,'target':target,'date':date, 'type':type, 'weight':source_target_day_grouper[head]})
    }

    let gantt_max = 0

    source_target_day_array.forEach(function(d){

        if(d.weight > gantt_max) gantt_max = d.weight
    })

    let gantt_container = container
        .selectAll('.gantt')
        .data(source_target_day_array)
        .enter()
        .append('g')
        .on("mouseover", function (d) {

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html('Source: ' + d.source + '<br><span> Target: ' + d.target + '</span>' + '<br><span> Value: ' + d.weight + '</span>')
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })

    gantt_container
        .append('path')
        .attr('stroke', function(d){
            return colors(d.type)
        })
        .attr('opacity', function(d){

            return 0.7
        })
        .attr('stroke-width', function(d){

            return (d.weight) / tot_max * 100
        })
        .attr('marker-end','url(#arrow)')
        .datum(function(d){

            let base = (d.date) * horizon_gap

            let delta = (focused_persons[d.source] - focused_persons[d.target]) * 3

            let p1 = {'x':base + delta,'y': focused_persons[d.source] * vertical_gap}

            let p2 = {'x':base + delta ,'y':(focused_persons[d.source] + focused_persons[d.target])/2 * vertical_gap}

            if(delta > 0)
                p2.x += 10
            else p2.x -= 10

            let p3 = {'x':base + delta,'y': focused_persons[d.target] * vertical_gap}

            return [p1,p2,p3]
        })
        .attr('fill','none')
        .attr('stroke-opacity','1')
        .attr("d", function(d){

            let drawer = d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return (d.x); })
                .y(function(d) { return (d.y); })

            return drawer([d[0], d[0], d[2]])
        })

    gantt_container.selectAll('path')
        .transition()
        .delay(500)
        .duration(1000)
        .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return (d.x); })
            .y(function(d) { return (d.y); })
        );

    let header = svg.append('g')
        .selectAll('.gantt_header')
        .data(d3.keys(focused_persons))
        .enter()
        .append('g')
        .attr('transform', function(d,i){

            return 'translate(' + 1400 + ',' + (i * vertical_gap + vertical_gap) + ')'
        })

    header.append('text')
        .attr('font-size','11')
        .attr('y', 3)
        .text(function(d){
            return d
        })

    header.append('rect')
        .attr('width',10)
        .attr('height',function(d){
            return source_counter[d] / tot_max * 25
        })
        .attr('x',-1330)
        .attr('y',0)
        .attr('fill','steelblue')

    header.append('rect')
        .attr('width',10)
        .attr('height',function(d){
            return target_counter[d]  / tot_max * 25
        })
        .attr('x',-1200)
        .attr('y',0)
        .attr('fill','#0BB4C1')

    svg.append('g')
        .selectAll('.gap_line')
        .data(d3.keys(focused_persons))
        .enter()
        .append('line')
        .attr('x1', 200)
        .attr('x2', 1400)
        .attr('y1', function(d,i){

            return i * vertical_gap + vertical_gap
        })
        .attr('y2', function(d,i){

            return i * vertical_gap + vertical_gap
        })
        .attr('stroke','black')
        .attr('stroke-width','5')
        .attr('opacity','0.1')

    let source_target_array = []

    let max_link = 0;

    for(head in source_target_group){

        if(source_target_group[head] > max_link)
            max_link = source_target_group[head]
    }

    for (head in source_target_group){

        let source = focused_persons[head.split('&')[0]]

        let target = focused_persons[head.split('&')[1]]

        let value = source_target_group[head]

        source_target_array.push({'source':source,'target':target,'value':value/max_link * 60})
    }

    let links = svg.append('g')
        .selectAll('links')
        .data(source_target_array)
        .enter()
        .append('g')


    let source_location_store = {}

    let target_location_store = {}

    links.append('path')
        .datum(function(d){

            let delta = 0

            let alpha = 0

            if(source_location_store[d.source] != undefined){

                delta = source_location_store[d.source]

                source_location_store[d.source] += d.value/width_factor
            }
            else{
                source_location_store[d.source] = d.value/width_factor
            }

            if(target_location_store[d.target] != undefined){

                alpha = target_location_store[d.target]

                target_location_store[d.target] += d.value/width_factor
            }
            else{
                target_location_store[d.target] = d.value/width_factor
            }

            let p1 = {'x':80,'y':d.source * vertical_gap + delta,'width':(d.value/width_factor)}

            let p2 = {'x':140,'y':d.source * vertical_gap  + delta,'width':(d.value/width_factor)}

            let p3 = {'x':140,'y':d.target * vertical_gap + alpha,'width':(d.value/width_factor)}

            let p4 = {'x':200,'y':d.target * vertical_gap  + alpha,'width':(d.value/width_factor)}

            return [p1,p2,p3,p4]
        })
        .style("fill", "url(#vertical-gradient)")
        .attr('stroke','none')
        .attr('fill-opacity','0.7')
        .attr("d",  d3.area()
                .curve(d3.curveBasis)
                .x0(function(d) { return (d.x); })
                .y0(function(d) { return (d.y); })
                .x1(function(d) { return (d.x); })
                .y1(function(d) { return (d.y + (d.width))})
        )


    let day_grouper_array = []

    for(head in day_grouper){

        day_grouper_array.push({'day':head,'value':day_grouper[head]})
    }

    let day_bar = container.append('g')

    day_bar.selectAll('.day_bar')
        .data(day_grouper_array)
        .enter()
        .append('rect')
        .attr('width', 4)
        .attr('height', function(d){

            return d.value * 5
        })
        .attr('x', function(d,i){

            return (d.day) * horizon_gap - 5
        })
        .attr('y', function(d){

            return 0 - d.value * 5
        })
        .attr('fill','#999')

    day_bar.selectAll('bar_base')
        .data(day_grouper_array)
        .enter()
        .append('rect')
        .attr('width', 6)
        .attr('height', 3)
        .attr('x', function(d,i){

            return (d.day) * horizon_gap - 5
        })
        .attr('y', function(d){

            return 0
        })
        .attr('fill','#000')

    let tail_year = (parseInt(min_date / 12) + 1996)

    let head_year = (parseInt(max_date / 12) + 1996)

    let ayy = d3.keys(year_dict)
    ayy.push(tail_year)
    ayy.push(head_year)

    day_bar.selectAll('day_indicator')
        .data(ayy)
        .enter()
        .append('text')
        .attr('x', function(d,i){

            return (d-1996) * horizon_gap * 12
        })
        .attr('y', function(d){

            return 250
        })
        .attr('fill','#000')
        .text(function(d){

            if (d > 1999)
                return d
            else return ''
        })

    svg.append('line')
        .attr('x1', 105)
        .attr('x2', 130)
        .attr('y1', 10)
        .attr('y2', 10)
        .attr('stroke','grey')

    svg.append('text')
        .attr('x', 135)
        .attr('y', 15)
        .text('Link')

    svg.append('line')
        .attr('x1', 170)
        .attr('x2', 195)
        .attr('y1', 10)
        .attr('y2', 10)
        .attr('stroke','grey')

    svg.append('text')
        .attr('x', 100)
        .attr('y', 240)
        .text('Date/Object')

}