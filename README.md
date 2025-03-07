# WattWiseAI – AI-Based Electricity Demand Forecasting ⚡

---

## 📌 Overview
WattWiseAI is an advanced electricity demand forecasting system designed to optimize power grid management. It utilizes a hybrid AI approach combining Artificial Neural Networks (ANN), LightGBM, and Random Forest to enhance prediction accuracy. The system analyzes historical consumption data, weather conditions, and seasonal trends, helping utility companies and energy managers make data-driven decisions.

---

## 🚀 Features
✅ AI-Powered Predictions – Uses ANN, LightGBM, and Random Forest for accurate forecasting. <br>
✅ Real-Time Forecasting – Provides live electricity demand predictions. <br>
✅ Interactive Dashboard – Built with React for seamless data visualization. <br>
✅ Scalable Backend – Developed using Node.js and Python. <br>
✅ Machine Learning Integration – Implements TensorFlow for deep learning models. <br>
✅ Scenario Analysis – Allows predictions under different conditions. <br>
✅ Secure & Efficient – Optimized for high performance and secure data handling. <br>

---

## 🛠️ Tech Stack
Frontend: React.js (Interactive UI, Graphs, and Reports) <br>
Backend: Node.js, Express.js, Python (API & Model Integration) <br>
Database: PostgreSQL / MongoDB (Historical Data Storage) <br>
Machine Learning Models: ANN (TensorFlow/Keras), LightGBM, Random Forest <br>
Data Handling: Pandas, NumPy, Scikit-learn <br>
Deployment: Docker, AWS/GCP for cloud hosting <br>

---

## 📂 Project Structure
📦 WattWiseAI  
├── 📄 README.md        # Documentation  
├── 📂 frontend         # React-based UI  
│   ├── src/components  # UI Components  
│   ├── src/pages       # Pages and Layouts  
│   ├── src/api         # API Calls to Backend  
├── 📂 backend          # Node.js and Python Backend  
│   ├── server.js       # Express Server  
│   ├── routes/         # API Routes  
│   ├── models/         # ML Models (ANN, LightGBM, Random Forest)  
│   ├── database/       # Data Processing and Storage  
├── 📂 ml_models        # Machine Learning Models  
│   ├── ann_model.py    # ANN Model Implementation  
│   ├── lightgbm_model.py  # LightGBM Model  
│   ├── random_forest.py   # Random Forest Model  
├── 📂 data             # Historical electricity and weather datasets  
├── 📂 scripts          # Data Preprocessing and Analysis Scripts  

---

## ⚡ How to Run the Project
#### 1️⃣ Clone the Repository
git clone https://github.com/AzeemWaqarr/WattWiseAI.git  
cd WattWiseAI  
#### 2️⃣ Install Dependencies
Backend (Node.js & Python)
cd backend  
npm install  # Install Node.js dependencies  
pip install -r requirements.txt  # Install Python dependencies  
Frontend (React.js)
cd frontend  
npm install  # Install frontend dependencies  
#### 3️⃣ Run the Backend
cd backend  
node server.js  # Start Node.js server  
#### 4️⃣ Run the Frontend
cd frontend  
npm start  # Start React UI  
#### 5️⃣ Train & Run the AI Model
cd ml_models  
python ann_model.py  # Train the ANN Model  
python lightgbm_model.py  # Train the LightGBM Model  
python random_forest.py  # Train the Random Forest Model  

---

## 📊 Model Performance & Comparisons
Model	MAE (Mean Absolute Error)	RMSE (Root Mean Square Error) <br>
ANN (TensorFlow)	2.34 MW	3.56 MW <br>
LightGBM	2.42 MW	3.71 MW <br>
Random Forest	2.50 MW	3.85 MW <br>

---

## 🛠 Future Enhancements
✅ Deploy AI models as a cloud-based API <br>
✅ Optimize model hyperparameters for improved accuracy <br>
✅ Introduce deep reinforcement learning for adaptive energy predictions <br>
✅ Expand the dataset for better seasonal trend analysis <br>

---

## 📬 Contact & Contributions
🚀 Contributions are welcome! Feel free to fork, submit PRs, or report issues.
📧 Email: azeem.waqarr@gmail.com
🔗 GitHub: AzeemWaqarr
