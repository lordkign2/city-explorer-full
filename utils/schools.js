const getSchools = (cityName) => {
    // You can expand this with real API or DB later
    const mockSchools = {
      Lagos: ['Queens College', 'King’s College', 'University of Lagos'],
      Nairobi: ['Nairobi School', 'Alliance High', 'Strathmore University'],
      NewYork: ['NYU', 'Columbia University', 'The Dalton School']
    };
  
    return mockSchools[cityName] || [
      `${cityName} International School`,
      `${cityName} Central Academy`,
      `${cityName} STEM Institute`
    ];
  };
  
  module.exports = getSchools;