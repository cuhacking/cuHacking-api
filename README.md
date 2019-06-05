# cuHacking: Application Server
The application server is a server application which defines the REST API endpoints and functionality with will be used for interfacing between the frontend (website and mobile apps) and the backend (database, mailing list, etc.) of the platform.

## Getting started
This project uses node package manager (npm), wnich can be used to install all dependencies automatically:

`npm install`

Otherwise, here is a list of all the dependencies use:
* [Express](https://expressjs.com/)
* [Firebase SDK](https://firebase.google.com/docs/reference/js)
* [mailchimp-api-v3](https://www.npmjs.com/package/mailchimp-api-v3)
* [crypto](https://nodejs.org/api/crypto.html)

## Testing
A test server can be started on port 8080 (or, if you're using a PaaS, it'll use whichever port it assigns it) with:
`npm start`


## Built with
* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Firebase](https://firebase.google.com/)
* [Mailchimp](https://mailchimp.com/)

