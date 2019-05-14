# Get version from travis tag
version=$1

### Run test cases
npm run test:unit

### Submit source map to sentry
# Create a release
sentry-cli releases new -p mavequest $version

# Associate commits with the release
sentry-cli releases set-commits --auto $version

# Upload source maps
sentry-cli releases files $version upload-sourcemaps dist/js --rewrite

### Deploy to GAE
gcloud auth activate-service-account --key-file ./travis-ci-gae-deploy.json
gcloud app deploy --version $version --project "glass-ally-143617"