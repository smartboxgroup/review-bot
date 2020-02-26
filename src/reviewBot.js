const { mattermostWebHookUrl } = require('../config');
const request = require('request');

exports.generateMessage = (score, user, url, title, text, flag, version) => {
    const scoreText = ':star:'.repeat(score);
    return `[${scoreText} by **${user}** :${flag}: on Version ${version}](${url}): **${title}**\n${text}`;
}

exports.sendMessageToWebhook = (country, platform, msg, sendRequests) => {
    const username = `${platform}-Smartbox-ReviewBot`;
    const iconUrl = `https://github.com/eiselems/eiselems.github.io/blob/images/stuff/${platform}.png?raw=true`;
    const queryBody = { text: msg, username, icon_url: iconUrl, channel: "ben-app-store-reviews" };
    if (sendRequests) {
        request({
            url: `${mattermostWebHookUrl}`,
            method: 'POST',
            json: true,
            body: queryBody,
        }, (error, response, body) => {
            if (error) {
                console.log(error);
                throw new Error('Error sending message to webhook. Thanks Mattermost I love you!');
            }
        });
    }
}