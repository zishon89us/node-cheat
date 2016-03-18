# Node-Social

## How to run app

If you would like to download the code and try it for yourself:

1. Clone the repo
2. Install packages: `npm install`
3. Change out the database configuration in config/database.js
4. Change out auth keys in config/auth.js
5. Launch: `node server.js`
6. Visit in your browser at: `http://localhost:3000`

## What is inside app

### Simple user login Node.js/Express Facebook/Twitter connect using PassportJS

Using passport to authenticate twitter and facebook, trying to retrieve following data for both:

id, first_name, last_name, age, age_range, gender, location

Note: gender and age are not available in twitter api

