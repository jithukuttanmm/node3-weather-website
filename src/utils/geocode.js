const request = require("postman-request");

const geoCode = (address, callBack) => {
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(address) +
    ".json?access_token=pk.eyJ1Ijoiaml0aHVrdXR0YW5tbSIsImEiOiJja252OWxlY2kwMDdzMnVtcDd3ZWpzMmo1In0.c_F_IrIzdvFE07aRJTHEZw";
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callBack("Unable to connect location service", {});
    } else if (body.features && body.features.length) {
      // Order is switched
      const [langitude, latitude] = body.features[0].center;
      const location = body.features[0].place_name;
      callBack(undefined, { latitude, langitude, location });
    } else {
      callBack("Unable to get location details.");
    }
  });
};

module.exports = { geoCode };
