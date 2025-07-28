const axios = require('axios');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'hotels-com6.p.rapidapi.com';

async function getHotelsByCity(cityName, locationLimit = 1, hotelLimit = 10) {
  try {
    // Step 1: Get locationId for city
    const locationResp = await axios.get('https://hotels-com6.p.rapidapi.com/hotels/auto-complete', {
      params: { query: cityName },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    });

    const locations = locationResp.data?.data?.sr?.slice(0, locationLimit) || [];
    const today = new Date();
    const checkIn = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const checkOut = tomorrow.toISOString().split('T')[0];

    const allHotels = [];

    for (const loc of locations) {
      if (!loc.locationId) continue;

      try {
        const hotelResp = await axios.get('https://hotels-com6.p.rapidapi.com/hotels/search', {
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': RAPIDAPI_HOST
          },
          params: {
            locationId: loc.locationId,
            checkinDate: checkIn,
            checkoutDate: checkOut,
            rooms: '[{"adults": 1}]'
          }
        });

        const listings = hotelResp.data?.data?.propertySearchListings?.slice(0, hotelLimit) || [];

        for (let i = 1; i < listings.length; i++) {
          const hotel = listings[i];
          const randIndex = Math.floor(Math.random() * listings.length);

          allHotels.push({
            hotelName: hotel?.headingSection?.heading || 'Unnamed Hotel',
            description: hotel?.headingSection?.messages?.[0]?.text || 'No description available',
            rating: hotel?.summarySections?.[0]?.guestRatingSectionV2?.badge?.text || 'N/A',
            ratingSummary: hotel?.summarySections?.[0]?.guestRatingSectionV2?.badge?.theme || 'N/A',

            firstPhotoDescriptionA: hotel?.mediaSection?.gallery?.media?.[0]?.media?.description || 'No description',
            firstPhotoDescriptionB: hotel?.mediaSection?.gallery?.media?.[1]?.media?.description || 'No description',
            firstPhotoDescriptionC: hotel?.mediaSection?.gallery?.media?.[2]?.media?.description || 'No description',

            firstPhotoUrlA: hotel?.mediaSection?.gallery?.media?.[0]?.media?.url || '',
            firstPhotoUrlB: hotel?.mediaSection?.gallery?.media?.[1]?.media?.url || '',
            firstPhotoUrlC: hotel?.mediaSection?.gallery?.media?.[2]?.media?.url || '',

            price: hotel?.priceSection?.priceSummary?.displayMessages?.[0]?.lineItems?.[0]?.value || 'Not listed'
          });
        }

      } catch (err) {
        console.error(`Hotel data error for locationId ${loc.locationId}:`, err.message);
      }
    }

    return allHotels;
  } catch (error) {
    console.error('getHotelsByCity error:', error.message);
    return [];
  }
}

module.exports = getHotelsByCity;
