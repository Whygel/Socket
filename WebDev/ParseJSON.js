const url = "ws://localhost:5244/ws";
       // const connEl = document.getElementById('conn');
      //  const lastEl = document.getElementById('last');

       // const ctx = document.getElementById('chart').getContext('2d');
      //  let chart = null;


        const socket = new WebSocket(url);

        socket.onopen = () => {
           // connEl.innerText = 'verbunden';
            console.log('WebSocket verbunden');
        };

        socket.onclose = () => {
            //connEl.innerText = 'geschlossen';
            console.log('WebSocket geschlossen');
        };

        socket.onerror = (e) => console.error('WS-Fehler', e);
        var data =[];
        socket.onmessage = (event) => {
            try {
                const obj = JSON.parse(event.data);
                data = Object.keys(obj).map(key => ({
                company: key,
                value: obj[key]
                }));
                test();

               // const labels = Object.keys(obj); // Array mit den Schlüsseln
              //  const values = labels.map(l => obj[l]);
              //  ensureChart(labels, values);
              //  lastEl.innerText = JSON.stringify(obj);
            } catch (err) {
                console.error('Fehler beim Parsen:', err);
               // lastEl.innerText = event.data;
            }
        };
function test() {
var margin = { top: 20, right: 30, bottom: 40, left: 90 },
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3.select("#bars")
.append("svg")
.style("border", "1px solid black")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr('style', 'background-color: lightblue')
.attr("transform",
"translate(" + margin.left + "," + margin.top + ")");


// Add X axis
var x = d3.scaleLinear()
.domain([0, 1000])
.range([0, width]);
// Axis label X
svg.append("g") // g = text group
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x))
.selectAll("text")
.attr("transform", "translate(-10,0)rotate(-45)")
.style("text-anchor", "end")
.attr("class", "g") ;
// Y axis
var y = d3.scaleBand()
.range([0, height])
.domain(data.map(function (d) { return d.company; }))
.padding(.1);
// Axis label Y

svg.append("g")
.call(d3.axisLeft(y));

svg.selectAll("myRect").data(data).enter()
.append("rect")
.attr("x", x(0))
.attr("y", function (d) { return y(d.company); })
.attr("width", function (d) { return x(d.value); })
.attr("height", y.bandwidth()) // Teilt die verfügbare höhe auf
.attr("fill", "#0d9475ff")
.attr("id", function(d){return d.company.replace(/ /g, "_");});

}



function triggerTransitionPiping()
{  
    d3.select("#United_States").style("fill", "orange")
    .transition()
    .duration(2000)
    .attr("width", x(1000));
}

function Fullscreen() {
    const elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { // Safari
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE11
    elem.msRequestFullscreen();
  }
}
    