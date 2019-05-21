<template>
  <section class="section is-medium has-text-centered">
    <h1 class="title has-text-grey">
      <b-icon :icon="errorIcon"></b-icon>
    </h1>
    <h1 class="subtitle has-text-grey has-errorMsg-padding" 
      v-html="errorMessage" v-if="!isRateLimitError"></h1>
    <h1 class="subtitle has-text-grey has-errorMsg-padding" v-else>
      <b-tooltip 
        type="is-dark" 
        label="Each user can query up to 100 times per 15 minutes." 
        dashed>
        Query rate limit
      </b-tooltip> reached. <br />
      Please slow down and try again in {{rateLimitRetry}} minute(s).
    </h1>
  </section>
</template>

<script>
export default {
    name: "ErrorView",
    props: {
      icon: {
        type: String
      },
      response: {
        type: [String, Object]
      }
    },
    data: function() {
      return {
        errorMessage: "Error Found",
        errorIcon: "fas fa-exclamation-triangle",
        isRateLimitError: false,
        rateLimitRetry: 15
      }
    },
    created() {
      this.updateErrorComponent();
    },
    beforeUpdate() {
      this.updateErrorComponent();
    },
    methods: {
      updateErrorComponent: function() {
        // Handle error icon 
        this.errorIcon = this.icon ? this.icon : this.errorIcon;

        // If only display a static error message
        if (this.response && typeof this.response === "string") {
          this.errorMessage = this.response;
        } else if (this.response && typeof this.response === "object") {
          // If needed to handle API Error from the backend
          this.parseAPIError(this.response);
        }
      },
      parseAPIError: function(response) {
          // Error handling
          const errorStats = response.status;
          let resetDate = Date;

          // Handle common error
          switch (errorStats) {
            case 404:
              this.errorMessage = "No record found. <br /> " 
                + "Please adjust your search term and try again.";
              this.errorIcon = "fas fa-search-minus";
              break;
            case 429:
              this.isRateLimitError = true;
              resetDate = new Date(parseInt(response.headers
                .get('X-RateLimit-Reset')) * 1000);
              this.rateLimitRetry = 
                Math.ceil(parseInt(resetDate - Date.now()) / 1000 / 60);
              this.errorIcon = "fas fa-hourglass-half";
              break;
            case 406: case 400:
              this.errorMessage = response.body;
              break;
            case 0:
              this.errorMessage = "Failed to connect to servers. <br /> "
                + "Please check your Internet connection.";
              break;
            default:
              break;
          }
      }
    }
}
</script>

<style scoped>
.has-errorMsg-padding {
  padding: 1rem;
}
</style>

