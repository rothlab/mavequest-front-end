<template>
  <div class="search-bar">
    <div class="container">
      <div class="columns">
        <div class="column">
          <b-taginput size="is-medium"></b-taginput>
        </div>
        <div class="column is-narrow">
          <button class="button is-medium">
            <b-icon icon="search"></b-icon>
            <span>Search</span>
          </button>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <b-collapse class="card search-option">
            <div class="card-header">
              <p class="card-header-title">Advanced Search</p>
            </div>
            <div class="card-content">
                <section class="has-text-left search-option">
                    <div class="field"><b-switch>Has Assay</b-switch></div>
                    <div class="field"><b-switch>Has Disease Phenotype</b-switch></div>
                </section>
            </div>
          </b-collapse>
        </div>
        <div class="column">
          <div class="card search-option">
            <header class="card-header">
              <p class="card-header-title">Database Summary</p>
            </header>
            <div class="card-content">
              <div class="content has-text-left is-medium">
                <a>List all genes with potential assays</a>
                <br>
                <a>List all genes with disease phenotypes</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar"
  //   props: {
  //     msg: String
  //   }
};
</script>

<style scoped>
.search-option {
    height: 100%;
    align-items: center
}
</style>
