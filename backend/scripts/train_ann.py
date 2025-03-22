import sys
city = sys.argv[1]
print(f"Training ANN model for city: {city}")
#ANNSIMPLE
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.preprocessing import MinMaxScaler
import shap
import joblib

# ===========================
# 1. Data Preparation
# ===========================
train_df = pd.read_csv(f'D:/FYPs/ffyypp/ffyypp/backend/trainingData/{city}_TrainingData.csv')
train_df['DATE'] = pd.to_datetime(train_df['DATE'])
train_df = train_df.drop(columns=['DATE'])

features = ['Season', 'TMP', 'HUMIDITY', 'Hour Number', 'Weekday', 'Month', 'Public Holiday', 'Wind Speed', 'Rainfall/Snowfall']
target = 'Demand (MW)'

X = train_df[features].values
y = train_df[target].values

# Scale features
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# ===========================
# 2. Build and Train Model with Best Parameters
# ===========================
best_params = {
    'num_layers': 2,
    'units_input': 128,
    'activation': 'relu',
    'dropout_input': 0.4,
    'optimizer': 'adam',
    'lr': 0.0005680056750237966,
    'units_layer_0': 192,
    'dropout_layer_0': 0.1,
    'units_layer_1': 192,
    'dropout_layer_1': 0.3
}

def build_best_model(params):
    model = Sequential()
    model.add(Dense(params['units_input'], activation=params['activation'], input_shape=(X_scaled.shape[1],)))
    model.add(BatchNormalization())
    model.add(Dropout(params['dropout_input']))

    for i in range(params['num_layers']):
        model.add(Dense(params[f'units_layer_{i}'], activation=params['activation']))
        model.add(BatchNormalization())
        model.add(Dropout(params[f'dropout_layer_{i}']))

    model.add(Dense(1))

    # Select optimizer
    optimizer = tf.keras.optimizers.Adam(learning_rate=params['lr'])

    model.compile(optimizer=optimizer, loss='mean_squared_error')
    return model

best_model = build_best_model(best_params)

# Define Early Stopping
early_stopping = EarlyStopping(
    monitor='loss',      # Monitor training loss
    patience=10,         # Stop if no improvement after 10 epochs
    restore_best_weights=True # Restore best weights after stopping
)

# Train the model with Early Stopping
best_model.fit(
    X_scaled, y,
    epochs=200,
    batch_size=16,
    verbose=1,
    callbacks=[early_stopping]  # Add early stopping
)

# Save the trained model
best_model.save(f'D:/FYPs/ffyypp/ffyypp/backend/trainedModels/ann_best_model_optuna_{city}.h5')
print("Best model has been saved.")

# ===========================
# 3. Model Interpretability using SHAP
# ===========================
background = X_scaled[np.random.choice(X_scaled.shape[0], 100, replace=False)]
explainer = shap.KernelExplainer(best_model.predict, background)

X_sample = X_scaled[:50]
shap_values = explainer.shap_values(X_sample)

# Fix indexing issue by converting feature names to a NumPy array
shap.summary_plot(shap_values, X_sample, feature_names=np.array(features))

# ===========================
# 4. Save Scaler for Test Data Processing
# ===========================
joblib.dump(scaler, f'D:/FYPs/ffyypp/ffyypp/backend/trainedModels/scaler_{city}.pkl')
print("Scaler has been saved.")