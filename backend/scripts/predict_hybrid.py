import pandas as pd
import numpy as np
import joblib
import lightgbm as lgb
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import sys
import os
from pymongo import MongoClient
import json
sys.stdout.reconfigure(encoding='utf-8')

def filter_csv_by_date(input_file, output_file, start_date, end_date):
    df = pd.read_csv(input_file)
    df['DATE'] = pd.to_datetime(df['DATE'])
    filtered_df = df[(df['DATE'] >= start_date) & (df['DATE'] <= end_date)]
    filtered_df.to_csv(output_file, index=False)
    print(f"✅ Filtered data saved to {output_file}")

if __name__ == "__main__":
    # 1. Get command-line arguments
    city = sys.argv[1]
    start_date = sys.argv[2]
    end_date = sys.argv[3]

    # 2. Set Paths
    test_path = f"D:/FYPs/ffyypp/ffyypp/backend/testData/{city}_TestData.csv"
    ann_model_path = f"D:/FYPs/ffyypp/ffyypp/backend/bestModels/ann_best_model_optuna_hybrid.h5"
    lgb_model_path = f"D:/FYPs/ffyypp/ffyypp/backend/bestModels/lgb_optuna_final_model_hybrid.pkl"
    scaler_path = f"D:/FYPs/ffyypp/ffyypp/backend/bestModels/scaler_hybrid.pkl"
    prediction_output_path = f"D:/FYPs/ffyypp/ffyypp/backend/predictionResult/{city}_hybrid_result.csv"
    specific_output_path = f"D:/FYPs/ffyypp/ffyypp/backend/Result/SpecificResult.csv"

    # 3. Load Models and Scaler
    ann_model = load_model(ann_model_path)
    lgb_model = joblib.load(lgb_model_path)
    scaler = joblib.load(scaler_path)

    # 4. Load Test Data
    test_df = pd.read_csv(test_path, parse_dates=['DATE'])
    features = ['Season', 'TMP', 'HUMIDITY', 'Hour Number', 'Weekday', 'Month',
                'Public Holiday', 'Wind Speed', 'Rainfall/Snowfall']
    X = test_df[features]

    # 5. Predict
    X_ann_scaled = scaler.transform(X)
    pred_ann = ann_model.predict(X_ann_scaled).flatten()
    pred_lgb = lgb_model.predict(X)

    # 6. Ensemble (Weighted Average)
    alpha = 0.6
    final_preds = alpha * pred_ann + (1 - alpha) * pred_lgb

    # 7. Append predictions to DataFrame and Save Full Result
    test_df['Ensemble_Predicted_Demand'] = final_preds
    test_df.to_csv(prediction_output_path, index=False)

    # 8. Filter date range
    start_date_time = f"{start_date} 00:00:00"
    end_date_time = f"{end_date} 23:59:59"
    filter_csv_by_date(prediction_output_path, specific_output_path, start_date_time, end_date_time)

    specific_df = pd.read_csv(specific_output_path)
    # 9. Summary JSON
    specific_df['DATE'] = pd.to_datetime(specific_df['DATE'])  # <-- Add this line
    # Dynamically calculate peak hour range
    peak_hour_num = int(specific_df.loc[specific_df['Ensemble_Predicted_Demand'].idxmax()]['Hour Number'])
    peak_hour_range = f"{peak_hour_num:02d}:00-{(peak_hour_num+1)%24:02d}:00"
    summary = {
        "expectedUsage": round(specific_df['Ensemble_Predicted_Demand'].mean(), 2),
        "percentChange": round((specific_df['Ensemble_Predicted_Demand'].pct_change().mean()) * 100, 2),
        "confidence": 91,
        "peakDay": specific_df.loc[specific_df['Ensemble_Predicted_Demand'].idxmax()]['DATE'].strftime('%B %d, %Y'),
        "peakHour": peak_hour_range
    }

    print(json.dumps(summary))

# 9. Save prediction summary to MongoDB (model_specs)
try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client["wattwiseai"]
    model_specs_collection = db["model_specs"]

    # Remove previous entry for this city
    model_specs_collection.delete_many({ "city": city })

    # Add new summary
    model_specs_collection.insert_one({
        "city": city,
        "modelType": "fast",  # or "hybrid" depending on script
        "expectedUsage": summary["expectedUsage"],
        "percentChange": summary["percentChange"],
        "confidence": summary["confidence"],
        "peakDay": summary["peakDay"],
        "peakHour": summary["peakHour"],
        "timestamp": pd.Timestamp.now()
    })

    print("✅ Prediction summary stored in MongoDB.")
except Exception as e:
    print(f"❌ Failed to store summary in MongoDB: {e}")
