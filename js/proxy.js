const http = require('http');
const httpProxy = require('http-proxy');
const axios = require('axios');
const cheerio = require('cheerio');

const proxy = httpProxy.createProxyServer();
const port = 8080;
const targetURL = 'http://www.zone-h.org/mirror/id/41167697'; // Replace with your target URL

// Create a proxy server
const server = http.createServer((req, res) => {
  // Proxy request to target server
  proxy.web(req, res, {
    target: targetURL,
  });
});

// Listen on the specified port
server.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});

// Listen for proxy server error events
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain',
  });
  res.end('Proxy error');
});

// Listen for proxy server response events
proxy.on('proxyRes', async (proxyRes, req, res) => {
  try {
    // Check if the response is HTML
    console.log('first');
    if (
      proxyRes.headers['content-type'] &&
      proxyRes.headers['content-type'].includes('text/html')
    ) {
      // Read the response data
      let body = '';
      proxyRes.on('data', (chunk) => {
        body += chunk;
      });
      console.log(body);
      // Perform web scraping when the response ends
      proxyRes.on('end', async () => {
        try {
          // Parse the HTML response using Cheerio
          const $ = cheerio.load(body);

          // Extract data or manipulate the DOM as needed
          const title = $('title').text();
          console.log('Title:', title);
        } catch (error) {
          console.error('Web scraping error:', error);
        }
      });
    }
  } catch (error) {
    console.error('Response processing error:', error);
  }
});
