#!/bin/bash

# Get version from travis tag
version=$1

### Unzip encrypted credentials
openssl aes-256-cbc -K $encrypted_e9464e2524e7_key -iv $encrypted_e9464e2524e7_iv -in credentials.tar.enc -out credentials.tar -d
tar xvf credentials.tar

### Submit source map to sentry
# Create a release
./node_modules/.bin/sentry-cli releases new -p mavequest $version

# Associate commits with the release
./node_modules/.bin/sentry-cli releases set-commits --auto $version

# Upload source maps
./node_modules/.bin/sentry-cli releases files $version upload-sourcemaps dist/js --rewrite

### Deploy to GAE
gcloud auth activate-service-account --key-file "travis-ci-gae-deploy.json"
gcloud app deploy --version ${version/./---} --project "glass-ally-143617"

### Delete credentials
rm travis-ci-gae-deploy.json .sentryclirc