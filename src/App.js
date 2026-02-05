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
  
  // Load theme from localStorage
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('weatherAppTheme');
    return savedTheme || 'light';
  });
  
  // Load unit from localStorage
  const [unit, setUnit] = useState(() => {
    const savedUnit = localStorage.getItem('weatherAppUnit');
    return savedUnit || 'metric';
  });
  
  // Load last city from localStorage
  const [lastCity, setLastCity] = useState(() => {
    const savedCity = localStorage.getItem('weatherAppLastCity');
    return savedCity || 'New York';
  });
  
  const API_KEY = '6b3cbcd7a6552311d1f9486be388d0e5';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('weatherAppTheme', theme);
  }, [theme]);

  // Save unit to localStorage
  useEffect(() => {
    localStorage.setItem('weatherAppUnit', unit);
  }, [unit]);

  // Save last searched city
  const saveLastCity = (city) => {
    localStorage.setItem('weatherAppLastCity', city);
    setLastCity(city);
  };

  // Fetch weather data
  const fetchWeatherData = useCallback(async (city) => {
    setLoading(true);
    setError('');
    
    try {
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${city}&units=${unit}&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('City not found. Try another city.');
      }
      
      const weather = await weatherResponse.json();
      setWeatherData(weather);
      saveLastCity(city);
      
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
      );
      
      const forecast = await forecastResponse.json();
      
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
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
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
      'Fog': 'fas fa-smog'
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
            Weather App
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

        {/* Loading */}
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
          <p>Try these cities:</p>
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
      </div>
    </div>
  );
}

export default App;