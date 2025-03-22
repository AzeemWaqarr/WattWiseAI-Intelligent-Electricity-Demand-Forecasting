import pandas as pd
import numpy as np
import json
import sys

city = sys.argv[1]  # Get city name from command-line args

# Load files
predictions_df = pd.read_csv(f'D:/FYPs/ffyypp/ffyypp/backend/predictionResult/EL PASO_hybrid_result.csv')
actual_df = pd.read_csv(f'D:/FYPs/ffyypp/ffyypp/backend/validationData/EL PASO_ValidationData.csv')

# Columns
predictions = predictions_df['Ensemble_Predicted_Demand']
actual = actual_df['Demand (MW)']

# Tolerance Accuracy Calculation
tolerances = np.arange(0, 21, 1)
tolerance_results = []

for tolerance in tolerances:
    lower = actual * (1 - tolerance / 100)
    upper = actual * (1 + tolerance / 100)
    accuracy = ((predictions >= lower) & (predictions <= upper)).mean() * 100
    tolerance_results.append({
        "tolerance": int(tolerance),
        "accuracy": float(round(accuracy, 2))  # Ensure JSON serializable
    })

# Output JSON
print(json.dumps(tolerance_results))
