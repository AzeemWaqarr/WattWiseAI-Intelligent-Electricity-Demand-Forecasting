import sys
import os
import pandas as pd
import json

def calculate_consumption_summary(city):
    file_path = os.path.join("predictionResult", f"EL PASO_hybrid_result.csv")

    if not os.path.exists(file_path):
        print(json.dumps({"error": "CSV file not found"}))
        return

    try:
        df = pd.read_csv(file_path)
        df.columns = df.columns.str.strip()  # Clean column names

        if 'Ensemble_Predicted_Demand' not in df.columns or 'DATE' not in df.columns:
            print(json.dumps({"error": f"Missing required columns. Found: {list(df.columns)}"}))
            return

        # Convert DATE column to datetime
        df['DATE'] = pd.to_datetime(df['DATE'], errors='coerce')
        df.dropna(subset=['DATE'], inplace=True)

        df['DateOnly'] = df['DATE'].dt.date

        # Compute statistics
        total_consumption = df['Ensemble_Predicted_Demand'].sum()
        daily_totals = df.groupby('DateOnly')['Ensemble_Predicted_Demand'].sum()
        average_daily = daily_totals.mean()
        estimated_cost = total_consumption * 0.16  # Example cost rate

        result = {
            "totalConsumption": round(total_consumption, 2),
            "averageDaily": round(average_daily, 2),
            "estimatedCost": round(estimated_cost, 2)
        }

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "City name argument missing"}))
    else:
        calculate_consumption_summary(sys.argv[1])
