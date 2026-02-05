import React from 'react';

const WeatherCard = ({ weather, unit, toggleUnit, getWeatherIcon }) => {
  const { main, weather: conditions, name, sys, wind, visibility, clouds } = weather;
  
  const temperature = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);
  const condition = conditions[0].main;
  const description = conditions[0].description;
  const country = sys.country;
  
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2 className="location-name">{name}, {country}</h2>
        <p className="weather-condition">{condition} • {description}</p>
        
        <div className="temperature-section">
          <div className="current-temperature">
            <i className={`temperature-icon ${getWeatherIcon(condition)}`}></i>
            <div>
              <span className="temperature-value">{temperature}</span>
              <span className="temperature-unit">{tempUnit}</span>
            </div>
          </div>
          
          <button className="unit-toggle" onClick={toggleUnit}>
            Switch to {unit === 'metric' ? '°F' : '°C'}
          </button>
        </div>
        
        {sys.sunrise && sys.sunset && (
          <div className="sun-times">
            <p>
              <i className="fas fa-sunrise"></i> Sunrise: {formatTime(sys.sunrise)} 
              &nbsp; • &nbsp;
              <i className="fas fa-sunset"></i> Sunset: {formatTime(sys.sunset)}
            </p>
          </div>
        )}
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <i className="detail-icon fas fa-temperature-half"></i>
          <div className="detail-content">
            <h4>Feels Like</h4>
            <p>{feelsLike}{tempUnit}</p>
          </div>
        </div>
        
        <div className="detail-item">
          <i className="detail-icon fas fa-droplet"></i>
          <div className="detail-content">
            <h4>Humidity</h4>
            <p>{main.humidity}%</p>
          </div>
        </div>
        
        <div className="detail-item">
          <i className="detail-icon fas fa-wind"></i>
          <div className="detail-content">
            <h4>Wind Speed</h4>
            <p>{wind.speed} {speedUnit}</p>
          </div>
        </div>
        
        <div className="detail-item">
          <i className="detail-icon fas fa-gauge-high"></i>
          <div className="detail-content">
            <h4>Pressure</h4>
            <p>{main.pressure} hPa</p>
          </div>
        </div>
        
        <div className="detail-item">
          <i className="detail-icon fas fa-eye"></i>
          <div className="detail-content">
            <h4>Visibility</h4>
            <p>{(visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>
        
        <div className="detail-item">
          <i className="detail-icon fas fa-cloud"></i>
          <div className="detail-content">
            <h4>Cloudiness</h4>
            <p>{clouds?.all || 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;