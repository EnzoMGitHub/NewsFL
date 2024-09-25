const Articles = require('../models/newsModel');
const { scrapeNew } = require('../middleware/fetch');


module.exports.article_get = async (req,res) => {
    const article = await Articles.fetch(req.body);
    res.locals.article = article;

}

module.exports.article_post = async (req,res) => {
    const { title, image, extention} = scrapeNew(tier);
    const article = await Articles.create(title, image, extension, tier);
}