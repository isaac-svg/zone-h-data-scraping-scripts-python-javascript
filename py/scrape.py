from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time


def scrape_zone_h():
   
    driver = webdriver.Chrome()

    url = "http://www.zone-h.org/archive/special=1/page=1"

    try:
        # Open the URL
        driver.get(url)
        time.sleep(5)  # Let the page load completely (you may adjust the waiting time)

        page_source = driver.page_source

        # Parse the page source with BeautifulSoup
        soup = BeautifulSoup(page_source, 'html.parser')

        # Find and extract the relevant data
        table_rows = soup.find_all('tr')

        for row in table_rows:
            attacker = row.find('td', {'class': 'defacer'}).text.strip()
            url = row.find('a', {'target': '_blank'}).text.strip()
            date = row.find('td', {'class': 'date'}).text.strip()

            # Perform further actions as needed, like extracting IP using Selenium actions

            print(attacker, url, date)

    except Exception as e:
        print("Error:", str(e))
    finally:
        # Close the webdriver
        driver.quit()

scrape_zone_h()
