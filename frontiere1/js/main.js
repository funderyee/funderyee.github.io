document.addEventListener('DOMContentLoaded', function() {
    // Définition des données des data centers
    const dataCenters = [
        { name: "AWS US East (N. Virginia)", location: [37.7749, -77.4194], servers: 2500 },
        { name: "AWS US West (Oregon)", location: [45.5051, -122.6750], servers: 1800 },
        { name: "AWS Europe (Frankfurt)", location: [50.1109, 8.6821], servers: 1500 },
        { name: "Google Cloud (Iowa)", location: [41.8780, -93.0977], servers: 1700 },
        { name: "Azure East US (Virginia)", location: [38.7561, -78.1114], servers: 2200 },
        { name: "Azure West Europe (Netherlands)", location: [52.3676, 4.9041], servers: 1600 },
        { name: "IBM Cloud (Dallas)", location: [32.7767, -96.7970], servers: 1300 },
        { name: "AWS Asia Pacific (Tokyo)", location: [35.6762, 139.6503], servers: 1400 },
        { name: "Alibaba Cloud (Hangzhou)", location: [30.2741, 120.1551], servers: 1900 },
        { name: "OVH (France)", location: [48.8566, 2.3522], servers: 950 },
        { name: "Digital Ocean (New York)", location: [40.7128, -74.0060], servers: 800 },
        { name: "Azure Southeast Asia (Singapore)", location: [1.3521, 103.8198], servers: 950 },
        { name: "Google Cloud (London)", location: [51.5074, -0.1278], servers: 850 },
        { name: "AWS South America (São Paulo)", location: [-23.5505, -46.6333], servers: 700 },
        { name: "Oracle Cloud (Phoenix)", location: [33.4484, -112.0740], servers: 600 },
        { name: "IBM Cloud (London)", location: [51.5072, -0.1276], servers: 550 },
        { name: "Azure Australia (Sydney)", location: [-33.8688, 151.2093], servers: 500 },
        { name: "Rackspace (Texas)", location: [29.4241, -98.4936], servers: 450 },
        { name: "Google Cloud (Singapore)", location: [1.3521, 103.8198], servers: 420 },
        { name: "Tencent Cloud (Beijing)", location: [39.9042, 116.4074], servers: 380 },
        { name: "AWS Canada (Montreal)", location: [45.5017, -73.5673], servers: 320 },
        { name: "Azure (Dubai)", location: [25.2048, 55.2708], servers: 280 },
        { name: "DigitalOcean (Amsterdam)", location: [52.3676, 4.9041], servers: 250 },
        { name: "AWS Africa (Cape Town)", location: [-33.9249, 18.4241], servers: 80 },
        { name: "Azure (South Africa)", location: [-26.2041, 28.0473], servers: 70 },
        { name: "Google Cloud (Warsaw)", location: [52.2297, 21.0122], servers: 90 },
        { name: "Yandex Cloud (Russia)", location: [55.7558, 37.6173], servers: 85 },
        { name: "Hetzner (Germany)", location: [49.4521, 11.0767], servers: 60 },
        { name: "SoftLayer (Mexico City)", location: [19.4326, -99.1332], servers: 45 },
        { name: "AWS (Mumbai)", location: [19.0760, 72.8777], servers: 320 },
        { name: "AWS (Bahrain)", location: [26.0667, 50.5577], servers: 110 },
        { name: "Azure (Johannesburg)", location: [-26.2041, 28.0473], servers: 75 },
        { name: "OVH (Canada)", location: [45.5017, -73.5673], servers: 95 }
    ];

    // Création de la carte avec D3.js
    const width = document.getElementById('world-map').clientWidth;
    const height = document.getElementById('world-map').clientHeight;
    
    // Projection de la carte
    const projection = d3.geoMercator()
        .scale(width / 2 / Math.PI)
        .translate([width / 2, height / 1.5]);
    
    const path = d3.geoPath().projection(projection);
    
    // Création du SVG
    const svg = d3.select("#world-map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Chargement des données géographiques mondiales
    d3.json("https://cdnjs.cloudflare.com/ajax/libs/world-atlas/2.0.2/countries-110m.json")
        .then(function(world) {
            const countries = topojson.feature(world, world.objects.countries).features;
            
            // Dessin des pays
            svg.append("g")
                .selectAll("path")
                .data(countries)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", "#eee")
                .attr("stroke", "#ccc")
                .attr("stroke-width", 0.5);
            
            // Ajout des data centers sur la carte
            svg.selectAll("circle")
                .data(dataCenters)
                .enter()
                .append("circle")
                .attr("cx", d => projection(d.location.reverse())[0])
                .attr("cy", d => projection(d.location)[1])
                .attr("r", d => {
                    if (d.servers > 1000) return 12;
                    if (d.servers > 100) return 8;
                    return 5;
                })
                .attr("fill", "rgba(255, 87, 34, 0.7)")
                .attr("stroke", "rgba(255, 87, 34, 1)")
                .attr("stroke-width", 1)
                .on("mouseover", function(event, d) {
                    d3.select(this)
                        .attr("fill", "rgba(255, 152, 0, 0.8)");
                    
                    const tooltip = document.getElementById("tooltip");
                    tooltip.style.opacity = 1;
                    tooltip.style.left = (event.pageX - document.querySelector('.map-container').offsetLeft + 10) + "px";
                    tooltip.style.top = (event.pageY - document.querySelector('.map-container').offsetTop + 10) + "px";
                    tooltip.innerHTML = `<strong>${d.name}</strong><br>Serveurs: ${d.servers}`;
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .attr("fill", "rgba(255, 87, 34, 0.7)");
                    
                    document.getElementById("tooltip").style.opacity = 0;
                });
        })
        .catch(function(error) {
            console.log("Erreur lors du chargement des données:", error);
            
            // Afficher un message d'erreur sur la carte
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .text("Erreur de chargement de la carte. Veuillez réessayer.");
        });
        
    // Fix pour la bibliothèque topojson qui n'est pas importée
    const topojson = {
        feature: function(topology, o) {
            return {
                type: "FeatureCollection",
                features: o.geometries.map(function(o) {
                    return {
                        type: "Feature",
                        id: o.id,
                        properties: o.properties || {},
                        geometry: {
                            type: o.type,
                            coordinates: o.coordinates
                        }
                    };
                })
            };
        }
    };
});