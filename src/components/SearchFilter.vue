<template>
  <div class="search-filter">
    <div class="card below-search" v-if="!isMobile">
      <div class="card-header">
        <p class="card-header-title">Advanced Search</p>
      </div>
      <div class="card-content">
        <section class="has-text-left">
          <div class="field">
            <b-switch type="is-info" v-model="assayStatus" @input="emitFilterChanged">Has Potential Assay</b-switch>
          </div>
          <div class="field">
            <b-switch type="is-info" v-model="diseaesPhenotypeStatus" @input="emitFilterChanged">Has Disease Phenotype</b-switch>
          </div>
        </section>
      </div>
    </div>
    
    <!-- Add a collapse wrapper on mobile device -->
    <b-collapse v-else :open.sync="isOpen" class="card below-search" aria-id="advancedSearch">
      <div slot="trigger" slot-scope="props" role="button" aria-controls="advancedSearch"
        class="card-header">
        <p class="card-header-title">Advanced Search</p>
        <a class="card-header-icon">
          <b-icon pack="fas" :icon="props.open ? 'chevron-down' : 'chevron-up'"></b-icon>
        </a>
      </div>
      <div class="card-content">
        <section class="has-text-left">
          <div class="field">
            <b-switch type="is-info" v-model="assayStatus" @input="emitFilterChanged">Has Potential Assay</b-switch>
          </div>
          <div class="field">
            <b-switch type="is-info" v-model="diseaesPhenotypeStatus" @input="emitFilterChanged">Has Disease Phenotype</b-switch>
          </div>
        </section>
      </div>
    </b-collapse>
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
      diseaesPhenotypeStatus: this.hasDiseasePhenotype,
      isOpen: window.innerWidth >= 768,
      isMobile: window.innerWidth < 768
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

<style scoped>
.card-content {
  display: flex;
  height: calc(100% - 48px);
  align-items: center;
}
</style>
