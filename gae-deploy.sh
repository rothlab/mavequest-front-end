#!/bin/bash

# Get version from travis tag
version=$1

### Submit source map to sentry
# Create a release
./node_modules/.bin/sentry-cli releases new -p mavequest $version

# Associate commits with the release
./node_modules/.bin/sentry-cli releases set-commits --auto $version

# Upload source maps
./node_modules/.bin/sentry-cli releases files $version upload-sourcemaps dist/js --rewrite

### Deploy to GAE
gcloud auth activate-service-account --key-file "travis-ci-gae-deploy.json"
gcloud app deploy --version ${version//./-} --project "glass-ally-143617"
