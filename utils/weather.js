const axios = require('axios');

const getWeather = async (city) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;

  try {
    
    const response = await axios.get(url);
    const data = response.data;
    
    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      wind: data.wind.speed
    };
  } catch (err) {
    console.error('Weather API error:', err.message);
    return null;
  }
};

module.exports = getWeather;