// utils/unsplash.js
const axios = require('axios');

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

async function getCityImage(cityName) {
  try {
    const res = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: `${cityName} city`,
        orientation: 'landscape',
        per_page: 1
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    //if (res.data.results[0].length > 0) {
      return res.data.results[0].urls.regular;
   // }
    
    // fallback default
   // return '/images/default-city.jpg';
  } catch (err) {
    console.error('Unsplash fetch failed:', err.message);
    return '/images/default-city.jpg';
  }
}

module.exports = { getCityImage };