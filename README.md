![](docs/logo.png)

# The Frontend of MaveQuest

MaveQuest is an online database for querying literature-curated functional
assays, phenotypes and clinical interests of human genes for Multiplex Assays
of Variant Effect (MAVE) studies.

The frontend service of MaveQuest (**the Service**) is a Vue project that, once built, runs
on clients' browser.

The service receives requests from users, retrieve information from the
[MaveQuest API](https://api.mavequest.varianteffect.org) and parse and display
the information to users.

## Setup

### Checkout the code base and install dependencies

In order to run the Service, make sure that the source code and dependencies
are downloaded and installed properly.

```{bash}
# Check out source code
git checkout git@github.com:kvnkuang/mavequest-front-end.git
cd mavequest-front-end

# Install dependencies
npm install
```

### Compiles and hot-reloads for development

The Service uses [Vue-cli](https://cli.vuejs.org/) to run a demo server during
development. The demo server detects any changes you made to the source code
and provides a live preview.

**Do not use a demo server for production as the code is not optimized.**

In order to start the demo server, please run the following command.

```{bash}
npm run serve
```

### Compiles and minifies for production

The Service uses [Webpack](https://webpack.js.org/) to compile and create a
minimal, optimized code bundle for running in the production environment.

In order to build code for production, please run the following command.

```{bash}
npm run build
```

### Run your tests

The Service has implemented the ability for unit testing. A few sample test
cases have been written for `UnderConstructionView.vue`.

If you would like to add more test cases, please take a look at
[this document](https://vue-test-utils.vuejs.org/guides/testing-single-file-components-with-jest.html).

In order to run tests, please execute the following command.

**Please make sure all tests are passed before pushing code to Github.
You will not be able to merge code into `prod` branch with any errors.**

```{bash}
npm run test:unit
```

### Lints and fixes files

This Service uses [ESLint](https://github.com/vuejs/eslint-plugin-vue) to check
and fix syntax errors and violations of
[Vue.js Style Guide](https://vuejs.org/v2/style-guide/).

**Please make sure all problems detected by linting are fixed before pushing
code to Github. You will not be able to merge code into `prod` branch with
any linting problems.**

In order to lint your code, please run the following command.

```
npm run lint
```

## Push code

This Service automatically deploy code changes to production servers.

### Push code to development branches

You are free to push code to any development branches. For example, `v2` is
the current active development branch.
**However, you will not be able to push code directly into the production
branch (`prod`).**

This Service uses [Github Actions](https://github.com/rothlab/mavequest-front-end/actions) to monitor all code changes in the `prod` branch.
Github Actions will basically follow the **Setup** section above to inspect the codebase
for any errors.

If you are not familar with Git, you're highly recommendd to use a GUI
application (e.g. Github desktop) to handle all Git related requests.

Please follow [this instruction](https://help.github.com/en/desktop/contributing-to-projects/committing-and-reviewing-changes-to-your-project) to push code to a development
branch.

### Push code to the production branch `prod`

In short, you will not be able to push code directly into the `prod` branch.
Instead, you will have to push code to a development branch and request for a
**pull request**.

This design guarantees that all changes made to `prod` are intentional. Since `prod` branch hosts code that will run in the production
environment, we want to maintain the quality and stability of code in there.

#### Submit a Pull Request

Once you are happy with your code in a development branch, you can inititate
a pull request. Please take a look at [previous pull requests](https://github.com/kvnkuang/mavequest-front-end/pulls?q=is%3Apr+is%3Aclosed) and understand how they are
normally formatted.

If you are not sure about how to submit a pull request, please take a minute
to read [this document](https://help.github.com/en/articles/about-pull-requests).

You, or other contributors, can choose to accept or decline the pull request.
Once accepted, the code merges into the `prod` branch.

**Having code merged into the `prod` branch will trigger automatic deployment of the code changes to the production server.**

Congratulations! Your code is now on their way to the production server. Just
give it a couple minutes and refresh your browser to see the update.

## Contact me

Please feel free to [contact me](mailto:kvn.kuang@mail.utoronto.ca) if you still
have questions.

This manual was last updated on 2022-07-28.
