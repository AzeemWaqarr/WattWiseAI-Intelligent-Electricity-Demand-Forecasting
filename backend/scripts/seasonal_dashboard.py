# seasonal_trends.py
import pandas as pd
import numpy as np
import json
import sys

city = sys.argv[1]  # Get city name from CLI

# Load and prepare the data
df = pd.read_csv(f'D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO.csv')
df['DATE'] = pd.to_datetime(df['DATE'])
df.sort_values('DATE', inplace=True)

season_mapping = {1: 'Winter', 2: 'Spring', 3: 'Summer', 4: 'Fall'}
df['SeasonName'] = df['Season'].map(season_mapping)

# Seasonal analysis
seasonal_avg = df.groupby('SeasonName')['Demand (MW)'].mean().reindex(['Spring', 'Summer', 'Fall', 'Winter'])

# Output as JSON
output = [{'season': season, 'demand': float(demand)} for season, demand in seasonal_avg.items()]
print(json.dumps(output))


