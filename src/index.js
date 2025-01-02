import ArcGISWebScene from '@arcgis/core/WebScene';
import SceneView from '@arcgis/core/views/SceneView';
import MapView from '@arcgis/core/views/MapView';
import ArcGISMap from '@arcgis/core/Map';
import Basemap from '@arcgis/core/Basemap';
import TileLayer from '@arcgis/core/layers/TileLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import Polyline from '@arcgis/core/geometry/Polyline';
import Graphic from '@arcgis/core/Graphic';
import ElevationProfile from '@arcgis/core/widgets/ElevationProfile';
import request from '@arcgis/core/request';
import { XMLParser } from 'fast-xml-parser';
import './index.css';

// Add FontAwesome stylesheet
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
document.head.appendChild(fontAwesomeLink);

const brightGreen = [8, 255, 8];

// Initialize the main 3D map
const mainView = new SceneView({
  map: new ArcGISWebScene({
    basemap: 'satellite',
    ground: 'world-elevation',
    humidityEffect: 'high',
    atmosphere: {
      quality: 'high',
    },
    lighting: {
      date: new Date('Sun Mar 21 2021 12:00:00 GMT-0700 (Pacific Daylight Time)'),
      directShadowsEnabled: true,
    },
    Hillshade : {
      enable: true,
      quality: 'high',
    },
    layers: [
      new TileLayer({
        portalItem: {
          id: '7029fb60158543ad845c7e1527af11e4',
        },
        opacity: 0.3,
      }),
      new VectorTileLayer({
        portalItem: {
          id: '8d91bd39e873417ea21673e0fee87604',
        },
      }),
    ],
  }),
  container: 'viewDiv',
  camera: {
    position: [-123.95607,45.76312, 1500],
    tilt: 70,
  },
});

// Initialize the mini-map
const miniMap = new MapView({
  container: 'miniMap',
  map: new ArcGISMap({
    basemap: new Basemap({
      baseLayers: [
        new TileLayer({
          portalItem: {
            id: '7029fb60158543ad845c7e1527af11e4',
          },
          opacity: 0.4,
        }),
        new VectorTileLayer({
          portalItem: {
            id: '378fd91096fe478cb78a4e06b639b715',
          },
          blendMode: 'multiply',
        }),
      ],
    }),
  }),
  center: [-123.95607,45.76312],
  zoom: 7,
  ui: {
    components: [],
  },
});

// Add Weather Widget to Profile Section
const profileContainer = document.getElementById('profile');
const weatherWidget = document.createElement('div');
weatherWidget.className = 'weather-widget';
weatherWidget.innerHTML = `
  <h4 style="margin-bottom: 10px;">Weather Information</h4>
  <div id="weather-data" style="line-height: 1.5;">Loading weather data...</div>
`;
profileContainer.appendChild(weatherWidget);

// Fetch and display weather data
function fetchWeather(lat, lon) {
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Replace with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const weatherDetails = `
        <div class="weather-details">
          <p><strong>Location:</strong> ${data.name}</p>
          <p><strong>Temperature:</strong> ${data.main.temp} °F</p>
          <p><strong>Conditions:</strong> 
            <img src="${weatherIcon}" alt="${data.weather[0].description}" />
            ${data.weather[0].description}
          </p>
        </div>
      `;
      document.getElementById('weather-data').innerHTML = weatherDetails;
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
      document.getElementById('weather-data').innerHTML =
        '<p>Unable to fetch weather data.</p>';
    });
}

// Fetch weather for location
fetchWeather(45.76312, -123.95607);



// Function to parse and visualize the TCX file
function parseTCXFile(filePath) {
  request(filePath, { responseType: 'text' })
    .then((response) => {
      const parser = new XMLParser();
      const jsonData = parser.parse(response.data);

      const trackpoints =
        jsonData.TrainingCenterDatabase?.Courses?.Course?.Track?.Trackpoint;

      if (trackpoints && trackpoints.length > 0) {
        const coordinates = trackpoints.map((point) => [
          parseFloat(point.Position.LongitudeDegrees),
          parseFloat(point.Position.LatitudeDegrees),
        ]);

        const polyline = new Polyline({
          paths: [coordinates],
          spatialReference: { wkid: 4326 },
        });

        const graphic = new Graphic({
          geometry: polyline,
          symbol: {
            type: 'simple-line',
            color: brightGreen,
            width: 3,
          },
        });

        mainView.when(() => {
          mainView.graphics.removeAll();
          mainView.graphics.add(graphic);
          mainView.goTo(polyline.extent.expand(2));
          mainView.graphics.add3D(graphic);

        });

        miniMap.when(() => {
          miniMap.graphics.removeAll();
          miniMap.graphics.add(graphic.clone());
          miniMap.goTo(polyline.extent.expand(.5));
        });

        new ElevationProfile({
          view: mainView,
          container: 'profile',
          input: graphic,
          profiles: [{ type: 'ground', color: brightGreen, title: 'Elevation' }],
          visibleElements: {
            legend: true,
            sketchButton: false,
            selectButton: false,
            settingsButton: false
          },
          mainViewColor: brightGreen,

        });
      } else {
        console.error('No trackpoints found in the TCX file.');
      }
    })
    .catch((error) => {
      console.error('Failed to parse TCX file:', error);
    });
}

// Load and parse the TCX file
parseTCXFile('./assets/data/CapeFalconTrail.tcx');

// Responsive map adjustments
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    mainView.padding = { left: 300, bottom: 0 };
  } else {
    mainView.padding = { left: 0, bottom: 200 };
  }
});






