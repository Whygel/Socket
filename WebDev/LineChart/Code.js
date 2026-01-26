// Konfiguration
const socketUrl = "ws://localhost:5244/ws"; // Ersetze mit deinem WebSocket-Server
const margin = { top: 100, right: 20, bottom: 50, left: 50 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
let xScaleType = "linear";
// Daten-Array für die Aktienkurse
let stockData = [];
let lineColor = "#5691c8";
// SVG-Container erstellen
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .style("background-color", "#f9f9f9")
    .attr("transform", `translate(${margin.left},${margin.top})`);


const title = svg.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .style("margin-bottom", "10px")
    .style("margin-top", "10px")
    .style("fill", "#333")
    .text("Diagramm Titel");
// Skalen für x- und y-Achse
const xScale = d3.scaleTime().range([0, width]);
 const yScale = d3.scaleLinear().range([height, 0]);
  // Minimum immer 0, Maximum 105% des Max

// Achsen erstellen
// .tickFormat(d3.timeFormat("%b %Y"))
const xAxis = d3.axisBottom(xScale).tickSize(1);
const yAxis = d3.axisLeft(yScale);
const yGrid = d3.axisLeft(yScale).tickSize(-width).tickFormat('');

// Linienfunktion für das Diagramm
const line = d3.line()
    .x(d => xScale(new Date(d.time)))
    .y(d => yScale(d.price));

// WebSocket-Verbindung herstellen
const socket = new WebSocket(socketUrl);

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    stockData.push({
        time: data.time,
        price: data.price,
        investment: data.Value
    });
    // Nur die letzten 100 Datenpunkte behalten
    if (stockData.length > 1000) {
        stockData.shift();
    }

    updateChart();
    updateInvestment(stockData);
};

function updateInvestment(data) {
        const lastData = data[data.length - 1];
    if (lastData) {
        document.getElementById('investmentValue').textContent = lastData.investment.toFixed(2)+ "€";
    }
            document.getElementById('dateValue').textContent = lastData.time.split('T')[0] ;

}
   

function updateChart() {

    // Skalen aktualisieren
    xScale.domain(d3.extent(stockData, d => new Date(d.time)));
   // yScale.domain([0, d3.max(stockData, d => d.price) * 1.05]); // Bei Null beginnent
    yScale.domain([d3.min(stockData, d => d.price) * 0.95, d3.max(stockData, d => d.price) * 1.05]);

     //Grid-Linien für Y-Achse zeichnen
    svg.selectAll(".grid")
        .data([null])
        .join("g")
        .attr("class", "grid")
        .call(yGrid);  

    // Linie zeichnen
    svg.selectAll(".line")
        .data([stockData])
        .join("path")
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", lineColor)
        .attr("stroke-width", 2)
        .attr("fill", "none");

    // Achsen zeichnen
    svg.selectAll(".x-axis")
        .data([null])
        .join("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.selectAll(".y-axis")
        .data([null])
        .join("g")
        .attr("class", "y-axis")
        .call(yAxis);
}
//#region Interactivity Controls
// Event-Listener für Farbauswahl
document.getElementById('lineColor').addEventListener('input', function() {
    lineColor = this.value;
    svg.select(".line").attr("stroke", lineColor);
});

// Event-Listener für Skalierungsauswahl
document.getElementById('xScaleType').addEventListener('change', function() {
    xScaleType = this.value;
    updateChart();
});
// Event-Listener für Titel-Eingabe
document.getElementById('chartTitle').addEventListener('input', function() {
    title.text(this.value || "Diagramm Titel");
});

// Fullscreen-Button
document.getElementById('fullscreenButton').addEventListener('click', function() {
    const container = document.getElementById('chart-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error(`Fehler beim Vollbildmodus: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});
//#endregion Interactivity Controls