        // initialize basemmap
        mapboxgl.accessToken =
            'pk.eyJ1IjoiZWxpbHNhbiIsImEiOiJjbHNheDVoejMwOGI3MmpudHlka2F3b2VsIn0.n64SDOIlbQ9Jx9LiGtVzkg';
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/light-v10', // style URL
            zoom: 3.85, // starting zoom
            center: [-100, 40] // starting center
        });

        // load data and add as layer
        async function geojsonFetch() {
            let response = await fetch('assets/us-covid-2020-rates.json');
            let countydata = await response.json();

            map.on('load', function loadingData() {
                map.addSource('countydata', {
                    type: 'geojson',
                    data: countydata
                });

                map.addLayer({
                    'id': 'county_data_layer',
                    'type': 'fill',
                    'source': 'countydata',
                    'paint': {
                        'fill-color': [
                            'step',
                            ['get', 'rates'],
                            '#FFEDA0',   // stop_output_0
                            10,          // stop_input_0
                            '#FED976',   // stop_output_1
                            20,          // stop_input_1
                            '#FEB24C',   // stop_output_2
                            50,          // stop_input_2
                            '#FD8D3C',   // stop_output_3
                            100,         // stop_input_3
                            '#FC4E2A',   // stop_output_4
                            110,         // stop_input_4
                            '#E31A1C',   // stop_output_5
                            120,         // stop_input_5
                            '#BD0026',   // stop_output_6
                            150,        // stop_input_6
                            "#800026"    // stop_output_7
                        ],
                        'fill-outline-color': '#BBBBBB',
                        'fill-opacity': 0.7,
                    }
                });

                const layers = [
                    '0-9',
                    '10-19',
                    '20-49',
                    '50-99',
                    '100-109',
                    '110-119',
                    '120-149',
                    '150 and more'
                ];
                const colors = [
                    '#FFEDA070',
                    '#FED97670',
                    '#FEB24C70',
                    '#FD8D3C70',
                    '#FC4E2A70',
                    '#E31A1C70',
                    '#BD002670',
                    '#80002670'
                ];

                // create legend
                const legend = document.getElementById('legend');
                legend.innerHTML = "<b>COVID19 Rates<br>(per county)</b><br><br>";


                layers.forEach((layer, i) => {
                    const color = colors[i];
                    const item = document.createElement('div');
                    const key = document.createElement('span');
                    key.className = 'legend-key';
                    key.style.backgroundColor = color;

                    const value = document.createElement('span');
                    value.innerHTML = `${layer}`;
                    item.appendChild(key);
                    item.appendChild(value);
                    legend.appendChild(item);
                });
            });

            map.on('mousemove', ({point}) => {
                const state = map.queryRenderedFeatures(point, {
                    layers: ['county_data_layer']
                });
                document.getElementById('text-description').innerHTML = state.length ?
                    `<h3>${state[0].properties.county}</h3><p><strong><em>${state[0].properties.rates}</strong> per county</em></p>` :
                    `<p>Hover over a state!</p>`;
            });
        }

        // Call the function to fetch GeoJSON data and load the map
        geojsonFetch();