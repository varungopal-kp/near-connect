const axios = require("axios");

async function geocode(pincode) {
  try {
    const url = `https://nominatim.openstreetmap.org/search`;

    const response = await axios.get(url, {
      params: {
        q: pincode, // The pincode or address to search for
        format: "json", // Response format
        addressdetails: 1, // Include detailed address information
      },
      headers: {
        "User-Agent": "near-connect/1.0 (vrkhere786@example.com)", // Required by Nominatim
      },
    });

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      console.log("No results found for the given pincode.");
      return null;
    }
  } catch (error) {
    console.log(error);
    console.error("Error geocoding pincode:", error.message);
  }
}

exports.geocode = geocode;
