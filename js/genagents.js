// Array to store user agents
const userAgents = [];

// Generate 10 different user agents
for (let i = 0; i < 10; i++) {
  const userAgent = generateUserAgent();
  userAgents.push(userAgent);
}

// Function to generate a random user agent
function generateUserAgent() {
  const operatingSystems = [
    'Windows NT 10.0',
    'Macintosh; Intel Mac OS X 10_15_7',
    'X11; Linux x86_64',
    'Windows NT 6.3',
    'Windows NT 6.1',
  ];

  const browsers = [
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36',
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.99 Safari/537.36',
    'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36',
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
  ];

  const operatingSystem =
    operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
  const browser = browsers[Math.floor(Math.random() * browsers.length)];

  return `Mozilla/5.0 (${operatingSystem}) ${browser}`;
}

// Print the generated user agents
console.log(userAgents);
