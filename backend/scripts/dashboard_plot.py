import pandas as pd
import json
import numpy as np
import sys

# Get city from command-line argument
city = sys.argv[1]

# Load your CSV files
predictions_df = pd.read_csv(f'D:/FYPs/ffyypp/ffyypp/backend/predictionResult/EL PASO_hybrid_result.csv')
actual_df = pd.read_csv('D:/FYPs/ffyypp/ffyypp/backend/validationData/EL PASO_ValidationData.csv')

# Extract relevant columns
predictions = predictions_df['Ensemble_Predicted_Demand']
actual = actual_df['Demand (MW)']

# Create chart data (assuming both have the same length)
chart_data = []
for i in range(min(len(predictions), len(actual))):
    chart_data.append({
        "time": pd.to_datetime(predictions_df['DATE'][i]).strftime("%Y-%m-%d %H:%M"),
        "actual": float(actual[i]),       # Convert NumPy float to native Python float
        "predicted": float(predictions[i])  # Convert NumPy float to native Python float
    })

# ✅ FIX: Convert NumPy types to native Python types before JSON dumping
def convert_np(obj):
    if isinstance(obj, (np.integer, np.floating)):
        return obj.item()
    return obj

# Print JSON to stdout
print(json.dumps(chart_data, default=convert_np))




