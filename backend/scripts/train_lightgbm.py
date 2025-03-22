import sys
city = sys.argv[1]
print(f"Training LightGBM model for city: {city}")
import pandas as pd
import numpy as np
import optuna

from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import lightgbm as lgb
import joblib

# ---------------------------
# STEP A: LOAD & PREPARE TRAINING DATA
# ---------------------------

# 1. Read the training data (2015–2023)
train_df = pd.read_csv(f"D:/FYPs/ffyypp/ffyypp/backend/trainingData/{city}_TrainingData.csv", parse_dates=["DATE"])
train_df.sort_values("DATE", inplace=True, ignore_index=True)

# 2. Create lag (24-hour) and rolling (24-hour) features for the training set
train_df["Demand_lag24"] = train_df["Demand (MW)"].shift(24)
train_df["Demand_roll24"] = train_df["Demand (MW)"].rolling(window=24).mean()

# Drop the first 24 rows that are NaN after shift/rolling
train_df.dropna(inplace=True)
train_df.reset_index(drop=True, inplace=True)

# 3. Select features (including newly created lag/rolling columns)
features = [
    "Season",
    "TMP",
    "HUMIDITY",
    "Hour Number",
    "Weekday",
    "Month",
    "Public Holiday",
    "Wind Speed",
    "Rainfall/Snowfall"
]

X_train = train_df[features]
y_train = train_df["Demand (MW)"]

# ---------------------------
# STEP B: USE OPTUNA FOR HYPERPARAMETER TUNING WITH TIME-SERIES SPLIT
# ---------------------------

# Create a time-series cross-validator
tscv = TimeSeriesSplit(n_splits=3)

def objective(trial):
    """
    Objective function that Optuna will minimize (MSE) using TimeSeriesSplit.
    """
    # 1) Suggest hyperparameters (expand as needed)
    param = {
        "random_state": 42,
        "num_leaves": trial.suggest_int("num_leaves", 31, 127, step=32),
        "n_estimators": trial.suggest_int("n_estimators", 100, 1000, step=100),
        "learning_rate": trial.suggest_float("learning_rate", 1e-3, 1e-1, log=True),
        "min_child_samples": trial.suggest_int("min_child_samples", 10, 100, step=10),
        "colsample_bytree": trial.suggest_float("colsample_bytree", 0.5, 1.0)
    }

    # 2) Perform time-series cross-validation
    mse_list = []
    for train_idx, valid_idx in tscv.split(X_train):
        X_tr, X_val = X_train.iloc[train_idx], X_train.iloc[valid_idx]
        y_tr, y_val = y_train.iloc[train_idx], y_train.iloc[valid_idx]

        model = lgb.LGBMRegressor(**param)
        model.fit(X_tr, y_tr, eval_set=[(X_val, y_val)])

        y_pred_val = model.predict(X_val)
        mse_list.append(mean_squared_error(y_val, y_pred_val))

    # 3) Return average MSE across folds
    avg_mse = np.mean(mse_list)
    return avg_mse

# Create an Optuna study (we want to minimize MSE)
study = optuna.create_study(direction="minimize")
# Number of trials => number of hyperparam configurations tested (adjust as needed)
study.optimize(objective, n_trials=30)

# Print the best parameters found
print("Best trial:", study.best_trial.value)
print("Best params:", study.best_trial.params)


# ---------------------------
# STEP C: TRAIN FINAL MODEL ON ALL TRAINING DATA WITH BEST PARAMS
# ---------------------------
best_params = study.best_trial.params
best_params["random_state"] = 42  # ensure reproducibility

final_model = lgb.LGBMRegressor(**best_params)
final_model.fit(X_train, y_train)
# ---------------------------
# STEP E: SAVE MODEL FOR FUTURE PREDICTIONS
# ---------------------------

joblib.dump(final_model, f"D:/FYPs/ffyypp/ffyypp/backend/trainedModels/lgb_optuna_final_model_{city}.pkl")
print("\nModel saved as 'lgb_optuna_final_model.pkl'")