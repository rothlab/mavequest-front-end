<template>
  <div class="redirect">
    <section class="section is-medium has-text-centered fill-screen-withoutheader">
      <b-loading :active="isLoading" :is-full-page="false"></b-loading>
      <h1 class="title has-text-grey">{{isLegit ? "Redirecting" : "Error: Invalid link"}}</h1>
      <h1 class="subtitle has-text-grey">{{redirect_link}}</h1>
    </section>
  </div>
</template>

<script>
const validStates = ["scerevisiae", "spombe", "mmusculus", "dmelanogaster", 
  "rnorvegicus", "drerio", "celegans"];

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
      canRedirect: false,
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
      const species = params[0];
      const query = params[1].toLowerCase();
      
      // Look up gene name and species
      const config = { params: { species: species } }
      this.$http.get(`${this.$apiEntryPoint}/lookup/${query}`, config)
        .then(res => {
          const lookup = res.body;
          if (Object.keys(lookup).length === 0 
                && lookup.constructor === Object) {
              this.isLegit = false;
              this.redirect_link = query.toUpperCase() + " is not a valid gene.";
              this.canRedirect = false;
              return;
          }

          this.isLegit = true;
          this.redirect_link = lookup.destDbLink;
          this.canRedirect = true;
        })
        .then(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>
