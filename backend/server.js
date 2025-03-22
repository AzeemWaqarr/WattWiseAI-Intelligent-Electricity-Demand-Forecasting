import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import { Parser } from 'json2csv';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { exec } from 'child_process';
import { spawn } from 'child_process';
// Fix for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/wattwiseai', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Multer Setup to temporarily store the file
const upload = multer({ dest: 'uploads/' });

//Routes//

app.get('/api/specific-result-csv', (req, res) => {
  const filePath = path.join(__dirname, 'Result', 'SpecificResult.csv');

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('SpecificResult.csv not found');
  }

  res.setHeader('Content-Type', 'text/csv');
  fs.createReadStream(filePath).pipe(res);
});


app.get('/api/consumption-summary_dashboard/:city', (req, res) => {
  const { city } = req.params;

  exec(`python ./scripts/dashboard_stats_calc.py "${city}"`, (err, stdout, stderr) => {
    if (err) {
      console.error('Python Script Error:', err);
      return res.status(500).json({ error: 'Script execution failed' });
    }

    try {
      const result = JSON.parse(stdout);
      res.status(200).json(result);
    } catch (e) {
      console.error('JSON Parse Error:', e);
      res.status(500).json({ error: 'Failed to parse script output' });
    }
  });
});
// Route: Get consumption summary stats from local predictionResult CSV
app.get('/api/consumption-summary/:city', (req, res) => {
  const { city } = req.params;

  exec(`python ./scripts/consumption_stats_calc.py "${city}"`, (err, stdout, stderr) => {
    if (err) {
      console.error('Python Script Error:', err);
      return res.status(500).json({ error: 'Script execution failed' });
    }

    try {
      const result = JSON.parse(stdout);
      res.status(200).json(result);
    } catch (e) {
      console.error('JSON Parse Error:', e);
      res.status(500).json({ error: 'Failed to parse script output' });
    }
  });
});

app.get('/api/weekday-demand/:city', (req, res) => {
  const { city } = req.params;
  exec(`python ./scripts/weekday_demand.py "${city}"`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: 'Script error' });
    try {
      const result = JSON.parse(stdout);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).json({ error: 'Parsing error' });
    }
  });
});

app.get('/api/holiday-demand/:city', async (req, res) => {
  const { city } = req.params;
  const { exec } = await import('child_process');
  const path = `./scripts/holiday_analysis.py`;

  exec(`python ${path} "${city}"`, (err, stdout, stderr) => {
    if (err) {
      console.error('Holiday Demand Script Error:', err);
      return res.status(500).json({ error: 'Script execution failed' });
    }
    try {
      const parsed = JSON.parse(stdout);
      return res.status(200).json(parsed);
    } catch (e) {
      console.error("JSON Parse error:", e);
      return res.status(500).json({ error: 'Failed to parse script output' });
    }
  });
});

app.get('/api/seasonal-trends/:city', (req, res) => {
  const { city } = req.params;
  const command = `python ./scripts/seasonal_trends.py "${city}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error('Seasonal Trends Script Error:', err);
      return res.status(500).json({ error: 'Failed to generate seasonal trends' });
    }

    try {
      const data = JSON.parse(stdout);
      res.status(200).json(data);
    } catch (parseErr) {
      console.error('JSON Parse Error (Seasonal Trends):', parseErr);
      res.status(500).json({ error: 'Failed to parse seasonal trends output' });
    }
  });
});

app.get('/api/seasonal-trends_dashboard/:city', (req, res) => {
  const { city } = req.params;
  const command = `python ./scripts/seasonal_dashboard.py "${city}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error('Seasonal Trends Script Error:', err);
      return res.status(500).json({ error: 'Failed to generate seasonal trends' });
    }

    try {
      const data = JSON.parse(stdout);
      res.status(200).json(data);
    } catch (parseErr) {
      console.error('JSON Parse Error (Seasonal Trends):', parseErr);
      res.status(500).json({ error: 'Failed to parse seasonal trends output' });
    }
  });
});


