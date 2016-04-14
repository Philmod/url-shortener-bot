# url-shortener-bot
Messenger bot to shorten urls

## How does that work?
It uses the [url-shortener](https://github.com/Philmod/url-shortener) service to return an answer to the messenger message.

## Install and Run
- Install Node.js and NPM, by downloading and installing from https://nodejs.org/en/
- Install Node.js modules for this project
```
npm install
```
- [Set up a Facebook App and Page](https://developers.facebook.com/docs/messenger-platform/quickstart), update your `/config/` file with the `facebook_verif_token` and `facebook_page_token`
- Run a local url-shortener server (and define the config `url_shortener_url`)
- Run this server:
```
npm start
```

## Tests
```
npm test
```

### Circle CI
Circle CI is configured and will run all the tests whenever a commit is pushed to this repository.
