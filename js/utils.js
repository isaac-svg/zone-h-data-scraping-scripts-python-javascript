const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const readline = require('readline');
const mirrorBaseURL = `http://www.zone-h.org/mirror/url/`;
const puppeteer = require('puppeteer');

const USERAGENTS = [
  'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
];
/**
 * @function getIPandURL Open the IP address of an attack from zone-h
 */
const getIPandURL = async (url) => {
  // console.log(`${url}, from  getIPandURL   `);
  const urlToken = url.split('/');
  const id = urlToken[urlToken.length - 1];
  let domain, ipaddress;
  console.log(id, 'id');
  try {
    const response = await axios(`${url.replace(/\t|\n/g, '')}`, {
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'Accept-Encoding': 'gzip, deflate',
        connection: 'keep-alive',
        Cookie:
          'ZHE=11b5718e7f2ac07fb1944cae2df8f906; __utma=1.1290780413.1714317729.1715026614.1715033666.12; __utmz=1.1714317729.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); PHPSESSID=eqtv1n527u0b4o4gbl616lu246; __utmc=1; __utmb=1.2.10.1715033666; __utmt=1',

        'sec-ch-ua-mobile': '?0',
        // host: 'http://www.zone-h.org',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': USERAGENTS[Math.floor(Math.random() * USERAGENTS.length)],
        referer: `http://www.zone-h.org/mirror/id/${id}`,
      },
    });

    const html = response.data;

    const $ = cheerio.load(html);
    // console.log(html);

    // Extract IP address and website from the list item
    const ipPayload = $("li[class^='defacet']")?.toString();
    const ipAddressRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
    ipaddress = ipPayload.match(ipAddressRegex)?.toString();
    // console.log('ipaddress address:', ipaddress);
    const domainPayload = $("li[class^='defaces']").first()?.text();
    // console.log(domainPayload, 'domainPayload');

    domain = domainPayload.split('Domain:')[1];
    // console.log('Website:', domain);
    // console.log(IP);
    return Promise.resolve([ipaddress, domain, id]);
  } catch (error) {
    console.log(`Error getting IP - Reason: ${error.message}`);
    return ['#NA', '#NA', id];
  }
  // return
};

const read = () => {
  const readl = readline.createInterface({
    input: fs.createReadStream('./ipurltest.csv'),
    crlfDelay: Infinity,
  });
  // console.log('first');
  let urlsGroup = [];
  const writableStream = fs.createWriteStream('ipanddomain.csv', {
    flags: 'a',
  });
  // let count = 0;
  readl.on('line', (line) => {
    readl.pause();
    setTimeout(async () => {
      const data = await getIPandURL(line);
      const [ipaddress, domain, id] = data;
      console.log('first');
      writableStream.write(`${ipaddress}, ${domain}, ${id}\n`, (error) => {
        if (error) {
          console.error('Error writing to file:', error);
          readl.resume();
        } else {
          // console.log('Data appended to file successfully.');
          // resolveNAEntries('./ipanddomain.csv');
        }
      });
      readl.resume();
    }, 2000);
  });
  readl.on('close', async () => {
    const data = await Promise.all(urlsGroup.map(getIPandURL));
    console.log(data, 'close data');

    for (const [ipaddress, domain] of data) {
      writableStream.write(`${ipaddress}, ${domain}\n`, (error) => {
        if (error) {
          console.error('Error writing to file:', error);
        } else {
          // console.log('Data appended to file successfully.');
        }
      });
    }
    urlsGroup = [];
  });
};
// getIPandURL('http://www.zone-h.org/mirror/id/41157931', 1);
getIPandURL('http://www.zone-h.org/mirror/id/41157931').then((data) =>
  console.log(data),
);
read();
const resolveNAEntries = async (filepath) => {
  let unresolved = true;

  while (unresolved) {
    unresolved = false;

    const lines = fs.readFileSync(filepath, 'utf-8').split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const [ipaddress, domain, id] = line.split(',');

      if (ipaddress.trim() === '#NA') {
        unresolved = true;
        // Resolve #NA entry by making a network request
        try {
          const resolvedData = await getIPandURL(
            `http://www.zone-h.org/mirror/id/${id.trim()}`,
          );
          const [resolvedIP, resolvedDomain] = resolvedData;

          // Update the line in the file with resolved data
          const updatedLine = `${resolvedIP}, ${resolvedDomain}, ${id.trim()}\n`;

          // Update the file synchronously
          lines[i] = updatedLine;
          fs.writeFileSync(filepath, lines.join('\n'));
        } catch (error) {
          console.error(`Failed to resolve #NA entry for ID: ${id.trim()}`);
        }
      }
    }
  }
};

// ,Hm*CH2Q6}Vt~KY

module.exports = { getIPandURL, USERAGENTS };
