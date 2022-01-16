let axios = require('axios');
let ipdata = {};

module.exports = (arg = { cacheAge: 0 }) => {
  let { cacheAge } = arg;

  async function handler(req, res, next) {
    let ip = req.ip.replace('::ffff:', '');

    // Send cache if available and enabled
    if (ipdata[ip] && cacheAge) {
      req.ipinfo = ipdata[ip];
      return next();
    }
  
    await axios.get(`http://ip-api.com/json/${ip}?fields=continent,continentCode,country,countryCode,region,regionName,city,offset,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting`)
      .then(result => {
        let { data } = result;

        req.ipinfo = data;
        
        // Store cache and set a timeout to delete if enabled
        if (cacheAge) {
          ipdata[ip] = data;
          setTimeout(() => {
            delete ipdata[ip];
          }, cacheAge * 1000);
        }
      })
      .catch(() => {
        // Returns null on error
        req.ipinfo = null;
      });

    next();
  }

  return handler;
}