# Visivox

**http://visivox.herokuapp.com/home**
![visivox](https://user-images.githubusercontent.com/64286678/138532874-12095e6b-7d67-4674-abb2-a85e8915c5ca.png)



Designed as a proof of concept for an application to help individuals understand how their voice may be perceived, we use machine learning and audio analysis to generate a gender perception based on a recording.

Labeling gender is inherently reductive and doesn't take into the broad spectrum of genders that exist in the world. In this, the application demonstrates some of the limitations of machine learning and data classification. Our goal is not to enforce the binary further, but to hopefully provide a tool that can help individuals improve their gender performance. We're not there yet, but we hope to be one day.


Technologies Used
WaveSurver.JS
React
Redux
Node.JS
Amazon S3
Google OAuth
PostgreSQL
Python
Pandas
Numpy
Keras Tensorflow
Librosa




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


