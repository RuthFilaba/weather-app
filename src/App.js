import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import Forecast from './components/Forecast';
import ThemeToggle from './components/ThemeToggle';

function App() {
  // Load initial state from localStorage or use defaults
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Load theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('weatherAppTheme');
    return savedTheme || 'light';
  });
  
  // Load unit from localStorage or default to 'metric'
  const [unit, setUnit] = useState(() => {
    const savedUnit = localStorage.getItem('weatherAppUnit');
    return savedUnit || 'metric';
  });
  
  // Load last city from localStorage or default to 'New York'
  const [lastCity, setLastCity] = useState(() => {
    const savedCity = localStorage.getItem('weatherAppLastCity');
    return savedCity || 'New York';
  });
  
  const API_KEY = '6b3cbcd7a6552311d1f9486be388d0e5';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('weatherAppTheme', theme);
  }, [theme]);

  // Save unit to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('weatherAppUnit', unit);
  }, [unit]);

  // Save last searched city to localStorage
  const saveLastCity = (city) => {
    localStorage.setItem('weatherAppLastCity', city);
    setLastCity(city);
  };

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
      saveLastCity(city); // Save successful search to localStorage
      
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

  // Load initial data - uses lastCity from localStorage
  useEffect(() => {
    fetchWeatherData(lastCity);
  }, [fetchWeatherData, lastCity]);

  // Handle search
  const handleSearch = (city) => {
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  // Toggle temperature units
  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    // localStorage is automatically saved via useEffect above
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // localStorage is automatically saved via useEffect above
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

  // Clear all saved data
  const clearLocalStorage = () => {
    if (window.confirm('Clear all saved preferences?')) {
      localStorage.removeItem('weatherAppTheme');
      localStorage.removeItem('weatherAppUnit');
      localStorage.removeItem('weatherAppLastCity');
      setTheme('light');
      setUnit('metric');
      fetchWeatherData('New York');
    }
  };

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>
            <i className="fas fa-cloud-sun"></i>
            React Weather App
            <span className="local-storage-badge" title="Data saved locally">
              <i className="fas fa-database"></i> Local Storage
            </span>
          </h1>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* Local Storage Status */}
        <div className="storage-status">
          <p>
            <i className="fas fa-info-circle"></i>
            Preferences saved locally: Theme ({theme}), Units ({unit === 'metric' ? '°C' : '°F'}), Last City ({lastCity})
            <button className="clear-storage-btn" onClick={clearLocalStorage}>
              <i className="fas fa-trash"></i> Clear
            </button>
          </p>
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

        {/* React Features Demo - Updated to include localStorage */}
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
              <p>OpenWeatherMap API</p>
            </div>
            <div className="feature">
              <i className="fas fa-save"></i>
              <h4>Local Storage</h4>
              <p>Save user preferences</p>
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