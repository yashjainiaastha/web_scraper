const puppeteer = require('puppeteer');
const url = 'https://www.amazon.in/All-Mobile-Phones/s?k=All+Mobile+Phones';

(async () => {
  try {
    
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();

    
    await page.goto(url);

    
    await page.waitForSelector('.s-result-item');

    let hasNextPage = true;
    let pageNumber = 1;
    const products = [];

    while (hasNextPage) {
      console.log(`Scraping page ${pageNumber}`);

      const pageProducts = await page.$$eval('.s-result-item', (elements) => {
        return elements.map((element) => {
          const titleElement = element.querySelector('.a-link-normal .a-text-normal');
          const priceElement = element.querySelector('.a-price-whole');
          const ratingElement = element.querySelector('.s-star-rating');

          return {
            title: titleElement ? titleElement.innerText.trim() : '',
            price: priceElement ? priceElement.innerText.trim() : '',
            rating: ratingElement ? ratingElement.getAttribute('aria-label').trim() : ''
          };
        });
      });

      products.push(...pageProducts);

      const nextPageButton = await page.$('.s-pagination .s-pagination-item.s-pagination-next');
      hasNextPage = !!nextPageButton;

      if (hasNextPage) {
        
        await nextPageButton.click();

       
        await page.waitForSelector('.s-result-item');
      }

      pageNumber++;
    }

    products.forEach((product) => {
      console.log('Title:', product.title);
      console.log('Price:', product.price);
      console.log('Rating:', product.rating);
      console.log('---');
    });

    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();