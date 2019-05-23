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
  "rnorvegicus", "drerio"];

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
      taxonInfo: {
        'mmusculus': {
          id: 10090,
          name: 'M. musculus',
          link: 'http://www.informatics.jax.org/marker/'
        },
        'dmelanogaster': {
          id: 7227,
          name: 'D. melanogaster',
          link: 'https://flybase.org/reports/'
        },
        'rnorvegicus': {
          id: 10116,
          name: 'R. norvegicus',
          link: 'https://rgd.mcw.edu/rgdweb/report/gene/main.html?id='
        },
        'drerio': {
          id: 7955,
          name: 'D. rerio',
          link: 'https://zfin.org/'
        },
      }
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

      switch (species) {
        case "scerevisiae":
          {
            this.isLegit = true;
            this.redirect_link = "https://www.yeastgenome.org/locus/" + query;
            this.isLoading = false;
            this.canRedirect = true;
          }
          break;
        case "spombe":
          {
            // Get gene id from pombase
            const api =
              "https://www.pombase.org/api/v1/dataset/latest/data/gene_summaries";

            this.$http.get(api).then(res => {
              const geneSummary = res.body;
              const gene = geneSummary.filter(e => e.name == query)
                .map(e => e.uniquename);

              // Check if anything returned
              if (gene.length < 1) {
                this.isLegit = false;
                this.redirect_link = query.toUpperCase()
                  + " is not a valid gene for" + this.taxonName[species] + ".";
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
        case "mmusculus": case "dmelanogaster": case "rnorvegicus": case "drerio":
          {
            // Get gene id from mousemine
            const xml = '<query model="genomic" view="Gene.primaryIdentifier"' +
            ' sortOrder="Gene.symbol ASC" constraintLogic="A and B" name="Gene_strain_genes">' +
            '<constraint path="Gene.organism.taxonId" op="=" value="' + this.taxonInfo[species].id + '" code="B" />' +
            '<constraint path="Gene" op="LOOKUP" value="' + query + '" code="A" /></query>';
            const api = 'http://www.mousemine.org/mousemine/service/query/results?query='

            this.$http.get(api + xml).then(res => {
              const gene = res.body.results;

              // Check if anything returned
              if (gene.length < 1) {
                this.isLegit = false;
                this.redirect_link = query.toUpperCase()
                  + " is not a valid gene for " + this.taxonInfo[species].name + ".";
              } else {
                this.isLegit = true;
                this.redirect_link = this.taxonInfo[species].link + gene[0];
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
