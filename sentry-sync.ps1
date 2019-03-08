$VERSION = .\node_modules\.bin\sentry-cli releases propose-version

# Create a release
.\node_modules\.bin\sentry-cli releases new -p mavequest $VERSION

# Associate commits with the release
.\node_modules\.bin\sentry-cli releases set-commits --auto $VERSION

# Upload source maps
.\node_modules\.bin\sentry-cli releases files $VERSION upload-sourcemaps /dist/js