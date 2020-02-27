const { mattermostWebHookUrl } = require('../config');
const request = require('request');

exports.generateMessage = (score, user, url, title, text, flag, version) => {
    const scoreText = ':star:'.repeat(score);
    return `[${scoreText} by **${user}** :${flag}: on Version ${version}](${url}): **${title}**\n${text}`;
}

exports.generateAndroidMessage = (score, user, text, flag, version, device, lastModified) => {
    const scoreText = ':star:'.repeat(score);
    console.log(lastModified)
    const date = new Date(0)
    date.setUTCSeconds(lastModified)
    return `[${scoreText} by **${user}** :${flag}: on Version ${version}: Device: ${device} at: ${date}]\n${text}`;
}

exports.sendMessageToWebhook = (country, platform, msg, sendRequests) => {
    const username = `${platform}-Smartbox-ReviewBot`;
    const iconUrl = `https://github.com/smartboxgroup/review-bot/blob/master/img/${platform}.png?raw=true`;
    const queryBody = { text: msg, username, icon_url: iconUrl, channel: "" };
    if (sendRequests) {
        request({
            url: `${mattermostWebHookUrl}`,
            method: 'POST',
            json: true,
            body: queryBody,
        }, (error, response, body) => {
            if (error) {
                console.log(error);
                throw new Error('Error sending message to webhook.');
            }
        });
    }
}