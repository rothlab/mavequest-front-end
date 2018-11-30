<template>
  <div class="search-filter">
    <div class="card below-search">
      <div class="card-header">
        <p class="card-header-title">Advanced Search</p>
      </div>
      <div class="card-content">
        <section class="has-text-left">
          <div class="field">
            <b-switch v-model="assayStatus" @input="emitFilterChanged">Has Assay</b-switch>
          </div>
          <div class="field">
            <b-switch v-model="diseaesPhenotypeStatus" @input="emitFilterChanged">Has Disease Phenotype</b-switch>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchFilter",
  props: {
    hasAssay: {
      default: false,
      type: Boolean
    },
    hasDiseasePhenotype: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      assayStatus: this.hasAssay,
      diseaesPhenotypeStatus: this.hasDiseasePhenotype
    }
  },
  methods: {
    emitFilterChanged () {
      let filter = {
        hasAssay: this.assayStatus,
        hasDiseasePhenotype: this.diseaesPhenotypeStatus
      };
      this.$emit('updatedSearchFilter', filter);
    }
  }
};
</script>
