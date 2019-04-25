<template>
  <div class="redirect">
    <section class="section is-medium has-text-centered fill-screen-withoutheader">
      <b-loading :active="isLoading" :is-full-page="false"></b-loading>
      <h1 class="title has-text-grey">{{isLegit ? "Redirecting" : "Error"}}</h1>
      <h1 class="subtitle has-text-grey">{{redirect_link}}</h1>
    </section>
  </div>
</template>

<script>
const validStates = ["spombe"];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  name: "redirect",
  components: {},
  data() {
    return {
      isLegit: true,
      isLoading: true,
      params: [],
      redirect_link: "",
      canRedirect: false
    };
  },
  mounted() {
    // Validate Parameters
    this.isLegit = this.validateParams(this.$route.params.params);

    // Apply redirection logic
    if (this.isLegit) {
      this.params = this.$route.params.params.split("+");
      this.redirectLink(this.params);
    } else {
      // Finish loading
      this.isLoading = false;
    }
  },
  watch: {
    canRedirect: async function(val) {
      // Start redirecting
      await sleep(2000);
      if (val) window.location.replace(this.redirect_link);
    }
  },
  methods: {
    validateParams(params) {
      // Step 1: check if params are separated by +
      if (!params.includes("+")) {
        this.redirect_link = "Invalid parameters"
        return false;
      }

      // Step 2: check if missing params
      let splits = params.split("+");
      if (splits.some(s => s === "")) return false;

      // Step 3: check if the first paramemter is in the valid list
      if (!validStates.includes(splits[0])) return false;

      return true;
    },
    redirectLink(params) {
      switch (params[0]) {
        case "spombe":
          {
            // Get gene id from pombase
            const api =
              "https://www.pombase.org/api/v1/dataset/latest/data/gene_summaries";
            const query = params[1].toLowerCase();

            this.$http.get(api).then(res => {
              const geneSummary = res.body;
              const gene = geneSummary.filter(e => e.name == query)
                .map(e => e.uniquename);

              // Check if anything returned
              if (gene.length < 1) {
                this.isLegit = false;
                this.redirect_link = query.toUpperCase()
                  + " is not a valid gene for S. pombe.";
              } else {
                this.isLegit = true;
                this.redirect_link = "https://www.pombase.org/gene/" + gene;
                this.canRedirect = true;
              }
            }).then(() => { 
              this.isLoading = false;
            });
          }
          break;
        default:
          break;
      }
    }
  }
};
</script>
