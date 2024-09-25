const { MAIN_WORLD } = require('puppeteer');
const Articles = require('../models/newsModel')

const dumpArticle = (title, image, extention) => {
    const articleObj = Articles();
    articleObj.save()
}

async function scrapeNew () {
    try {
        // Load page and wait for news article class to load
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const parentUrl = 'https://www.foxsports.com/nfl';
            
        await page.goto(parentUrl);
        await page.waitForSelector('.news-article');
        
        const mainArticle = await page.evaluate(() => {
            const element = document.querySelector('.news-article.content-top.article-container');
            return element ? element.textContent.trim() : '';
        });
                
        const childUrl = await page.evaluate(() => {
            const element = document.querySelector('.news-article.content-top.article-container');
            if (!element) return null;
            const childLink = element.getAttribute('href');
            return childLink ? childLink : null
        });

        const mainImage = await page.evaluate(() => {
            const element = document.querySelector('.specific-div'); 
            if (element) {
                const img = div.querySelector('.image-class');
                return img ? img.src : null;
            }
            return null;
        });

        
        // await page.goto('https://www.foxsports.com' + childUrl);
        // await page.waitForSelector('.story-title');
        
        // const mainContent = await page.$$eval('.mg-t-b-20.ff-h.fs-16.lh-1pt88.mg-t-b-20.article-content', elements => elements.map(element => element.textContent.trim()));
        await browser.close();
        
        
        try {
            dumpArticle(mainArticle,mainImage,childUrl);
        } catch (err) {
            if (err == "No Title Provided") {
                mainArticle = "NFL News Article";
            } 
            if (err == "No Image Provided") {
                mainImage = "#";
            }
        }

        } catch (err) {
            console.log(err)
        }
        return { mainArticle, mainImage, childUrl };
}



module.exports = { scrapeNew };