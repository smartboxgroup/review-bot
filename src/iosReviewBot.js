const { doRequest } = require('./utils');

const { saveReviews } = require('./database');

const {
  sendMessageToWebhook,
  generateMessage
} = require('./reviewBot');

const iosPlatform = 'ios';
const iosCountries = [
  { language: 'ie', name: 'Ireland', flag: 'ireland' },
  { language: 'fr', name: 'France', flag: 'fr' },
  { language: 'nl', name: 'Netherlands', flag: 'netherlands' },
  { language: 'it', name: 'Italy', flag: 'it' },
  { language: 'se', name: 'Sweden', flag: 'sweden' },
  { language: 'ch', name: 'Switzeland', flag: 'switzerland' },
  { language: 'es', name: 'Spain', flag: 'es' },
  { language: 'dk', name: 'Denmark', flag: 'denmark' },
];


fetchIosReviewsForLanguage = async (country, appId, iosIds) => {
  const language = country.language;
  const url = `https://itunes.apple.com/${language}/rss/customerreviews/id=${appId}/sortBy=mostRecent/json`;

  let request = await doRequest(url);
   if (request.error) {
     console.log('error:', error); // Print the error if one occurred
     console.log(`Skipping ${country.name} because of error while fetching JSON`);
     return;
  }
  try {

    const jsonBody = JSON.parse(request);

    if (jsonBody.feed.entry != undefined) {

      jsonBody.feed.entry.forEach(entry => { 
        const author = entry.author.name.label;
        const id = entry.id.label;
        const rating = entry['im:rating'].label;
        const title = entry.title.label;
        const text = entry.content.label;
        const { href } = entry.link.attributes;
        const version = entry['im:version'].label;

        if (!iosIds.includes(id)) {
          const msg = generateMessage(rating, author, href, title, text, country.flag, version);

          try {
            sendMessageToWebhook(country, iosPlatform, msg, false);
            iosIds.push(id);
          } catch (error) {
            console.log(error)
            console.log(`Error writing IOS message to webhook (${msg}), trying again next time`);
          }
        }
      })
    }

  } catch (error) {
    console.log('error:', error);
    console.log(`Skipping ${language} because of error while parsing JSON`);
    return;
  }

  return iosIds;
}

exports.fetchIosReviews = (appId, iosIds, key) => {
  iosCountries.forEach(async (country) => {
    let ids = await fetchIosReviewsForLanguage(country, appId, iosIds);
    await saveReviews(key, appId, ids)
  });

}