app.get('/api/tolerance-test/:city', (req, res) => {
  const { city } = req.params;

  exec(`python ./scripts/tolerance_test.py "${city}"`, (err, stdout, stderr) => {
    if (err) {
      console.error('Tolerance Script Error:', err);
      return res.status(500).json({ error: 'Tolerance script failed' });
    }

    try {
      const result = JSON.parse(stdout);
      res.status(200).json(result);
    } catch (parseErr) {
      console.error('JSON Parse Error:', parseErr);
      res.status(500).json({ error: 'Failed to parse tolerance results' });
    }
  });
});

app.get('/api/generate-chart-image/:city', (req, res) => {
  const { city } = req.params;
  exec(`python ./scripts/dashboard_plot.py "${city}"`, (err) => {
    if (err) return res.status(500).json({ error: 'Chart generation failed' });
    return res.status(200).json({ message: 'Chart image generated successfully' });
  });
});


app.get('/api/actual-vs-predicted/:city', async (req, res) => {
  const { city } = req.params;
  const { exec } = await import('child_process');
  const path = `./scripts/consumption_plot.py`;

  exec(`python ${path} "${city}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("Actual vs Predicted script error:", err);
      return res.status(500).json({ error: 'Script execution failed' });
    }

    try {
      const parsed = JSON.parse(stdout);
      return res.status(200).json(parsed);
    } catch (e) {
      console.error("JSON Parse error:", e);
      return res.status(500).json({ error: 'Failed to parse script output' });
    }
  });
});
app.get('/api/actual-vs-predicted_dashboard/:city', async (req, res) => {
  const { city } = req.params;
  const { exec } = await import('child_process');
  const path = `./scripts/dashboard_plot.py`;

  exec(`python ${path} "${city}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("Actual vs Predicted script error:", err);
      return res.status(500).json({ error: 'Script execution failed' });
    }

    try {
      const parsed = JSON.parse(stdout);
      return res.status(200).json(parsed);
    } catch (e) {
      console.error("JSON Parse error:", e);
      return res.status(500).json({ error: 'Failed to parse script output' });
    }
  });
});


app.get('/api/chartdata/:city', (req, res) => {
  const { city } = req.params;

  exec(`python ./scripts/dashboard_plot.py "${city}" "${city}"`, (err, stdout, stderr) => {
    if (err) {
      console.error('Chart Data Script Error:', err);
      return res.status(500).json({ error: 'Failed to generate chart data' });
    }

    try {
      const chartJson = JSON.parse(stdout);
      res.status(200).json(chartJson);
    } catch (parseErr) {
      console.error('JSON Parse Error:', parseErr);
      res.status(500).json({ error: 'Failed to parse chart data output' });
    }
  });
});


// In server.js
app.get('/api/prediction-result/:city', async (req, res) => {
  const { city } = req.params;
  // const fs = require('fs');
  // const path = require('path');
  // const csvParser = require('csv-parser');
  const filePath = path.join(__dirname, `Result/SpecificResult.csv`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Prediction result not found' });
  }

  const results = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => res.status(200).json(results))
    .on('error', () => res.status(500).json({ error: 'Failed to parse prediction result' }));
});


// Route to fetch model specs after prediction
app.get('/api/model-specs/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const specs = await mongoose.connection.db.collection('model_specs').findOne({ city });

    if (!specs) return res.status(404).json({ error: 'No specs found for this city' });

    res.status(200).json(specs);
  } catch (err) {
    console.error('Model Specs Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch model specs' });
  }
});

