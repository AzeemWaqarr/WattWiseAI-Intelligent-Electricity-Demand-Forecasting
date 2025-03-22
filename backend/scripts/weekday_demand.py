import pandas as pd
import numpy as np
import json
import sys
import os

# Ensure city name is passed as argument
if len(sys.argv) < 2:
    print(json.dumps({"error": "City name argument missing"}))
    sys.exit(1)

city_name = sys.argv[1]

# Replace spaces with underscores for filename matching
city_filename = city_name.replace(" ", "_")

# Construct path
data_path = f"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO.csv"

# Check if file exists
if not os.path.exists(data_path):
    print(json.dumps({"error": f"File not found: {data_path}"}))
    sys.exit(1)

# -------------------------------
# 1. Load and Prepare the Data
# -------------------------------
df = pd.read_csv(data_path)

# Convert 'DATE' to datetime and sort
df['DATE'] = pd.to_datetime(df['DATE'])
df.sort_values('DATE', inplace=True)

# Map Weekday to Day Names
weekday_mapping = {
    1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday',
    5: 'Friday', 6: 'Saturday', 7: 'Sunday'
}
df['DayName'] = df['Weekday'].map(weekday_mapping)

# -------------------------------
# 2. Average Demand by Day of Week
# -------------------------------
day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
day_avg = df.groupby('DayName')['Demand (MW)'].mean().reindex(day_order)

# Format output for JSON
final_data = [{"day": day, "demand": round(value, 2)} for day, value in day_avg.items()]

# Output as JSON
print(json.dumps(final_data))
