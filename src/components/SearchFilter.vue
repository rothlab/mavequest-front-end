<template>
  <div class="search-filter">
    <div class="card below-search">
      <div class="card-header">
        <p class="card-header-title">Advanced Search</p>
      </div>
      <div class="card-content">
        <section class="has-text-left">
          <div class="field">
            <b-switch>Has Assay</b-switch>
          </div>
          <div class="field">
            <b-switch>Has Disease Phenotype</b-switch>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchFilter"
};
</script>