app.post('/api/predict', async (req, res) => {
  try {
    const { cityName, startDate, endDate, modelType } = req.body;

    if (!cityName || !startDate || !endDate || !modelType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let scriptPath = '';
    if (modelType === 'fast') {
      scriptPath = './scripts/predict_fast.py';
    } else if (modelType === 'hybrid') {
      scriptPath = './scripts/predict_hybrid.py';
    } else {
      return res.status(400).json({ error: 'Invalid model type' });
    }

    const { exec } = await import('child_process');
    const command = `python ${scriptPath} "${cityName}" "${startDate}" "${endDate}"`;

    console.log(`✅ Prediction Script Started\n`)
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Prediction Script Error: ${err.message}`);
        return res.status(500).json({ error: 'Prediction failed' });
      }
      if (stderr) {
        console.warn(`⚠️ Prediction Script Warning: ${stderr}`);
      }

      console.log(`✅ Prediction Script Output:\n${stdout}`);
      res.status(200).json({ message: `Prediction complete using ${modelType} model`, output: stdout });
    });
  } catch (err) {
    console.error('Prediction Route Error:', err);
    res.status(500).json({ error: '❌ Failed to execute prediction' });
  }
});


app.get('/api/download-training-file/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const collection = mongoose.connection.db.collection('data_trainingdata');

    const fileDoc = await collection.findOne({ filename: `${city}_TrainingData.csv` });
    if (!fileDoc || !fileDoc.fileData) {
      return res.status(404).json({ error: 'City training file not found' });
    }

    const buffer = Buffer.from(fileDoc.fileData.buffer || fileDoc.fileData);
    const savePath = path.join(__dirname, 'trainingdata');
    const saveFile = path.join(savePath, `${city}_TrainingData.csv`);

    if (!fs.existsSync(savePath)) fs.mkdirSync(savePath, { recursive: true });

    fs.writeFileSync(saveFile, buffer);
    console.log(`✅ Saved training file for ${city} to: ${saveFile}`);

    res.status(200).send(buffer); // Just respond with file blob
  } catch (err) {
    console.error('Download Training File Error:', err);
    res.status(500).json({ error: '❌ Failed to download training file' });
  }
});

app.post('/api/train-model', async (req, res) => {
  try {
    const { modelType, cityName } = req.body;

    if (!modelType || !cityName) {
      return res.status(400).json({ error: 'Model type and city name are required' });
    }

    let scriptPath = '';
    if (modelType === 'ANN') {
      scriptPath = './scripts/train_ann.py';
    } else if (modelType === 'LightGBM') {
      scriptPath = './scripts/train_lightgbm.py';
    } else {
      return res.status(400).json({ error: 'Invalid model type' });
    }

    // 🔽 STEP 1: Download the city's training data from MongoDB
    const collection = mongoose.connection.db.collection('data_trainingdata');
    const fileDoc = await collection.findOne({ filename: `${cityName}_TrainingData.csv` });

    if (!fileDoc || !fileDoc.fileData) {
      return res.status(404).json({ error: `❌ Training file for ${cityName}_TrainingData.csv not found.` });
    }

    const buffer = Buffer.from(fileDoc.fileData.buffer || fileDoc.fileData);
    const savePath = path.join(__dirname, 'trainingData');
    const saveFile = path.join(savePath, `${cityName}_TrainingData.csv`);

    if (!fs.existsSync(savePath)) fs.mkdirSync(savePath, { recursive: true });
    fs.writeFileSync(saveFile, buffer);
    console.log(`✅ Training file saved at: ${saveFile}`);

    // ✅ STEP 2: Spawn the Python training script
    const pythonProcess = spawn('python', [scriptPath, cityName]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`📤 STDOUT: ${data.toString()}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`❌ STDERR: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Training completed successfully.`);
        return res.status(200).json({ message: `Model training for ${modelType} on ${cityName} completed.` });
      } else {
        console.error(`❌ Training process exited with code ${code}`);
        return res.status(500).json({ error: `Training process exited with code ${code}` });
      }
    });

  } catch (err) {
    console.error('Train Model Route Error:', err);
    res.status(500).json({ error: '❌ Failed to initiate model training' });
  }
});



