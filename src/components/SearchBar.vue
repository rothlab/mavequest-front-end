<template>
  <div class="search-bar is-fullwidth">
    <b-field style="margin-bottom: 0;">
      <b-taginput
        icon="search"
        icon-pack="fas"
        ref="searchBar"
        v-model="genes"
        :data="autoCompleteRes"
        size="is-medium"
        :loading="isFetching"
        autocomplete
        field="gene_symbol"
        @typing="getGeneNames"
        class="search"
        @submit="searchGenes"
        placeholder="Search with Gene Symbol"
      >
        <template slot-scope="props">
          <!-- Full-view autocomplete list -->
          <div>
            <div class="columns is-marginless" v-if="isFullView">
              <div class="column is-one-third no-topbottom-padding">
                <p
                  class="is-size-5"
                  v-html="props.option.gene_symbol.replace(RegExp(text, 'ig'), '<strong>$&</strong>')"
                ></p>
              </div>

              <div class="column autocomplete-right">
                HGNC: {{props.option.hgnc_id}}
                <i v-if="props.option.alias_symbol.length > 0">
                  , Alias:
                  <span v-html="props.option.alias_symbol.join(', ')"></span>
                </i>
                <br />
                <p class="is-size-7 is-capitalized">{{props.option.gene_description}}</p>
              </div>
            </div>

            <!-- Compact-view autocomplete list -->
            <div v-else>
              <span
                v-html="props.option.gene_symbol.replace(RegExp(text, 'ig'), '<strong>$&</strong>')"
              ></span>
              ({{props.option.hgnc_id}})
              <i
                v-if="props.option.alias_symbol.length > 0"
              >
                Alias:
                <span v-html="props.option.alias_symbol.join(', ')"></span>
              </i>
            </div>
          </div>
        </template>

        <template slot="empty">{{emptyMessage}}</template>
      </b-taginput>
      <p class="control is-hidden-mobile" style="margin-left:-0.5rem">
        <button
          v-if="showButton"
          class="button is-medium is-fullheight is-info has-text-white"
          @click="searchGenes"
        >Search</button>
      </p>
    </b-field>
    
    <div class="is-hidden-tablet" style="margin-top:0.5rem">
      <button
        v-if="showButton"
        class="button is-medium is-fullwidth is-info has-text-white"
        @click="searchGenes"
      >Search</button>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import uniq from "lodash/uniq";
import { Promise } from "q";

function initialState() {
  return {
    autoCompleteRes: [],
    isFetching: false,
    emptyMessage: "No genes found.",
    isFullView: true,
    geneNames: [],
    genes: []
  };
}

export default {
  name: "SearchBar",
  props: {
    showButton: Boolean
  },
  data() {
    return initialState();
  },
  methods: {
    resetData() {
      Object.assign(this.$data, initialState());
    },
    searchGenes() {
      // Extract gene names
      for (let gene of this.genes) {
        if (typeof gene === "object") {
          this.geneNames.push(gene.gene_symbol);
        } else if (typeof gene === "string") {
          this.geneNames.push(gene);
        }
      }

      // Give a warning if no gene was inputed
      if (this.geneNames.length === 0) {
        this.$snackbar.open({
          message: "Please select a gene from the dropdown menu.",
          type: "is-warning",
          position: "is-top",
          actionText: "Retry"
        });
        return;
      }

      // Find unique genes
      this.geneNames = uniq(this.geneNames);

      // If only one gene, jump directly to detail page
      let dest = {};
      if (this.geneNames.length === 1) {
        dest = { path: "/gene/" + this.geneNames.join(",") };
      } else {
        dest = {
          path: "/query",
          query: { gene: this.geneNames.join(",") }
        };
      }

      // Call router
      this.resetData();
      this.$router.push(dest);
    },
    autocomplete({ text, resolve, reject }) {
      this.$http
        .get(
          `https://clinicaltables.nlm.nih.gov/api/genes/v3/search?terms=${text}&df=symbol,name,alias_symbol&sf=symbol,alias_symbol&maxList=`
        )
        .then(data => {
          const response = data.body;

          // Separate properties and populate the autocomplete list
          const hgncID = response[1];
          const fields = response[3];
          const aliasList = [];
          for (let index = 0; index < hgncID.length; index++) {
            const id = hgncID[index];
            const content = fields[index];

            const res = {
              hgnc_id: id,
              gene_symbol: content[0],
              gene_description: content[1],
              alias_symbol: content[2]
                .split("|")
                .filter(Boolean)
                .map(res =>
                  res
                    .trim()
                    .replace(RegExp(this.text, "ig"), "<strong>$&</strong>")
                )
            };

            // Rank autocomplete results so that direct matches of gene symbols will come first
            if (res.gene_symbol.match(RegExp(this.text, "ig"))) {
              this.autoCompleteRes.push(res);
            } else {
              aliasList.push(res);
            }
          }

          this.autoCompleteRes = this.autoCompleteRes.concat(aliasList);
          resolve();
        })
        .catch(res => {
          if (this.attempt++ < 2) {
            // Wait for 1 second before retry
            setTimeout(
              () => this.autocomplete({ text, resolve, reject }),
              1000
            );
          } else {
            reject(res);
          }
        });
    },
    getGeneNames: debounce(function(text) {
      // User have to type in at least two characters before initialting an autocomplete search to save computing resources
      if (text.length < 2) {
        this.isFetching = false;
        this.emptyMessage = "Please enter at least 2 characters.";
        this.autoCompleteRes = [];
        return;
      }

      // Determine which dropdown style should be used
      const autocompleteDropdownWidth = document.getElementsByClassName(
        "autocomplete control"
      )[0].clientWidth;
      if (autocompleteDropdownWidth < 450) {
        // Use full-size style
        this.isFullView = false;
      } else {
        // Use compact style
        this.isFullView = true;
      }

      // Initiaite an autocomplete search
      // Here we use the NCBI Autocomplete API
      this.text = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      this.isFetching = true;
      this.autoCompleteRes = [];
      this.emptyMessage = "Fetching gene info...";
      this.attempt = 0;
      new Promise((resolve, reject) =>
        this.autocomplete({ text, resolve, reject })
      ).then(() => {
        this.isFetching = false;
        this.emptyMessage = "No genes found.";
      });
    })
  }
};
</script>

<style scoped>
.search {
  vertical-align: baseline !important;
  height: 100%;
  width: 100%;
}
.no-topbottom-padding {
  display: flex;
  align-items: center;
  padding-top: 0%;
  padding-bottom: 0%;
}
.autocomplete-right {
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
}
</style>
