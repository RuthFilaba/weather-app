import React from 'react';

const Forecast = ({ forecast, unit, getWeatherIcon }) => {
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  return (
    <div className="forecast">
      <h3><i className="fas fa-calendar-days"></i> 5-Day Forecast</h3>
      <div className="forecast-cards">
        {forecast.map((day, index) => {
          const date = formatDate(day.dt_txt);
          const dayName = getDayName(day.dt_txt);
          const temp = Math.round(day.main.temp);
          const condition = day.weather[0].main;
          const description = day.weather[0].description;
          const high = Math.round(day.main.temp_max);
          const low = Math.round(day.main.temp_min);
          
          return (
            <div key={index} className="forecast-card">
              <div className="forecast-day">{dayName}</div>
              <div className="forecast-date">{date}</div>
              <i className={`forecast-icon ${getWeatherIcon(condition)}`}></i>
              <div className="forecast-temp">{temp}{tempUnit}</div>
              <div className="temp-range">
                H: {high}{tempUnit} • L: {low}{tempUnit}
              </div>
              <div className="forecast-description">{description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;