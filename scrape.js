const fs = require("fs");
const puppeteer = require("puppeteer");
async function extractdata()
{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.amazon.in/All-Mobile-Phones/s?k=All+Mobile+Phones"); 

    const productsHandles = await page.$$(".sg-col-inner") ;
    const products = [];
    for(const productshandle of productsHandles)
    {
        let title = "Null";
        let price = "Null";
        let rating = "Null";
        let numberofRating = "Null";
        
        try{
            title = await page.evaluate((el) => el.querySelector(".s-title-instructions-style > h2").textContent, productshandle);
        }catch(error){}

        try{
             price = await page.evaluate((el) => el.querySelector(".a-price-whole").textContent, productshandle);;
        }catch(error){}

        try{
             rating = await page.evaluate((el) => el.querySelector(".a-icon.a-icon-star-small.a-star-small-4.aok-align-bottom").textContent, productshandle);
        }catch(error){}

        try{
             numberofRating = await page.evaluate((el) => el.querySelector(".a-section.a-spacing-none.a-spacing-top-micro > div > span:nth-child(2) > a > span").textContent, productshandle);
        }catch(error){}
        if (title!== "Null"){
            products.push({title,price,rating,numberofRating});
         

        }
        
    }
    console.log(products)

    fs.writeFile("products.json",JSON.stringify(products), (err) => {
        if(err) throw err;
        console.log("File Saved");
    }) 
    await browser.close();
}
extractdata();