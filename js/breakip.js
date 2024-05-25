const IPresponse = await axios(`${mirrorBaseURL}${id}`, {
  headers: {
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    'Accept-Encoding': 'gzip, deflate',
    Cookie:
      'ZHE=86098466e48516bcd396f78e5fd8e300; PHPSESSID=ob8rratkd39pqb2us624bhk700; __utma=1.1552535231.1714171090.1714171090.1714171090.1; __utmc=1; __utmz=1.1714171090.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1; __utmb=1.3.10.1714171090',

    'sec-ch-ua-mobile': '?0',

    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  },
});

const IPhtml = IPresponse.data;

const $IP = cheerio.load(IPhtml);
// console.log(html);
const ipPayload = $IP("li[class^='defacet']")?.toString();
const ipAddressRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
const IP = ipPayload.match(ipAddressRegex).toString();
