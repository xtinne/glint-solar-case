# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import xarray as xr

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

ds = xr.open_dataset('waves_2019-01-01.nc', engine='netcdf4')

@app.route('/wave-height', methods=['GET'])
def get_wave_height():
    lat = float(request.args.get('lat', 0))
    lon = float(request.args.get('lon', 0))
    
    try:
        point_data = ds.sel(latitude=lat, longitude=lon, method='nearest')
        
        actual_lat = float(point_data.latitude.values)
        actual_lon = float(point_data.longitude.values)
        
        if point_data['hmax'].size > 1:
            max_wave_height = float(point_data['hmax'].max().values)
        else:
            max_wave_height = float(point_data['hmax'].values.item())
        
        # Return the data as JSON
        return jsonify({
            'latitude': actual_lat,
            'longitude': actual_lon,
            'maxWaveHeight': max_wave_height
        })
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({
            'error': str(e),
            'message': 'Failed to retrieve wave height data'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)