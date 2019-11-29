# cuHacking: Application Server
The application server is a server application which defines the REST API endpoints and functionality with will be used for interfacing between the frontend (website and mobile apps) and the backend (database, mailing list, etc.) of the platform. Learn more at our wiki page [here](https://github.com/cuhacking/cuHacking-wiki/wiki/Application-Server).

## Getting Started
This project uses yarn, wnich can be used to install all dependencies automatically:

`yarn install`

Otherwise, here is a list of all the dependencies use:
* [Express](https://expressjs.com/)
* [Firebase SDK](https://firebase.google.com/docs/reference/js)
* [mailchimp-api-v3](https://www.npmjs.com/package/mailchimp-api-v3)
* [crypto](https://nodejs.org/api/crypto.html)

### Configuration
Before you get started, you'll have to create a file called `config.json` in your project's root, which contains all the API keys/secrets, as well as a few other settings. Copy the following into your file, and substitute the indicated information:

```
{
    "production": {
        "firebase_url": "THE URL TO YOUR PROD FIREBASE DATABASE",
        "firebase_key_file": "THE PATH TO YOUR FIREBASE AUTHENTICATION JSON FILE, RELATIVE TO THE ROOT",
        "mailchimp_api_key": "YOUR MAILCHIMP API KEY",
        "credentials": {
            "username": "USERNAME TO DOCS",
            "password": "PASSWORD TO DOCS"
        },
        "allowed_origin": "ALLOWED ORIGINS (IF CORS IS AN ISSUE)",
        "api_root": "ROOT OF YOUR API'S DOMAIN (e.g. /api for blah.com/api)",
        "port": 1234
    },
    "development": {
        "firebase_url": "THE URL TO YOUR TEST FIREBASE DATABASE",
        "firebase_key_file": "THE PATH TO YOUR FIREBASE AUTHENTICATION JSON FILE, RELATIVE TO THE ROOT",
        "mailchimp_api_key": "YOUR MAILCHIMP API KEY",
                "credentials": {
            "username": "USERNAME TO DOCS",
            "password": "PASSWORD TO DOCS"
        },
        "allowed_origin": "ALLOWED ORIGINS (IF CORS IS AN ISSUE)",
        "api_root": "ROOT OF YOUR API'S DOMAIN (e.g. /api for blah.com/api)",
        "port": 1234
    }
}
```

## Running
A test server can be started on port 8080 (or, if you're using a PaaS, it'll use whichever port it gets assigned) with:

`yarn test`

To start for production (this tells Express to optimize for production and uses your production config settings):

`yarn start`

Automated tests for the API endpoints is available under the `tests` folder. These tests are made and need to be run with [Postman](https://github.com/cuhacking/cuHacking-wiki/wiki/Postman)


## Built with
* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Firebase](https://firebase.google.com/)
* [Mailchimp](https://mailchimp.com/)

