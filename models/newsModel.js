const mongoose = require('mongoose');
const schema = mongoose.Schema;

// For Web Scraping
const puppeteer = require('puppeteer');
const exp = require('constants');

const schemaObj = new schema({
    title: {
        type: String,
        required: [true, "No Title Provided"],
        unique: true
    },
    image: {
        type: String,
        required: [true, "No Image Provided"]
    },
    extention: {
        type: String,
        required: true
    },
    tier: {
        type: Number,
        required: true,
        unique: true
    }
}, { timestamps: true });

schemaObj.statics.fetch = async function(tier) {
    const article = await this.findOne({ tier });

    if (article) {
        return article;
    } else {
        return null;
    }
}


const articles = mongoose.model('articles', schemaObj);
module.exports = articles;