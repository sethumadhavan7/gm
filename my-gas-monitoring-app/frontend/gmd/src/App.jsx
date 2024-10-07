import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css'; // Ensure you create this file for custom styles

function App() {
  const [sensorData, setSensorData] = useState([]);
  const [error, setError] = useState(null);
  const [alertMessages, setAlertMessages] = useState({
    co2: '',
    nox: '',
    so2: '',
  });
  const [loading, setLoading] = useState(true); // Loading state

  const fetchSensorData = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get('https://gm-api-delta.vercel.app/api/gas-data'); // Updated API URL
      const data = response.data;

      // Log the fetched data to check its structure
      console.log('Fetched data:', data);

      // If the data is an object, convert it to an array
      const formattedData = Array.isArray(data) ? data : [data];

      setSensorData(formattedData);
      handleAlerts(formattedData[formattedData.length - 1]); // Handle alerts for the latest data
      setLoading(false); // Stop loading
    } catch (err) {
      setError('Error fetching sensor data');
      console.error(err);
      setLoading(false); // Stop loading even on error
    }
  };

  useEffect(() => {
    fetchSensorData();

    // Automatic refresh every 5 seconds
    const interval = setInterval(fetchSensorData, 5000); 

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  // Function to display alert messages based on gas levels
  const handleAlerts = (latestData) => {
    let co2Alert = '';
    let noxAlert = '';
    let so2Alert = '';

    // CO2 alert conditions
    if (latestData.co2 <= 1000) {
      co2Alert = 'CO2 level is normal';
    } else {
      co2Alert = 'CO2 level is high';
    }

    // NOx alert conditions
    if (latestData.nox <= 0.1) {
      noxAlert = 'NOx level is normal';
    } else {
      noxAlert = 'NOx level is high';
    }

    // SO2 alert conditions
    if (latestData.so2 <= 0.1) {
      so2Alert = 'SO2 level is normal';
    } else {
      so2Alert = 'SO2 level is high';
    }

    // Set alert messages
    setAlertMessages({
      co2: co2Alert,
      nox: noxAlert,
      so2: so2Alert,
    });
  };

  // Prepare data for charts
  const pulseData = {
    labels: sensorData.map((_, index) => `Reading ${index + 1}`),
    datasets: [{
      label: 'CO2 Levels (ppm)',
      data: sensorData.map(item => item.co2),
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
    }],
  };

  const noxData = {
    labels: sensorData.map((_, index) => `Reading ${index + 1}`),
    datasets: [{
      label: 'NOx Levels (ppm)',
      data: sensorData.map(item => item.nox),
      borderColor: 'rgba(255, 99, 132, 1)',
      fill: false,
    }],
  };

  const so2Data = {
    labels: sensorData.map((_, index) => `Reading ${index + 1}`),
    datasets: [{
      label: 'SO2 Levels (ppm)',
      data: sensorData.map(item => item.so2),
      borderColor: 'rgba(54, 162, 235, 1)',
      fill: false,
    }],
  };

  return (
    <div className="App">
      <h1>Gas Monitoring Dashboard</h1>

      {loading && <p>Loading sensor data...</p>}
      {error && <p className="error">{error}</p>}

      {/* Sensor boxes for CO2, NOx, and SO2 */}
      <div className="sensor-boxes">
        <div className="sensor-box">
          <h2>CO2 Level</h2>
          <p className="co2-value">{sensorData.length > 0 ? sensorData[sensorData.length - 1].co2 : '--'} ppm</p>
          <div className={`alert ${alertMessages.co2.includes('high') ? 'alert-high' : ''}`}>
            {alertMessages.co2}
          </div>
        </div>
        <div className="sensor-box">
          <h2>NOx Level</h2>
          <p className="nox-value">{sensorData.length > 0 ? sensorData[sensorData.length - 1].nox : '--'} ppm</p>
          <div className={`alert ${alertMessages.nox.includes('high') ? 'alert-high' : ''}`}>
            {alertMessages.nox}
          </div>
        </div>
        <div className="sensor-box">
          <h2>SO2 Level</h2>
          <p className="so2-value">{sensorData.length > 0 ? sensorData[sensorData.length - 1].so2 : '--'} ppm</p>
          <div className={`alert ${alertMessages.so2.includes('high') ? 'alert-high' : ''}`}>
            {alertMessages.so2}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-container">
        <Line data={pulseData} />
      </div>
      <div className="chart-container">
        <Line data={noxData} />
      </div>
      <div className="chart-container">
        <Line data={so2Data} />
      </div>
    </div>
  );
}

export default App;
