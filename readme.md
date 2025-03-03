# Glint Solar Case - Tinne Jacobs
## Prerequisites
- Python 3.7+
- Node.js and npm
- Required Python packages: xarray, netCDF4, flask, flask-cors
- MapBox account and API key for the interactive map

## Task 1 (Highest wave at 0.000, 0.000 on 1/1/'19)
This script can be found at /highest-wave-length

To execute:
```python highest_wave_length.py```

## Task 2 (Interactive map)
### Backend server
The backend server can be found at /interactive-map-server

To execute:
```python server.py```
\
The server will start at http://localhost:3000

### Frontend
The React frontend can be found at /interactive-map

First, create an .env file root of this folder, and add your MapBox API token: ```VITE_MAPBOX_TOKEN=replace_with_your_token```

Then install dependencies and run the application:
```
npm install  # Only needed the first time
npm run dev
```
This will start the development server and open the interactive map in your default browser.

## Task 3 (Highest wave since 1950)
I would pre-process the entire historical dataset to generate a new dataset containing only the maximum wave height values for each location. This avoids real-time processing of 70+ years of data when clicking on the map. This approach provides instant access to historical maximum values while maintaining application responsiveness.

The main point of concern is that the initial calculation might take really long. Processing 70+ years of hourly global data requires significant computational resources and time.
\
After looking into the xarray documentation, I discovered that Dask integration would be ideal for this task. Xarray's built-in support for Dask allows for parallel and out-of-memory computation on larger-than-memory datasets.

