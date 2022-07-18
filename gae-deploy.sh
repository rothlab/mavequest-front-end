#!/bin/bash

# Get version from travis tag
version=$1

### Unencrypt credentials
openssl aes-256-cbc -K $encrypted_e9464e2524e7_key -iv $encrypted_e9464e2524e7_iv -in credentials.tar.enc -out credentials.tar -d
tar xvf credentials.tar

### Update Google Cloud SDK
if [ ! -d "$HOME/google-cloud-sdk/bin" ]; then 
    rm -rf "$HOME/google-cloud-sdk";
    curl https://sdk.cloud.google.com | bash > /dev/null; 
fi
source $HOME/google-cloud-sdk/path.bash.inc
gcloud components update

### Submit source map to sentry
# Create a release
./node_modules/.bin/sentry-cli releases new -p mavequest $version

# Associate commits with the release
./node_modules/.bin/sentry-cli releases set-commits --auto $version

# Upload source maps
./node_modules/.bin/sentry-cli releases files $version upload-sourcemaps dist/js --rewrite

### Deploy to GAE
gcloud auth activate-service-account --key-file "travis-ci-gae-deploy.json"
gcloud app deploy --quiet --version ${version//./-} --project "glass-ally-143617"

### Remove credentials
rm credentials.tar travis-ci-gae-deploy.json .sentryclirc