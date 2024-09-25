const {readFile, readFileSync} = require('fs');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const data = require('./important.json')
const uri = data.uri
const { requireAuth, checkUser } = require('./middleware/authMiddleWare');
const jwt = require('jsonwebtoken');
const signature = data.secret;
const User = require('./models/schema');

// const html = readFileSync('./webpages/login.html', 'utf8');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const users = require('./models/schema');

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

const mongoose = require('mongoose');

mongoose.connect(uri)
.then((result) => {
    app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));
    console.log('connection successful!');
})
.catch((err) => {
    console.error(err)
});




// Web Scraping

// const title = null;
// async function mainNewsFetch() {
//     try {
//         // Load page and wait for news article class to load
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         const parentUrl = 'https://www.foxsports.com/nfl';
    
//         await page.goto(parentUrl);
//         await page.waitForSelector('.news-article');

//         const mainArticle = await page.evaluate(() => {
//             const element = document.querySelector('.news-article.content-top.article-container');
//             return element ? element.textContent.trim() : '';
//         });
        
//         const childUrl = await page.evaluate(() => {
//             const element = document.querySelector('.news-article.content-top.article-container');
//             if (!element) return null;
//             const childLink = element.getAttribute('href');
//             return childLink ? childLink : null
//         });

//         await page.goto('https://www.foxsports.com' + childUrl);
//         await page.waitForSelector('.story-title');

//         const mainContent = await page.$$eval('.mg-t-b-20.ff-h.fs-16.lh-1pt88.mg-t-b-20.article-content', elements => elements.map(element => element.textContent.trim()));
//         await browser.close();

//         return [mainArticle, mainContent];

//     } catch (err) {
//         console.log(err)
//         return [null, null];
//     }
// }


// Website Callback
// app.get('/login', (req,res) => {
    
// })

app.get('*', checkUser);

app.get('/add-user', (req,res) => {
    const dbRef = users({
        title: "User",
        snippet: "Pass",
        body: "BB"
    })

    dbRef.save()
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err)
    });
});

app.get('/read-user', (req,res) => {
    users.findById('66a3009e1052f29211cd34af')
    .then((result) => {
        res.send(result);
    });
});

app.get('/data', async (request,response) => {
    const [title, content] = await mainNewsFetch();
    const mainData = {
        headline : title,
        body : content
    };
    response.json(mainData)
});



app.get('/', requireAuth, (req, res) => {
    res.render('home')
});
app.use(authRoutes);

