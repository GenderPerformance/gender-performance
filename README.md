# VisiVox
A web application for trans folks that affirms voice transition by providing helpful auditory feedback with machine learning <br/> 

## Technologies Used
WaveSurver.JS <br/>
React <br/>
Redux <br/>
Node.JS <br/>
Amazon S3 <br/>
Google OAuth <br/>
PostgreSQL <br/>
Python <br/>
Pandas <br/>
Numpy <br/>
Keras Tensorflow <br/>
Librosa <br/>




## Install
npm install
npm run python-install

create a postgres database called visivox
npm run seed

## Secrets
create a secrets.js file in your root directory and add these environment
variables below

process.env.GOOGLE_CLIENT_ID = 'super secret'
process.env.GOOGLE_CLIENT_SECRET = 'that you don't tell people'
process.env.AWS_ACCESS_KEY_ID = 'so keep it secret'
process.env.AWS_SECRET_ACCESS_KEY = 'do not push it to github'
process.env.S3_BUCKET = 'keep these secret'

## Deployment
Update .travis.yml file with your encrypted heroku api key, your app name,
and which branch to deploy on.

Update your heroku config vars with the environment variables from above
if you want to deploy it.

Add Heroku buildpacks NodeJS, Python, https://github.com/heroku/heroku-buildpack-apt.
NodeJS has to be first

## Starting on localhost 8080
## For macs:
npm run start-dev

## For windows (in 2 terminal windows):
npm run start-build-client-watch
npm run start-server


