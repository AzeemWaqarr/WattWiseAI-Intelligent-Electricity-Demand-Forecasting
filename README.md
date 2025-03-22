# ⚡ WattWiseAI - Intelligent Electricity Demand Forecasting System

WattWiseAI is an advanced AI-powered energy consumption forecasting platform designed to provide highly accurate electricity demand predictions. This system utilizes hybrid machine learning models (ANN + LightGBM), enriched data features, and dynamic analytics to empower energy planners, utilities, and consumers to make informed energy management decisions.

---

## 📌 Features

- 🌐 Role-Based Dashboard (Admin & EndUser)
- 🧠 AI Forecasting Models: ANN, LightGBM, Hybrid Ensemble
- 📊 Dynamic Data Upload & Management (CSV)
- 📈 Real-time Prediction Visualization (Daily, Seasonal, Tolerance Accuracy, etc.)
- 🗃️ MongoDB Data Storage & Stats Monitoring
- 📂 Dataset Export (CSV, PDF)
- 🧪 Training & Testing Pipeline with Historical Data
- 🔍 Actual vs Predicted Demand Analysis
- 📎 Model Summary Metrics (Confidence, Peak Load Time, etc.)
- 🕹️ Full Admin Control on Users, License Requests & System Health

---

## 🔧 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Recharts, Framer Motion
- **Backend:** Node.js (Express.js), Python (Flask for ML scripts)
- **Database:** MongoDB (Atlas + Compass)
- **Storage:** MongoDB Collections or GridFS (for large files)
- **ML Models:** ANN (Keras/Tensorflow), LightGBM with Optuna, SHAP for interpretability

---

## 🗂️ Project Structure

wattwiseai/ │ ├── frontend/ │ ├── src/ │ │ ├── components/ │ │ ├── screens/ │ │ ├── App.js │ │ └── index.js │ └── public/ │ ├── backend/ │ ├── server.js (Express server) │ ├── routes/ │ │ ├── authRoutes.js │ │ ├── datasetRoutes.js │ │ ├── predictionRoutes.js │ │ ├── trainingRoutes.js │ │ └── userRoutes.js │ ├── scripts/ │ │ ├── ann_train.py │ │ ├── lightgbm_train.py │ │ ├── hybrid_predict.py │ │ ├── tolerance_accuracy.py │ │ └── seasonal_analysis.py │ └── Result/, City/, Model/, Dataset/ │ └── mongo/ └── wattwiseai database (data_trainingdata, data_testingdata, model_specs, user_data, license_requests etc.)


## 🚀 Getting Started

### 1. Clone the Repository

git clone https://github.com/yourusername/wattwiseai.git
cd wattwiseai
2. Setup Backend (Express + Flask)

cd backend
npm install         # Install Express dependencies
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
3. Setup Frontend (React.js)

cd frontend
npm install
npm start
4. MongoDB Configuration
Create a MongoDB Atlas Cluster or use MongoDB Compass.

Set your MongoDB URI in .env file in backend:


MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/wattwiseai
⚙️ Key Functionalities
🔐 Authentication
Signup / SignIn for Admin and EndUser

Role-based dashboard view

📁 Dataset Management
Upload datasets by category (Training, Testing, etc.)

Preview, download, delete datasets

Track metadata: name, size, records, upload date

📊 Prediction & Analysis
Select City → Run AI Model → View Predictions

View peak hour, expected usage, % change, confidence level

Charts: Actual vs Predicted, Seasonal Trends, Holiday Comparison, Tolerance Accuracy

🔬 Model Training
Train ANN or LightGBM model for selected city

Hyperparameter tuning via Optuna

Training history storage

📋 License Management (Admin Panel)
End users can apply/renew license

Admin approves/rejects license requests

Track license status, expiry, type

📸 UI Screenshots (Optional)
Dashboard (User & Admin)

Upload & Manage Data

Model Training Interface

Prediction Analysis Graphs

Add screenshots in /screenshots/ folder

📤 API Endpoints (Sample)
Method	Route	Description
POST	/api/signup	Register user
POST	/api/login	User login
GET	/api/user/:username	Get user profile
POST	/api/upload	Upload dataset
GET	/api/datasets	Fetch datasets
POST	/api/start-training	Trigger model training
POST	/api/predict	Trigger prediction
GET	/api/model-specs/:city	Fetch prediction summary
POST	/api/apply-license	Submit license request
🛡️ Future Enhancements
Auto-scheduler for prediction generation

Email notifications on model completion

Real-time database activity alerts

Interactive SHAP interpretability UI

Integration with power grid APIs

🤝 Contributing
Fork the repository

Create a new branch (git checkout -b feature-branch)

Commit your changes

Push to your branch

Submit a Pull Request

📄 License
This project is licensed under the MIT License.

💬 Contact
For queries or collaboration:
📧 [yourname@email.com]
🔗 LinkedIn

