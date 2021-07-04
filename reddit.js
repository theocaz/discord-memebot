const puppeteer = require('puppeteer');
const SUBREDDIT_URL = (reddit) => `https://old.reddit.com/r/${reddit}/`;


const self = {
    browser: null,
    page: null,

    initialize: async(reddit) => {
        self.browser = await puppeteer.launch({
            headless: true
        });
        self.page = await self.browser.newPage();

        //Go to subreddit
        await self.page.goto(SUBREDDIT_URL(reddit), {waitUntil: 'networkidle0'});

    },
    getResults: async (nr) => {

        let results = [];
        do{

            let new_results = await self.parseResults();

            results = [...results, ...new_results];

            if(results.length < nr) {
                let nextPageButton = await self.page.$('span[class="next-button"] > a[rel="nofollow next"]');

                if(nextPageButton) {
                    await nextPageButton.click();
                    await self.page.waitForNavigation({ waitUntil: 'networkidle0' });
                } else {
                    break;
                }
            }
        }while(results.length < nr);

        return results.slice(0, nr);
    },

    parseResults: async() => {

        let elements = await self.page.$$('#siteTable > div[class*= "thing"]');
        let results = [];

        for(let element of elements){

            let title = await element.$eval('p.title', node => node.innerText.trim());
            let rank = await element.$eval('span.rank', node => node.innerText.trim());
            let postTime = await element.$eval('p.tagline > time', node => node.getAttribute('title'));
            let authorUrl = await element.$eval('p.tagline > a[class*="author"]', node => node.getAttribute('href'));
            let authorName = await element.$eval('p.tagline  > a[class*="author"]', node => node.innerText.trim());
            let score = await element.$eval(('div[class="score likes"]'), node => node.innerText.trim());
            let comments = await element.$eval(('a[data-event-action="comments"]'), node => node.innerText.trim());

            results.push({
                title,
                rank,
                postTime,
                authorUrl,
                authorName,
                score,
                comments
            })
        }
        return results;
    }

    
}

module.exports = self;