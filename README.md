# ReviewBot
A script that keeps track of existing reviews and posts new ones to Mattermost.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to run the script and how to use them

```
- NodeJS 
- NPM
- Mattermost Webhook
- Credentials for storing the reviews on Google Cloud Storage https://cloud.google.com/docs/authentication/getting-started
- Credentials for access the Android reviews https://developers.google.com/android-publisher/reply-to-reviews
```

### Installing

You will first need to setup your `.env` file. 

``` 
MM_WEBHOOK_URL=https://mattermost-webhook.com
```

Then you will need to fill the info related to the bundle identifier for the app that you are planing to scrap. 

``` 
fetchIosReviews("BundleIdenfier", idsFetchedBefore, "Key on Cloud Storage");
``` 

After filling those variables, just run `npm start`. 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
