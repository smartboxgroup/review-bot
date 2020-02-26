const { fetchIosReviews } = require('./src/iosReviewBot');
const { fetchAndroidReviews } = require('./src/androidReviewBot');
const { getReviews } = require('./src/database');

startIos = async () => {
    const iosIds = await getReviews("iOS");
    let allIosIds = [];
    iosIds.forEach(item => {
        allIosIds.push(item.ids)
    });

    const mergedIosIds = [].concat.apply([], allIosIds);
    fetchIosReviews("iOS Store Key", mergedIosIds, "iOS");
}

startAndroid = async () => {
    const androidIds = await getReviews("Android");
    let allAndroidIds = [];
    androidIds.forEach(item => {
        allAndroidIds.push(item.ids)
    });

    const mergedAndroidIds = [].concat.apply([], allAndroidIds);
    fetchAndroidReviews("android.bundle.identifier", mergedAndroidIds, "Android");
}


startAndroid();
startIos(); 
