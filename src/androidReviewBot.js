const { JWT } = require('google-auth-library');
const keys = require('../android-keys.json');

const {
    sendMessageToWebhook,
    generateMessage
} = require('./reviewBot');

const { saveReviews } = require('./database');

const androidPlatform = 'android';

fetchAndroidReviews = async (bundle, androidIds, key) => {

    const androidUrl = `https://www.googleapis.com/androidpublisher/v3/applications/${bundle}/reviews`;
    const client = new JWT(
        keys.client_email,
        null,
        keys.private_key,
        ['https://www.googleapis.com/auth/androidpublisher'],
    );

    client.request({ url: androidUrl }).then((res) => {
        const reviewData = res.data.reviews;
        console.log(reviewData)

        reviewData.forEach((review) => {
            const { reviewId } = review;
            const author = review.authorName;
            const userReview = review.comments[0].userComment;
            console.log(userReview)
            const { text } = userReview;
            const rating = userReview.starRating;
            const fiveDigitLanguage = userReview.reviewerLanguage;
            const version = userReview.appVersionName;
            const href = '';
            const title = '';
            const twoDigitLanguage = fiveDigitLanguage.substring(0, 2);

            if (!androidIds.includes(reviewId)) {
                const msg = generateMessage(rating, author, href, title, text, twoDigitLanguage, version);
                console.log(msg)
                try {
                    sendMessageToWebhook(twoDigitLanguage, androidPlatform, msg, false);
                    androidIds.push(reviewId);
                } catch (error) {
                    console.log(error);
                    console.log(`Error writing message Android to webhook (${msg}), trying again next time`);
                }
            }
        });

        saveReviews(key, bundle, androidIds)
    })
    .catch((error) => {
        console.log(error);
    });
}

exports.fetchAndroidReviews = (bundle, androidIds, key) => {
    fetchAndroidReviews(bundle, androidIds, key);
}