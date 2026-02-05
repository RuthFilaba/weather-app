import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import Forecast from './components/Forecast';
import ThemeToggle from './components/ThemeToggle';

function App() {
  // State variables
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');
  const [unit, setUnit] = useState('metric');
  
  // OpenWeatherMap API key
  const API_KEY = '6b3cbcd7a6552311d1f9486be388d0e5';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Fetch weather data function
  const fetchWeatherData = useCallback(async (city) => {
    setLoading(true);
    setError('');
    
    try {
      // 1. Get current weather
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${city}&units=${unit}&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('City not found. Try: New York, London, Tokyo, Paris, Sydney');
      }
      
      const weather = await weatherResponse.json();
      setWeatherData(weather);
      
      // 2. Get 5-day forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
      );
      
      const forecast = await forecastResponse.json();
      
      // Get one forecast per day at noon
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
  }, [unit, API_KEY]);

  // Load initial data
  useEffect(() => {
    fetchWeatherData('New York');
  }, [fetchWeatherData]);

  // Handle search
  const handleSearch = (city) => {
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  // Toggle temperature units
  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Get weather icon
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
    <div className={`app ${theme}`}>
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>
            <i className="fas fa-cloud-sun"></i>
            React Weather App
          </h1>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} loading={loading} />
        
        {/* Error Message */}
        {error && (
          <div className="error">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading weather data...</p>
          </div>
        )}

        {/* Weather Content */}
        {weatherData && !loading && (
          <div className="weather-content">
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
          </div>
        )}

        {/* Quick Cities */}
        <div className="quick-cities">
          <p>
            <i className="fas fa-lightbulb"></i>
            Try these cities:
          </p>
          <div className="city-buttons">
            {['London', 'Tokyo', 'Paris', 'Sydney', 'Dubai'].map(city => (
              <button 
                key={city}
                onClick={() => handleSearch(city)}
                className="city-btn"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* React Features Demo */}
        <div className="features">
          <h3>
            <i className="fas fa-star"></i>
            React Concepts Demonstrated
          </h3>
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-cube"></i>
              <h4>Components & Props</h4>
              <p>5 reusable components</p>
            </div>
            <div className="feature">
              <i className="fas fa-database"></i>
              <h4>State Management</h4>
              <p>useState & useEffect hooks</p>
            </div>
            <div className="feature">
              <i className="fas fa-cloud-download-alt"></i>
              <h4>API Integration</h4>
              <p>Real-time OpenWeatherMap API</p>
            </div>
            <div className="feature">
              <i className="fas fa-exchange-alt"></i>
              <h4>Event Handling</h4>
              <p>Search, toggle, theme events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;