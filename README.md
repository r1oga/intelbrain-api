# Intelbrain API
API used for my [intelbrain](https://github.com/r1oga/intelbrain-client) application.

## What it does
### User management
- CRUD user profiles
- Store hashed password
- Require authentication to access specific routes
### Face recognition
- Store URL of uploaded images
- Return dimensions of the frames identifying where faces are in an uploaded image
- Track how many images an user has uploaded and grant corresponding badge 
## How it is built
- API Sever: [express](https://expressjs.com/)
- Storage (user profiles, images URL, hashed passwords): [postgreSQL](https://www.postgresql.org/) DB
- Password hashing: [bcrypt](https://www.npmjs.com/package/bcrypt-nodejs)
- Session management: [REDIS](https://redis.io/) DB + [JSON Web Token](https://jwt.io/) + [`window.sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- Face Recognition Feature: [Clarifai](https://www.clarifai.com/) API
- Containerization: [Docker](https://www.docker.com/) 
## Local development
1. Clone this repository
2. Add your own API key in the [`controllers/image.js`](https://github.com/r1oga/intelbrain-api/blob/00674da1feb4c7f694fa5711a8ff6fc0bec130a2/controllers/image.js#L5) file to connect to [Clarifai](https://www.clarifai.com/) API.
2. Build and run docker containers: `docker-compose up --build`
## Resource / Credit
This project was part of [Andrei Neagoie](https://github.com/aneagoie)'s [The Complete Junior to Senior Web Developer Roadmap](https://www.udemy.com/course/the-complete-junior-to-senior-web-developer-roadmap/) course.

1. Clone this repo
2. Run `npm install`
3. Run `npm start`
4. You must 

You can grab Clarifai API key [here](https://www.clarifai.com/)
