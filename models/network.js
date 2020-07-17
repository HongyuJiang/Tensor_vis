function createNetwork(data){

    let links = []

    let nodes = []

    node_grouper = {}

    edge_grouper = {}

    let persons1 = {
        'Rioters':1,
        'Military Forces of Algeria (1999-)':2,
        'Protesters,':3,
        'Police Forces of Algeria (1999-)':4,
        'GIA: Armed Islamic Group':5,
        'GSPC: Salafist Group for Call and Combat': 6,
        'AQIM: AlQaeda in the Islamic Maghreb': 7
    }

    let persons2 = {
        'Military Forces of Algeria (1999-)':1,
        'Protesters (International)':2,
        'MSJI: Saharan Sons for Islamic Justice Movement':3,
        'Rioters':4,
        'Military Forces of Morocco (1999-)':5,
        'Unidentified Armed Group (Libya)':6,

    }


    let focused_persons = {
        'Ain Defla Communal Militia':1,
        'Military Forces of Algeria (1994-1999)':2,
        'Bordj Emir Khaled Communal Militia':3,
        'GIA: Armed Islamic Group':4,
    }

    let focused_persons2 = {
        'Okba Ibn Nafaa Brigade':1,
        'Ennour Brigade':2,
        'Salafia Jihadia':3,
        'MSJI: Saharan Sons for Islamic Justice Movement':4,
        'Military Forces of Algeria (1999-)':5,
    }


    data = data.filter(function(d){

        if(d.source != undefined && d.target != undefined){

            if(d.source != '' && d.target != ''){

                return 1
            }
        }

        return 0
    })

    data.forEach(function(meta){

        let edge_name = meta.source + '&' + meta.target

        node_grouper[meta.source] = 1

        node_grouper[meta.target] = 1

        if(edge_grouper[edge_name] != undefined){

            edge_grouper[edge_name] += 1
        }
        else{

            edge_grouper[edge_name] = 1
        }
    })


    for(head in node_grouper){

        nodes.push({'id':head})
    }

    for(head in edge_grouper){

        let source = head.split('&')[0]

        let target = head.split('&')[1]

        links.push({'source':source,'target':target,'weight':edge_grouper[head]})
    }

    let graph = {'nodes':nodes, 'links':links}

    let svg = d3.select("#network").append('svg'),
        width = +$('#network').width(),
        height = +$('#network').height();

    svg.attr('width', width)
        .attr('height', height)

    let hull = svg.append("path")
        .attr("class", "hull")
        .attr('fill','black')
        .attr('fill-opacity',0.2)
        .attr('stroke','black')
        .attr('stroke-width','3')

    let hull2 = svg.append("path")
        .attr("class", "hull")
        .attr('fill','black')
        .attr('fill-opacity',0.2)
        .attr('stroke','black')
        .attr('stroke-width','3')

    let simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
            .id(function(d) { return d.id; })
            .distance(function(d){return 1}))
        .force("charge", d3.forceManyBody().strength(-70))
        //.force("charge", d3.forceManyBody().strength(10))
        .force("collide", d3.forceCollide(function(d){
            return 10
        }))
        .force("center", d3.forceCenter(width / 2, height / 2));

    let link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr('stroke', function(d){
            return '#333'
        })
        .attr('opacity', function(d){
            return '0.3'
        })
        //.attr("stroke-width", function(d) { return Math.sqrt(d.weight); });
        .attr("stroke-width", function(d) { return 1; });

    let node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 3)
        .attr("fill", function(d) { return 'black'; })
        .attr('stroke-width',0)
        .on('click', function(d){

            console.log(d.id)
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);


    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });


        let vertices = []

        let vertices2 = []

        graph.nodes.forEach(function(d){

            if(focused_persons[d.id] != undefined){

                vertices.push([d.x, d.y])
            }

            else if(focused_persons2[d.id] != undefined){

                vertices2.push([d.x, d.y])
            }
        })

        if(vertices.length > 2){

            hull.datum(d3.polygonHull(vertices)).attr("d", function(d) { return "M" + d.join("L") + "Z"; });
        }
        if(vertices2.length > 2){

            hull2.datum(d3.polygonHull(vertices2)).attr("d", function(d) { return "M" + d.join("L") + "Z"; });

        }

    }

    hull.on('click', function(d){
        createMatrix(data)
        createGantt(data , persons1)
        createRank(data, persons1)
    })

    hull2.on('click', function(d){
        createMatrix2(data)
        createGantt(data, persons2)
        createRank(data, persons2)
    })

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

}