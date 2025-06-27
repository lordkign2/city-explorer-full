const axios = require('axios');

const getHotels = async (cityName) => {
  const options = {
    method: 'GET',
    url: 'https://hotels4.p.rapidapi.com/locations/v3/search',
    params: { q: cityName, locale: 'en_US' },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    const entities = response.data.sr || [];

    // Filter for hotel-related results
    return entities
      .filter(item => item.type === 'HOTEL')
      .map(hotel => ({
        name: hotel.regionNames?.primaryDisplay || 'Unknown Hotel',
        caption: hotel.caption || '',
        type: hotel.type
      }));
  } catch (err) {
    console.error('Hotel API error:', err.message);
    return [];
  }
};

module.exports = getHotels;
