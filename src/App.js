import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import Forecast from './components/Forecast';
import ThemeToggle from './components/ThemeToggle';

function App() {
  // STATE MANAGEMENT
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');
  const [unit, setUnit] = useState('metric');
  
  //API KEY 
  const API_KEY = '6b3cbcd7a6552311d1f9486be388d0e5'; 
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${city}&units=${unit}&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('City not found. Try: New York, London, Tokyo, Paris, Sydney');
      }
      
      const weather = await weatherResponse.json();
      setWeatherData(weather);
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
      );
      
      const forecast = await forecastResponse.json();
      
      // Get one forecast per day at 12:00 PM
      const dailyForecast = forecast.list.filter(item => 
        item.dt_txt.includes('12:00:00')
      ).slice(0, 5);
      
      setForecastData(dailyForecast);
      
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWeatherData('New York');
  }, [unit]);

  const handleSearch = (city) => {
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': 'fas fa-sun',
      'Clouds': 'fas fa-cloud',
      'Rain': 'fas fa-cloud-rain',
      'Snow': 'fas fa-snowflake',
      'Thunderstorm': 'fas fa-bolt',
      'Drizzle': 'fas fa-cloud-sun-rain',
      'Mist': 'fas fa-smog',
      'Fog': 'fas fa-smog',
      'Haze': 'fas fa-smog'
    };
    return icons[condition] || 'fas fa-cloud';
  };

  return (
    <div className={`app ${theme}-theme`}>
      <div className="weather-container">
        <header className="header">
          <h1><i className="fas fa-cloud-sun"></i> React Weather App</h1>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </header>

        <SearchBar onSearch={handleSearch} loading={loading} />
        
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading weather data...</p>
          </div>
        )}

        {weatherData && !loading && (
          <>
            <WeatherCard 
              weather={weatherData}
              unit={unit}
              toggleUnit={toggleUnit}
              getWeatherIcon={getWeatherIcon}
            />
            
            <Forecast 
              forecast={forecastData}
              unit={unit}
              getWeatherIcon={getWeatherIcon}
            />
          </>
        )}

        <div className="features">
          <h3><i className="fas fa-star"></i> React Concepts Demonstrated</h3>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-cube"></i>
              <h4>Components & Props</h4>
              <p>5 reusable components with props</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-database"></i>
              <h4>State Management</h4>
              <p>useState & useEffect hooks</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-cloud-download-alt"></i>
              <h4>API Integration</h4>
              <p>OpenWeatherMap API with error handling</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-exchange-alt"></i>
              <h4>Event Handling</h4>
              <p>Search, toggle, and theme events</p>
            </div>
          </div>
        </div>

        <div className="quick-cities">
          <p><i className="fas fa-lightbulb"></i> Try these cities:</p>
          <div className="city-buttons">
            <button onClick={() => handleSearch('London')}>London</button>
            <button onClick={() => handleSearch('Tokyo')}>Tokyo</button>
            <button onClick={() => handleSearch('Paris')}>Paris</button>
            <button onClick={() => handleSearch('Sydney')}>Sydney</button>
            <button onClick={() => handleSearch('Dubai')}>Dubai</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;