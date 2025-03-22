# scripts/holiday_analysis.py
import pandas as pd
import sys
import json

# Get city name from argument
city = sys.argv[1]
file_path = f"D:/FYPs/ffyypp/ffyypp/backend/city/EL PASO.csv"

df = pd.read_csv(file_path)
df['DATE'] = pd.to_datetime(df['DATE'])
df.sort_values('DATE', inplace=True)

# Group by Public Holiday and calculate average demand
holiday_avg = df.groupby('Public Holiday')['Demand (MW)'].mean()

# Format output for JSON
response = [
    {"type": "Non-Holiday", "demand": round(holiday_avg.get(0, 0), 2)},
    {"type": "Holiday", "demand": round(holiday_avg.get(1, 0), 2)}
]

print(json.dumps(response))

