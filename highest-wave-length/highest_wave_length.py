import xarray as xr

ds = xr.open_dataset('waves_2019-01-01.nc', engine='netcdf4')

point_data = ds.sel(latitude=0.000, longitude=0.000, method='nearest')

max_hmax = point_data['hmax'].max().values

print(f'Highest wave height at 0.000, 0.000 on 2019-01-01: {max_hmax}')