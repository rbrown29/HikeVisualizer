# Hike Visualizer

Trail Visualizer is a web application for viewing and interacting with hiking trails, with features such as elevation profiles, weather information, and detailed trail mapping. The project utilizes Webpack, React, and ArcGIS.

## Preview
- [EagleCreek](https://eaglecreekelevation.netlify.app/)
- [AngelsRest](https://angelsrestelevation.netlify.app/)
- [SmithRock](https://smithrockelevation.netlify.app/)
- [Multnomah-Wahkeena](https://multnomah-wahkeenaelevation.netlify.app/)
- [MirrorLake](https://mirrorlakeelevation.netlify.app/)

## Features
- Interactive 3D maps using ArcGIS
- Weather information for trail locations
- Elevation profiles and trail geometry visualization
- Multiple trails supported with independent builds
- Fully responsive design

## Technologies Used
- **React**: For building the user interface
- **Webpack**: For bundling and building the project
- **ArcGIS JS API**: For 3D and 2D mapping functionality
- **OpenWeatherMap API**: For fetching weather data
- **FontAwesome**: For icons

## Installation

### Prerequisites
- Node.js and npm installed
- An OpenWeatherMap API key
- ArcGIS account for accessing premium layers if required

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file for environment variables:
   ```bash
   REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Build commands for each trail example (see package.json):
   ```bash
   npm run build:angelsRest
   npm run build:smithRock
   ```

## Scripts

### Build Scripts (package.json)
```json
{
  "scripts": {
    "build:angelsRest": "webpack --entry ./src/index.js --output-path ./build/AngelsRest --output-filename AngelsRest.bundle.js",
    "build:smithRock": "webpack --entry ./src/index.js --output-path ./build/SmithRock --output-filename SmithRock.bundle.js"
  }
}
```

### Development
To run a local development server:
```bash
npm start
```

## Folder Structure
```
trail-visualizer/
├── src/
│   ├── index.js       # Main entry point
│   ├── index.css      # index.js styles
│   └── assets/        # TCX files and Video files
├── dist/              # Output directory for builds
├── webpack.config.js  # Webpack configuration
├── .env               # Environment variables
└── README.md          # Project documentation
```



