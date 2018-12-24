<template>
  <div class="search-bar">
    <div class="columns">
      <div class="column">
        <b-taginput
          v-model="genes"
          :data="autoCompleteRes"
          size="is-medium"
          class="is-uppercase"
          :loading="isFetching"
          autocomplete
          field="gene_symbol"
          @typing="getGeneNames" >
          
          <template slot-scope="props">
            <strong>HGNC: {{props.option.hgnc_id}}</strong> {{props.option.gene_symbol}} <i>{{props.option.gene_description}}</i>
          </template>

          <template slot="empty">
            There are no items
          </template>
          </b-taginput>
      </div>
      <div class="column is-narrow no-topbottom-padding" v-if="showButton">
        <button class="button is-medium is-fullwidth" @click="searchGenes">
          <b-icon icon="search"></b-icon>
          <span>Search</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  name: "SearchBar",
  props: {
    showButton: Boolean,
    genes: {
      default: () => [],
      type: Array
    },
    hasAssay: {
      default: false,
      type: Boolean
    },
    hasDiseasePhenotype: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      autoCompleteRes: [],
      isFetching: false,
    }
  },
  methods: {
    searchGenes() {
      // Extract gene names
      this.geneNames = [];
      for (const gene of this.genes) {
        this.geneNames.push(gene.gene_symbol);
      }

      // Give a warning if no gene was inputed
      if (this.geneNames.length == 0) {
        this.$snackbar.open({
          message: "Please enter a gene.",
          type: "is-warning",
          position: "is-top",
          actionText: "Retry",
        });
        return;
      }

      // Call router
      const dest = {
        path: "/summary",
        query: {
          gene: this.geneNames.join(","),
          hasAssay: this.hasAssay,
          hasDiseasePhenotype: this.hasDiseasePhenotype
        }
      };
      this.$router.push(dest);
    },
    getGeneNames: debounce(function(text) {
      // User have to type in at least two characters before initialting an autocomplete search to save computing resources
      if (text.length < 2) {
        this.isFetching = false;
        this.autoCompleteRes = [];
        return;
      }

      // Initiaite an autocomplete search
      // Here we use the NCBI Autocomplete API
      this.isFetching = true;
      this.autoCompleteRes = [];
      this.$http.get(`https://clinicaltables.nlm.nih.gov/api/genes/v3/search?terms=${text}&df=symbol,name&sf=symbol`)
      .then((data) => {
        const response = data.body;

        // Separate properties and populate the autocomplete list
        const hgncID = response[1];
        const fields = response[3];
        for (let index = 0; index < hgncID.length; index++) {
          const id = hgncID[index];
          const content = fields[index];

          const res = {
            hgnc_id: id,
            gene_symbol: content[0],
            gene_description: content[1]
          }
          this.autoCompleteRes.push(res);
        }

        this.isFetching = false;
      });
    })
  }
};
</script>

<style scoped>
.no-topbottom-padding {
  display: flex;
  align-items: center;
  padding-top: 0%;
  padding-bottom: 0%;
}
</style>