//Route for processing on city selection
app.post('/api/process-city', async (req, res) => {
  try {
    const cityName = req.body.city;
    if (!cityName) return res.status(400).json({ error: 'City name is required' });

    const collection = mongoose.connection.db.collection('data_cities');
    const cityDoc = await collection.findOne({ filename: `${cityName}.csv` });

    if (!cityDoc || !cityDoc.fileData) {
      return res.status(404).json({ error: '❌ City dataset not found in database' });
    }

    const buffer = Buffer.from(cityDoc.fileData.buffer || cityDoc.fileData);
    const savePath = path.join(__dirname, 'city');
    const saveFile = path.join(savePath, `${cityName}.csv`);

    if (!fs.existsSync(savePath)) fs.mkdirSync(savePath, { recursive: true });
    fs.writeFileSync(saveFile, buffer);
    console.log(`📁 Saved city dataset to: ${saveFile}`);

    // Run the Python script and wait for it to complete
    exec(`python ./scripts/noaa_downloader.py "${cityName}"`, async (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Script Error: ${err.message}`);
        return res.status(500).json({ error: `Script Error: ${err.message}` });
      }
      if (stderr) console.warn(`⚠️ Script Warning: ${stderr}`);
      console.log(`✅ NOAA Script Output:\n${stdout}`);

      // Upload all files in the download dir to MongoDB
      const downloadDir = path.join(__dirname, 'city');
      const files = fs.readdirSync(downloadDir);
      const trainingCollection = mongoose.connection.db.collection('data_trainingdata');

      for (const file of files) {
        if (file.endsWith('.csv') && file.startsWith(cityName)) {
          const filePath = path.join(downloadDir, file);
          const fileBuffer = fs.readFileSync(filePath);
          const stats = fs.statSync(filePath);
          const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

          // Insert into training data collection
          await trainingCollection.insertOne({
            filename: file,
            fileData: fileBuffer,
            contentType: 'text/csv',
            uploaded: new Date(),
          });

          // Insert metadata
          await mongoose.connection.db.collection('dataset_metadata').insertOne({
            name: file,
            category: 'trainingdata',
            size: `${fileSizeMB} MB`,
            uploaded: new Date(),
            status: 'Processed'
          });
        }
      }

      return res.status(200).json({ message: `✅ City ${cityName} processed & files uploaded.` });
    });

  } catch (err) {
    console.error('Process City Error:', err);
    res.status(500).json({ error: '❌ Failed to process city data' });
  }
});


//Route to Get Cities
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await mongoose.connection.db.collection('data_cities').distinct('filename');
    const cleanCityNames = cities.map(name => name.replace('.csv', '').trim());
    res.status(200).json(cleanCityNames);
  } catch (err) {
    console.error('City Fetch Error:', err);
    res.status(500).json({ error: '❌ Failed to fetch cities' });
  }
});

// Route to Edit User Route
app.put('/api/users/:id', async (req, res) => {
  try {
    const { email, role } = req.body;
    const updated = await User.findByIdAndUpdate(req.params.id, { email, role }, { new: true });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User updated successfully!' });
  } catch (err) {
    console.error('Edit User Error:', err);
    res.status(500).json({ error: '❌ Failed to update user' });
  }
});

// Route to Delete User Route
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: '✅ User deleted successfully' });
  } catch (err) {
    console.error('Delete User Error:', err);
    res.status(500).json({ error: '❌ Failed to delete user' });
  }
});


// Route: Get dynamic user statistics
app.get('/api/user-stats', async (req, res) => {
  try {
    const users = await User.find({});
    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const endUserCount = users.filter(u => u.role === 'endUser').length;
    const activeUsers = totalUsers - Math.floor(Math.random() * 4); // simulate active users

    res.status(200).json({
      totalUsers,
      adminCount,
      endUserCount,
      activeUsers,
      pendingInvites: 3 // you can dynamically track this later
    });
  } catch (err) {
    console.error('User Stats Error:', err);
    res.status(500).json({ error: '❌ Failed to fetch user stats' });
  }
});


// Route: Get All Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude passwords
    res.status(200).json(users);
  } catch (err) {
    console.error('Fetch Users Error:', err);
    res.status(500).json({ error: '❌ Failed to fetch users' });
  }
});


//Route to Export Report
app.get('/api/export-report', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const datasets = await db.collection('dataset_metadata').find({}).toArray();
    const activity = await db.collection('activity_logs').find({}).sort({ timestamp: -1 }).limit(50).toArray();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalDatasets = datasets.length;
    const totalSizeMB = datasets.reduce((acc, ds) => acc + parseFloat(ds.size?.replace(' MB', '') || 0), 0);
    const thisMonthCount = datasets.filter(ds => {
      const d = new Date(ds.uploaded);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    // CSV content builder
    let csvContent = '';

    // Database Stats Section
    csvContent += '=== DATABASE STATISTICS ===\n';
    csvContent += `Total Datasets,${totalDatasets}\n`;
    csvContent += `Total Size (MB),${totalSizeMB.toFixed(2)}\n`;
    csvContent += `Datasets Added This Month,${thisMonthCount}\n\n`;

    // Dataset Metadata Section
    csvContent += '=== DATASET METADATA ===\n';
    if (datasets.length > 0) {
      const datasetFields = ['name', 'category', 'size', 'uploaded', 'status'];
      const dsParser = new Parser({ fields: datasetFields });
      const dsCsv = dsParser.parse(
        datasets.map(ds => ({
          name: ds.name,
          category: ds.category,
          size: ds.size,
          uploaded: new Date(ds.uploaded).toLocaleString(),
          status: ds.status
        }))
      );
      csvContent += dsCsv + '\n\n';
    } else {
      csvContent += 'No datasets available\n\n';
    }

    // Activity Logs Section
    csvContent += '=== RECENT ACTIVITY LOGS ===\n';
    if (activity.length > 0) {
      const activityFields = ['action', 'details', 'time', 'user'];
      const actParser = new Parser({ fields: activityFields });
      const actCsv = actParser.parse(
        activity.map(log => ({
          action: log.action,
          details: log.details,
          time: new Date(log.timestamp).toLocaleString(),
          user: log.user
        }))
      );
      csvContent += actCsv;
    } else {
      csvContent += 'No recent activity logs found\n';
    }

    // Send response
    res.setHeader('Content-Disposition', 'attachment; filename=database_report.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvContent);
  } catch (err) {
    console.error('Export Report Error:', err);
    res.status(500).json({ error: '❌ Failed to generate report' });
  }
});

//Route to get Performance Metrics
app.get('/api/performance-metrics', async (req, res) => {
  try {
    const startRead = Date.now();
    // Simulate 5 quick reads
    const reads = await Promise.all([
      mongoose.connection.db.collection('dataset_metadata').findOne({}),
      mongoose.connection.db.collection('dataset_metadata').findOne({}),
      mongoose.connection.db.collection('dataset_metadata').findOne({}),
      mongoose.connection.db.collection('dataset_metadata').findOne({}),
      mongoose.connection.db.collection('dataset_metadata').findOne({})
    ]);
    const readTime = (Date.now() - startRead) / 5; // Average read time in ms

    const startWrite = Date.now();
    // Simulate 5 quick writes to a dummy collection
    for (let i = 0; i < 5; i++) {
      await mongoose.connection.db.collection('temp_write_metrics').insertOne({ temp: Math.random() });
    }
    const writeTime = (Date.now() - startWrite) / 5; // Average write time in ms

    // Clean up temp writes
    await mongoose.connection.db.collection('temp_write_metrics').drop();

    // Get uptime in seconds from serverStatus
    const status = await mongoose.connection.db.admin().serverStatus();
    const uptime = status.uptime; // seconds
    const uptimeFormatted = `${Math.floor(uptime / 3600)} hrs ${Math.floor((uptime % 3600) / 60)} mins`;

    res.status(200).json({
      readTime: `${readTime.toFixed(2)} ms`,
      writeTime: `${writeTime.toFixed(2)} ms`,
      uptime: uptimeFormatted,
      cacheHitRate: `${(Math.random() * (95 - 85) + 85).toFixed(2)}%` // simulated
    });
  } catch (err) {
    console.error('Performance Metrics Error:', err);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

// Route: Get recent database activity
app.get('/api/recent-activity', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const activity = await db.collection('dataset_metadata')
      .find({})
      .sort({ uploaded: -1 })
      .limit(10)
      .toArray();

    const formattedActivity = activity.map(item => ({
      action: 'Dataset uploaded',
      details: `${item.name} (${item.size})`,
      time: new Date(item.uploaded).toLocaleString(),
      user: 'System Automation', // Placeholder — later you can replace this with real user info
    }));

    res.status(200).json(formattedActivity);
  } catch (err) {
    console.error('Recent Activity Error:', err);
    res.status(500).json({ error: '❌ Failed to fetch recent activity' });
  }
});

// Route: Get dynamic Database Stats
app.get('/api/db-stats', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const metadata = await db.collection('dataset_metadata').find({}).toArray();

    // Total Datasets
    const totalDatasets = metadata.length;

    // Total Size in MB
    const totalSizeMB = metadata.reduce((acc, curr) => {
      const size = parseFloat(curr.size?.replace(' MB', '') || 0);
      return acc + size;
    }, 0);

    // Datasets uploaded this month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthDatasets = metadata.filter(ds => {
      const uploadedDate = new Date(ds.uploaded);
      return uploadedDate.getMonth() === currentMonth && uploadedDate.getFullYear() === currentYear;
    });

    const thisMonthCount = thisMonthDatasets.length;
    const thisMonthSize = thisMonthDatasets.reduce((acc, ds) => {
      const size = parseFloat(ds.size?.replace(' MB', '') || 0);
      return acc + size;
    }, 0);

    // Data Distribution by Category
    const categoryCounts = {
      trainingdata: 0,
      testingdata: 0,
      validationdata: 0,
      historicaldata: 0,
    };

    metadata.forEach(ds => {
      const category = ds.category?.toLowerCase();
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      }
    });

    const distribution = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      percentage: totalDatasets > 0 ? ((count / totalDatasets) * 100).toFixed(2) : '0.00'
    }));

    // 🔥 Total Records Calculation (Sum of document count from each collection)
    const categories = ['trainingdata', 'testingdata', 'validationdata', 'historicaldata'];
    let totalRecords = 0;

    for (const cat of categories) {
      const collectionName = `data_${cat}`;
      const exists = await db.listCollections({ name: collectionName }).hasNext();
      if (exists) {
        const count = await db.collection(collectionName).countDocuments();
        totalRecords += count;
      }
    }

    res.status(200).json({
      totalDatasets,
      totalSizeMB: totalSizeMB.toFixed(2),
      thisMonthCount,
      thisMonthSize: thisMonthSize.toFixed(2),
      totalRecords,
      distribution
    });

  } catch (err) {
    console.error('DB Stats Error:', err);
    res.status(500).json({ error: '❌ Failed to fetch DB stats' });
  }
});



//Database Ping route
app.get('/api/db-ping', async (req, res) => {
  const start = Date.now();
  try {
    await mongoose.connection.db.command({ ping: 1 });
    const pingTime = Date.now() - start;
    res.status(200).json({ ping: `${pingTime}ms` });
  } catch (err) {
    console.error('❌ DB Ping Error:', err);
    res.status(500).json({ ping: 'Unavailable' });
  }
});

//Size of Database Route
app.get('/api/storage-size', async (req, res) => {
  try {
    const datasets = await mongoose.connection.db.collection('dataset_metadata').find({}).toArray();

    let totalSize = 0;
    datasets.forEach(ds => {
      if (ds.size) {
        const mb = parseFloat(ds.size.replace('MB', '').trim());
        if (!isNaN(mb)) totalSize += mb;
      }
    });

    res.status(200).json({ totalSize: totalSize.toFixed(2) + ' MB' });
  } catch (err) {
    console.error('Storage Size Error:', err);
    res.status(500).json({ error: 'Failed to calculate storage size' });
  }
});

// Upload Route
app.post('/api/upload-csv', upload.single('file'), async (req, res) => {
  try {
    const category = req.body.category?.toLowerCase() || 'trainingdata';
    const collectionName = `data_${category}`;
    const filePath = path.join('uploads', req.file.filename);

    // Read file as binary buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Insert the file buffer as a document into category collection
    await mongoose.connection.db.collection(collectionName).insertOne({
      filename: req.file.originalname,
      fileData: fileBuffer,
      contentType: req.file.mimetype,
      uploaded: new Date(),
    });

    // Save metadata separately
    await mongoose.connection.db.collection('dataset_metadata').insertOne({
      name: req.file.originalname,
      category: category,
      size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploaded: new Date(),
      status: 'Processed',
    });
    // // Run NOAA downloader script
    // exec('python ./scripts/noaa_downloader.py', (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`❌ NOAA Script Error: ${error.message}`);
    //     return;
    //   }
    //   if (stderr) {
    //     console.error(`⚠️ NOAA Script Stderr: ${stderr}`);
    //   }
    //   console.log(`📄 NOAA Script Output:\n${stdout}`);
    // });

    // Delete temporary uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({ message: '✅ File uploaded and stored in MongoDB collection successfully!' });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: '❌ File upload failed.' });
  }
});

// Get Datasets Metadata
app.get('/api/datasets', async (req, res) => {
  try {
    const datasets = await mongoose.connection.db.collection('dataset_metadata')
      .find({})
      .sort({ uploaded: -1 })
      .toArray();
    res.status(200).json(datasets);
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to fetch datasets' });
  }
});

// Route for Previewing top 10 rows
app.get('/api/preview/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const category = req.query.category?.toLowerCase() || 'trainingdata';
    const collectionName = `data_${category}`;
    const db = mongoose.connection.db;

    const fileDoc = await db.collection(collectionName).findOne({ filename });
    if (!fileDoc || !fileDoc.fileData) {
      return res.status(404).json({ error: '❌ File not found for preview' });
    }

    // Ensure buffer is correctly constructed
    const buffer = Buffer.from(fileDoc.fileData.buffer || fileDoc.fileData);

    const results = [];

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    readable
      .pipe(csvParser())
      .on('data', (row) => {
        if (results.length < 10) results.push(row);
      })
      .on('end', () => {
        res.status(200).json(results);
      })
      .on('error', (err) => {
        console.error('CSV Parsing Error:', err);
        res.status(500).json({ error: '❌ CSV parsing failed' });
      });

  } catch (err) {
    console.error('Preview Error:', err);
    res.status(500).json({ error: '❌ Failed to preview dataset' });
  }
});

// Download Route
app.get('/api/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const category = req.query.category?.toLowerCase() || 'trainingdata';
    const collectionName = `data_${category}`;
    const db = mongoose.connection.db;

    const fileDoc = await db.collection(collectionName).findOne({ filename });
    if (!fileDoc || !fileDoc.fileData) {
      return res.status(404).json({ error: '❌ File not found' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${fileDoc.filename}"`);
    res.setHeader('Content-Type', fileDoc.contentType);
    res.send(fileDoc.fileData.buffer);
  } catch (err) {
    console.error('Download Error:', err);
    res.status(500).json({ error: '❌ Download failed' });
  }
});

//Route to Delete File Data
app.delete('/api/delete/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const category = req.query.category?.toLowerCase() || 'trainingdata';
    const dataCollection = `data_${category}`;
    const db = mongoose.connection.db;

    // Delete from file collection
    const deleteDataResult = await db.collection(dataCollection).deleteOne({ filename });

    // Delete metadata
    const deleteMetaResult = await db.collection('dataset_metadata').deleteOne({ name: filename });

    if (deleteDataResult.deletedCount === 0 && deleteMetaResult.deletedCount === 0) {
      return res.status(404).json({ error: '❌ Dataset not found for deletion' });
    }

    res.status(200).json({ message: '✅ Dataset deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ error: '❌ Failed to delete dataset' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const newUser = new User({ email, password, role });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });

  } catch (err) {
    console.error('Register Error:', err.message, err.stack);
    res.status(500).json({ error: '❌ User creation failed', detail: err.message });
  }
});


// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.password !== password) return res.status(400).json({ error: 'Incorrect password' });
    if (user.role !== role) return res.status(400).json({ error: 'Role mismatch' });

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: '❌ Login failed' });
  }
});

app.listen(port, () => {
  console.log(`🚀 WattWise backend running on port ${port}`);
});
