const margin = { top: 20, right: 40, bottom: 30, left: 120 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .style("background-color", "lightblue")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleBand().range([0, height]).padding(0.2);

    const xAxis = svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height})`);

    const yAxis = svg.append("g")
      .attr("class", "axis");

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
        data =[];
        socket.onerror = (e) => console.error('WS-Fehler', e);
        var data =[];
        socket.onmessage = (event) => {
            try {                
               const obj = JSON.parse(event.data);
                data = obj.map(item => ({
                    company: item.Company,
                    value: item.Value,
                    logo: item.Logo
                }));

                updateChart(data);
             
            } catch (err) {
                console.error('Fehler beim Parsen:', err);
            }
        };

 

    // ========================
    // 2. Update-Funktion
    // ========================
    function updateChart(data) {

    console.log("Daten erhalten:", data);

      // 🔹 Sortieren nach Wert (Ranking) und Top 6 nehmen
      data = data.sort((a, b) => b.value - a.value).slice(0, 6);

      // 🔹 Skalen aktualisieren
      xScale.domain([0, d3.max(data, d => d.value)]);
      yScale.domain(data.map(d => d.company)).range([0, height]);

      // 🔹 Balken
      const bars = svg.selectAll(".bar")
        .data(data, d => d.company); // KEY wichtig!

      bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", height) // Start von unten
        .attr("height", yScale.bandwidth())
        .attr("width", 0)
        .merge(bars)
        .transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.company)) // Ranking Animation
        .attr("width", d => xScale(d.value));

      bars.exit()
        .transition()
        .duration(500)
        .attr("width", 0)
        .remove();
        
      // 🔹 Labels
      const labels = svg.selectAll(".label")
        .data(data, d => d.company);

      labels.enter()
        .append("text")
        .attr("class", "label")
        .merge(labels)
        .transition()
        .duration(1000)
        .attr("x", d => xScale(d.value) + 5)
        .attr("y", d => yScale(d.company) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => Math.round(d.value));

      labels.exit().remove();

      // 🔹 Y-Achsen Labels mit Logos
      const labelGroups = svg.selectAll(".label-group")
        .data(data, d => d.company);

      const enterGroups = labelGroups.enter()
        .append("g")
        .attr("class", "label-group")
        .attr("transform", `translate(0, ${height})`); // Start von unten

      enterGroups.append("image")
        .attr("xlink:href", d => `data:image/png;base64,${d.logo}`)
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", -40)
        .attr("y", -10);

      enterGroups.append("text")
        .attr("class", "company-label")
        .attr("x", -15)
        .attr("y", 5)
        .style("font-size", "12px")
        .text(d => d.company);

      labelGroups.merge(enterGroups)
        .transition()
        .duration(1000)
        .attr("transform", d => `translate(0, ${yScale(d.company) + yScale.bandwidth() / 2})`);

      labelGroups.exit().remove();

      // 🔹 Achsen
      xAxis.transition()
        .duration(1000)
        .call(d3.axisBottom(xScale));

      // yAxis entfernt, da wir eigene Labels haben
    }