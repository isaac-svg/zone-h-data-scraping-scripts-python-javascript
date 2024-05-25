// const { default: axios } = require('axios');
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const cheerio = require('cheerio');

const rl = readline.createInterface({
  input: fs.createReadStream('./urlstest2.csv'),
  crlfDelay: Infinity,
});

const writableStream = fs.createWriteStream('ipanddomain.csv', {
  flags: 'a',
});

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

let MirrorArray = [];
let bufferCount = 0;
// let startProcessing = false;
rl.on('line', (line) => {
  MirrorArray.push(line);
  bufferCount++;
  console.log(line);
});

function checkInterval() {
  // console.log('checkInterval');
  //   console.log(count, Zarray.length);
  if (count >= Zarray.length - 1) {
    clearInterval(interval);
  }
}
// if (startProcessing) {
let count = 0;
const interval = setInterval(async () => {
  try {
    // checkInterval();
    console.log('Inside interval');
    console.log(MirrorArray[count]);
    if (!MirrorArray[count]) return;
    const response = await axios(MirrorArray[count], {
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.5',
        'cache-control': 'max-age=0',
        'Accept-Encoding': 'gzip, deflate',
        connection: 'keep-alive',
        Cookie:
          'ZHE=e817bd9d127ef9546e65526507da0088; __utma=1.1290780413.1714317729.1715033666.1715036513.13; __utmz=1.1714317729.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); PHPSESSID=eqtv1n527u0b4o4gbl616lu246; __utmc=1; __utmb=1.5.10.1715036513; __utmt=1',
        'sec-ch-ua-mobile': '?0',
        // host: 'http://www.zone-h.org',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': USERAGENTS[Math.floor(Math.random() * USERAGENTS.length)],
        referer: `http://www.zone-h.org/archive/special=1`,
      },
    });
    const urlToken = MirrorArray[count].split('/');
    const id = urlToken[urlToken.length - 1];
    // count++;
    // console.log(await response.body.getReader().read());
    const html = response.data;
    const $ = cheerio.load(html);
    console.log(html);

    // Extract IP address and website from the list item
    const ipPayload = $("li[class^='defacet']")?.toString();
    const ipAddressRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
    let ipaddress = ipPayload.match(ipAddressRegex)?.toString();
    // console.log('ipaddress address:', ipaddress);
    const domainPayload = $("li[class^='defaces']").first()?.text();
    // console.log(domainPayload, 'domainPayload');

    let domain = domainPayload.split('Domain:')[1];
    writableStream.write(`${domain}, ${ipaddress}, ${id}\n`, (error) => {
      if (error) console.log(error);
    });
    count++;
  } catch (error) {
    console.log({ message: error.message });
  }
}, 2000);

// }

//

// const Zarray = [
//   'http://www.zone-h.org/mirror/id/41164830',
//   'http://www.zone-h.org/mirror/id/41164820',
//   'http://www.zone-h.org/mirror/id/41164818',
//   'http://www.zone-h.org/mirror/id/41164817',
//   'http://www.zone-h.org/mirror/id/41164815',
//   'http://www.zone-h.org/mirror/id/41164814',
//   'http://www.zone-h.org/mirror/id/41164812',
//   'http://www.zone-h.org/mirror/id/41164807',
//   'http://www.zone-h.org/mirror/id/41164830',
//   'http://www.zone-h.org/mirror/id/41164820',
//   'http://www.zone-h.org/mirror/id/41164818',
//   'http://www.zone-h.org/mirror/id/41164817',
//   'http://www.zone-h.org/mirror/id/41164815',
//   'http://www.zone-h.org/mirror/id/41164814',
//   'http://www.zone-h.org/mirror/id/41164812',
//   'http://www.zone-h.org/mirror/id/41164807',
// ];
