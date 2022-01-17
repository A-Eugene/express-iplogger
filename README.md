## express-iplogger

A simple IP logger library for Express using ip-api.com

( Not affiliated )

## Installation:

    $ npm install express-iplogger --save

## Usage

You can use the logger by calling the imported logger inside an express route/middleware. The logger result is accessible using the ipinfo object from the request parameter.

ip-api.com limits the request from an IP address to 45 requests per second, so to avoid getting rate limited here you can specify how long do you want the logger to cache the result from ip-api.com.

You can set it to 0 to disable caching(not reccomended).
```js
const express = require('express');
const logger = require('express-iplogger');

const app = express();
const options = {
	cacheAge: 120 // 120 seconds
}

app.use(logger(options));
app.use((req, res) => {
	res.send('Hello world!');
	console.log(req.ipinfo); // Result from the ip logger
});

app.listen(3000);
```

IMPORTANT: If you are running this behind a reverse proxy like nginx you should add add this line of code before you use the logger in the middleware:

```js
app.set('trust proxy', true);
```

This line of code will set the req.ip object to either the socketAddress's client IP or the IP from the X-Forwarded-For header. For example in nginx you can do:
```conf
server {
	listen 80;

	location / {
		proxy_set_header X-Forwarded-For $remote_addr;
		proxy_pass http://localhost:3000/;
	}
}
```

&nbsp;
**Full explanation:**
1. Nginx forwards the client IP($remote_addr) to the express webserver behind the proxy by adding the X-Forwarded-For header
2. By setting 'trust proxy' in express app to true, you are "trusting" the proxy's X-Forwarded-For header. Therefore, express sets the req.ip object to X-Forwarded-For header if exists, else it'll just return the reverse proxy's IP
3. This req.ip object is required in order for the middleware to work. That is the way this library retrieves the IP.

&nbsp;
**Warning: setting 'trust proxy' to true will trust any X-Forwarded-For header including the one from the client! Only enable this option when using a reverse proxy!**

## Options
| Key      | Description                                                                               | Type   |
|----------|-------------------------------------------------------------------------------------------|--------|
| cacheAge | How long do you want the API result to be cached in seconds (Set to 0 to disable caching) | number |

&nbsp;
## Result (req.ipinfo):

Returns *null* when there's an error. Otherwise:

| Key           | Description                                                                                                 | Example             | Type    |
|---------------|-------------------------------------------------------------------------------------------------------------|---------------------|---------|
| continent     | Continent name                                                                                              | North America       | string  |
| continentCode | Two-letter continent code                                                                                   | NA                  | string  |
| country       | Country name                                                                                                | United States       | string  |
| countryCode   | Two-letter country code [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)              | US                  | string  |
| regionName    | Region/state                                                                                                | California          | string  |
| region        | Region/state short code (FIPS or ISO)                                                                       | CA or 10            | string  |
| city          | City                                                                                                        | Mountain View       | string  |
| district      | District(subdivision of city)                                                                               | Old Farm District   | string  |
| zip           | Zip code                                                                                                    | 94043               | string  |
| lat           | Latitude of the IP address's location in [decimal degrees](https://en.wikipedia.org/wiki/Decimal_degrees)   | 37.4192             | float   |
| lon           | Longtitude of the IP address's location in [decimal degrees](https://en.wikipedia.org/wiki/Decimal_degrees) | -122.0574           | float   |
| timezone      | Timezone(tz)                                                                                                | America/Los_Angeles | string  |
| offset        | Timezone UTC DST offset in seconds                                                                          | -25200              | integer |
| currency      | Three-letter national currency code [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)                      | USD                 | string  |
| isp           | Internet Service Provider name                                                                              | Google              | string  |
| org           | Organization name                                                                                           | Google              | string  |
| as            | AS number and organization, seperated by space(RIR). Empty for IP blocks not being announced in BGP tables  | AS15169 Google Inc. | string  |
| asname        | AS name(RIR). Empty for IP blocks not being announced in BGP tables                                         | AS15169 Google Inc. | string  |
| reverse       | Reverse DNS of the IP                                                                                       | wi-in-f94.1e100.net | string  |
| mobile        | Movile(cellular) connection                                                                                 | true                | boolean |
| proxy         | Proxy, VPN or Tor exit address                                                                              | true                | boolean |
| hosting       | Hosting, colocated or data center                                                                           | false               | boolean |

&nbsp;
## License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[MIT License](https://opensource.org/licenses/MIT)








