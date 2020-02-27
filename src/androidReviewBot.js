const { JWT } = require('google-auth-library');
const keys = require('../android-keys.json');

const {
    sendMessageToWebhook,
    generateAndroidMessage
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

        reviewData.forEach((review) => {
            const { reviewId } = review;
            const author = review.authorName;
            const userReview = review.comments[0].userComment;
            const { text } = userReview;
            const rating = userReview.starRating;
            const fiveDigitLanguage = userReview.reviewerLanguage;
            const device = userReview.device;
            const lastModified = userReview.lastModified.seconds;
            const version = userReview.appVersionName;
            const twoDigitLanguage = fiveDigitLanguage.substring(0, 2);

            if (!androidIds.includes(reviewId)) {
                const msg = generateAndroidMessage(rating, author, text, twoDigitLanguage, version, device, lastModified);
                try {
                    sendMessageToWebhook(twoDigitLanguage, androidPlatform, msg, true);
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