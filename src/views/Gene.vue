<template>
  <div class="details">
    <!-- Header -->
    <section class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <div class="level">
            <div class="level-left">
              <h1 class="title">Gene: {{ geneName }}</h1>
            </div>
            <div class="level-right">
              <SearchBar showButton></SearchBar>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main -->
    <section class="section">
      <div class="container">
        <div class="columns">
          <!-- Table of Contents -->
          <div class="column is-3">
            <aside class="menu">
              <p class="menu-label">Assay</p>
              <p class="menu-label">Disease Phenotype</p>
            </aside>
          </div>

          <!-- Main Grid -->
          <div class="column">
            <section class="section is-paddingless">
              <h1 class="title">{{geneName}}</h1>
              <h2 class="subtitle">{{description}}</h2>

              <!-- Gene info -->
              <div class="block">
                <li>
                  Entrez ID:
                  <a
                    v-bind:href="'https://www.genecards.org/cgi-bin/carddisp.pl?gene=' + entrezID"
                    target="_blank"
                  >{{entrezID}}</a>
                </li>
                <li>
                  Ensembl ID:
                  <a
                    v-bind:href="'https://www.ensembl.org/Homo_sapiens/geneview?gene=' + ensemblID"
                    target="_blank"
                  >{{ensemblID}}</a>
                </li>
                <li>
                  OMIM ID:
                  <a
                    v-bind:href="'https://omim.org/entry/' + omimID"
                    target="_blank"
                  >{{omimID}}</a>
                </li>
                <li>Alias: {{alias.join(", ")}}</li>
              </div>
            </section>

            <div class="is-divider"></div>

            <section class="section is-paddingless">
              <h1 class="title">Assay</h1>
              <div class="container">
                <div class="block">
                  <b-icon size="is-medium" icon="fas fa-angle-right"></b-icon>
                  <span class="is-size-4">Yeast Complementation Assay</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar.vue";

export default {
  name: "gene-details",
  components: {
    SearchBar
  },
  created() {
    this.geneName = this.$route.params.name;
  },
  data() {
    return {
      description: "Ubiquitin Conjugating Enzyme E2 I",
      entrezID: "7329",
      ensemblID: "ENSG00000103275",
      omimID: "601661",
      alias: ["ARH", "ARH1", "ARH2", "FHCB1", "FHCB2"]
    };
  }
};
</script>

<style scoped>
.level-right {
  width: 50%;
}
.search-bar {
  width: 100%;
}
</style>