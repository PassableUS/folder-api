 [TOC]

# Folder Web Client

API for clients to consume (master branch automatically deployed at **api.folder.me**.

## Installation

1. Navigate to the root directory
2. Run `npm install`
3. Proceed to [Configuration](#Configuration)

## Configuration

1. Copy the `.env.example` file and rename the copy to `.env`
2. Keep the fields as specified by the example in order to use the default configuration (recommended for development).
3. **If you wish to use Google OAuth or Facebook OAuth, register with the respective service for an API key and place the keys in the .env file**
4. Specify a value for `SECRET` in **.env**
5. Host a mongoDB instance (or provision one using mongoDB Atlas, Heroku, etc. and provide the URI to `MONGODB_URI` in **.env**
6. Run `npm run develop` to start developing!

## Project Overview

Within the **/src** folder, you'll find the source of the project in the following layout:

* **/models**: Defined database models using Mongoose
* **/controllers**: Modules related to a particular API route of which business logic for a particular route is laid out
* **/utils**: Various utility functions that can be reused and are not specific to a particular function
* **/tests**: Unit + Integration tests using Jest

### Notable files:

* **/app.js**: Responsible for binding routes, registering middleware, etc.
* **/server.js**: Creates the HTTP server from the `app` module.
