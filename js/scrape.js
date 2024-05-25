const puppeteer = require('puppeteer');
const { createObjectCsvWriter } = require('csv-writer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('node:fs/promises');
const { getIPAddress, USERAGENTS } = require('./utils');
const scrapeZoneH = async () => {
  const allData = [];
  const mirror = [];
  try {
    const csvWriter = createObjectCsvWriter({
      path: './output3.csv',
      header: [
        { id: 'Attacker', title: 'Attacker' },
        { id: 'Country', title: 'Country' },
        { id: 'URL', title: 'URL' },
        { id: 'IP', title: 'IP' },
        { id: 'Date', title: 'Date' },
        { id: 'Id', title: 'Id' },
      ],
      // append: true,
    });
    const mirrorWritter = createObjectCsvWriter({
      path: './ipurls3.csv',
      header: [{ id: 'mirror', title: 'mirror' }],
    });
    let pageNumber = 1;
    const baseURL = `http://www.zone-h.org/archive/special=${pageNumber}/page=${pageNumber}`;
    const mirrorBaseURL = `http://www.zone-h.org/mirror/id/`;
    while (pageNumber <= 50) {
      const reponse = await axios(baseURL, {
        headers: {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-store, no-cache, must-revalidate',
          'accept-encoding': 'gzip, deflate',
          Cookie:
            'ZHE=e817bd9d127ef9546e65526507da0088; __utma=1.1290780413.1714317729.1714749887.1715013459.9; __utmz=1.1714317729.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); PHPSESSID=eqtv1n527u0b4o4gbl616lu246; __utmb=1.4.10.1715013459; __utmc=1; __utmt=1',
          'if-none-match': 'W/"5beb-j7HA+NTniMpjK04+k8LqTBaaOHI"',

          'sec-ch-ua-mobile': '?0',

          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          'user-agent':
            USERAGENTS[Math.floor(Math.random() * USERAGENTS.length)],
          referer: `http://www.zone-h.org/archive/special=${1}/page=${pageNumber}`,
        },
      });
      console.log('request count: ', pageNumber);
      const html = await reponse.data;
      await fs.writeFile('./pudata.html', html);
      // console.log(html);
      const $ = cheerio.load(html);
      $('table  tr').each(async (index, element) => {
        const anchor = $(element).find("a[href^='/mirror/id/']");
        // console.log(anchor.toString(), ` index: ${index}`);
        const link = anchor.attr('href');
        // console.log(link, 'link');
        if (link) {
          const tokens = link.split('/');
          // console.log($(element).find('td:nth-child(8)').text());
          const id = tokens[tokens.length - 1];

          const rowData = {
            ['Attacker']: $(element).find('td:nth-child(2)').text(),
            ['Country']: $(element).find('td:nth-child(6) img').attr('alt'),
            ['URL']: $(element)
              .find('td:nth-child(8)')
              .text()
              .replace(/\t|\n/g, ''),
            ['IP']: '#NA',
            ['Date']: $(element).find('td:nth-child(1)').text(),
            ['Id']: id,
          };

          // insert Start

          // Insert End
          allData.push(rowData);
          mirror.push({ mirror: `${mirrorBaseURL}${id}` });
          await csvWriter.writeRecords(allData);
          await mirrorWritter.writeRecords(mirror);
          await fs.appendFile('ipurls.csv', `${mirrorBaseURL}${id}\n`);
        }
      });
      pageNumber++;
      // console.log(allData);
    }
    // await browser.close();
  } catch (error) {
    console.log({ message: error.message });
  }
};

scrapeZoneH();
