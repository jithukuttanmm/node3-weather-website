const request = require("postman-request");

const forecast = (latitude, langitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=8eb28cbfdc681e05dfd766fff5cd2b27&query=${latitude},${langitude}`;
  request({ url, json: true }, (error, { body }) => {
    if (error) callback("Unable to connect to weather service", {});
    else {
      const { current } = body;
      callback(undefined, {
        imageUrl: current.weather_icons,
        stringValue: `${current.weather_descriptions[0]}, It is currently ${current.temperature} degrees out, but it feels like ${current.feelslike} degrees.`,
      });
    }
  });
};
module.exports = { forecast };
