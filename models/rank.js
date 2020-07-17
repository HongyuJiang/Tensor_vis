function createRank(data,focused_persons){

    d3.select("#rank").selectAll('*').remove()

    let svg = d3.select("#rank").append('svg'),
        width = +$('#rank').width(),
        height = +$('#rank').height();

    let min_value = 0;

    let max_value = 0;

    svg.attr('width', width)
        .attr('height', height)

    svg = svg.append('g')
        .attr('transform','translate(0,-35)')

    let source_grouper = {}

    let target_grouper = {}

    let type_grouper = {}

    data.forEach(function(d){
        if(focused_persons[d.source] != undefined && focused_persons[d.target] != undefined) {

            if (source_grouper[d.source] != undefined) source_grouper[d.source] += 1
            else source_grouper[d.source] = 1

            if (target_grouper[d.target] != undefined) target_grouper[d.target] += 1
            else target_grouper[d.target] = 1

            if (type_grouper[d.type] != undefined) type_grouper[d.type] += 1
            else type_grouper[d.type] = 1
        }
    })

    let source_array = []

    let target_array = []

    let type_array = []

    for(head in source_grouper){

        source_array.push({'name':head,'value':source_grouper[head]})
    }

    source_array.forEach(function(d){
        if(d.value > max_value) max_value = d.value
    })

    target_array.forEach(function(d){
        if(d.value > max_value) max_value = d.value
    })

    source_array = source_array.sort(function(a,b){

        return b.value - a.value
    })

    for(head in target_grouper){

        target_array.push({'name':head,'value':target_grouper[head]})
    }

    target_array = target_array.sort(function(a,b){

        return b.value - a.value
    })

    for(head in type_grouper){

        type_array.push({'key':head,'value':type_grouper[head]})
    }

    let defs = svg.append("defs");

    let linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");

    //Horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    //Set the color for the start (0%)
    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#000"); //light blue

    //Set the color for the end (100%)
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#ccc"); //dark blue

    svg.selectAll('rank_item')
        .data(source_array.slice(0,5))
        .enter()
        .append('text')
        .attr('x', 70)
        .attr('y', function(d,i){

            return i * 30 + 100
        })
        .attr('font-size', 12)
        .text(function(d){

            return d.name.split('(')[0].split(':')[0]
        })

    svg.selectAll('rank_item_bar')
        .data(source_array.slice(0,5))
        .enter()
        .append('rect')
        .attr('x', 220)
        .attr('y', function(d,i){

            return i * 30 + 90
        })
        .attr('width', function(d){

            return (d.value - min_value) / (max_value - min_value) * 100
        })
        .attr('height', 12)
        .style("fill", "url(#linear-gradient)");

    svg.selectAll('rank_item_value')
        .data(source_array.slice(0,5))
        .enter()
        .append('text')
        .attr('x', function(d){

            return 210 + (d.value - min_value) / (max_value - min_value) * 100 + 20
        })
        .attr('y', function(d,i){

            return i * 30 + 100
        })
        .attr('font-size', 12)
        .text(function(d){

            return d.value
        })

    let container1 = svg.append('g')
        .attr('transform', 'translate(0,150)')

    container1.selectAll('rank_item')
        .data(target_array.slice(0,5))
        .enter()
        .append('text')
        .attr('x', 70)
        .attr('y', function(d,i){

            return i * 30 + 310
        })
        .attr('font-size', 12)
        .text(function(d){

            return d.name.split('(')[0].split(':')[0]
        })

    container1.selectAll('rank_item_bar')
        .data(target_array.slice(0,5))
        .enter()
        .append('rect')
        .attr('x', 230)
        .attr('y', function(d,i){

            return i * 30 + 300
        })
        .attr('width', function(d){

            return (d.value - min_value) / (max_value - min_value) * 100
        })
        .attr('height', 12)
        .style("fill", "url(#linear-gradient)");

    container1.selectAll('rank_item_value')
        .data(target_array.slice(0,5))
        .enter()
        .append('text')
        .attr('x', function(d){

            return 210 + (d.value - min_value) / (max_value - min_value) * 100 + 20
        })
        .attr('y', function(d,i){

            return i * 30 + 310
        })
        .attr('font-size', 12)
        .text(function(d){

            return d.value
        })

    container1.append('text')
        .attr('x', 70)
        .attr('y', 280)
        .text('TARGET')


    container1.append('line')
        .attr('x1', 130)
        .attr('x2', 145)
        .attr('y1', 275)
        .attr('y2', 275)
        .attr('stroke','grey')

    container1.append('text')
        .attr('x', 145)
        .attr('y', 280)
        .attr('font-size', 12)
        .text('Top5')


    let pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    let path = d3.arc()
        .outerRadius(70)
        .innerRadius(40);

    let arc = svg.append('g')
        .attr('transform','translate(300,330)')
        .selectAll(".arc")
        .data(pie(type_array))
        .enter().append("g")
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return colors(d.data.key); });

    svg.append('text')
        .attr('x', 70)
        .attr('y', 70)
        .text('SOURCE')

    svg.append('line')
        .attr('x1', 135)
        .attr('x2', 150)
        .attr('y1', 65)
        .attr('y2', 65)
        .attr('stroke','grey')

    svg.append('text')
        .attr('x', 150)
        .attr('y', 70)
        .attr('font-size', 12)
        .text('Top5')

    ////////////////

    let actions = svg.append('g').attr('transform','translate(0, 250)')

    actions.selectAll('action')
        .data(type_array)
        .enter()
        .append('rect')
        .attr('width',10)
        .attr('height',10)
        .attr('x', 60)
        .attr('y', function(d,i){
            return i * 20
        })
        .attr('fill', function(d){

            return colors(d.key)
        })

    actions.selectAll('action_name')
        .data(type_array)
        .enter()
        .append('text')
        .attr('x', 80)
        .attr('y', function(d,i){
            return i * 20 + 8
        })
        .text(function(d){

            return d.key
        })
        .attr('font-size',8)

}