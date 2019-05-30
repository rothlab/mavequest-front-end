<template>
  <div class="search-filter">
    <!-- Add a collapse wrapper on mobile device -->
    <b-collapse :open.sync="isOpen" class="card below-search" aria-id="advancedSearch">
      <div
        slot="trigger"
        slot-scope="props"
        role="button"
        aria-controls="advancedSearch"
        class="card-header"
      >
        <p class="card-header-title">Advanced Search</p>
        <a class="card-header-icon">
          <b-icon pack="fas" :icon="props.open ? 'chevron-down' : 'chevron-up'"></b-icon>
        </a>
      </div>
      <div class="card-content">
        <div class="columns is-fullwidth">
          <div class="column">
            <div class="field">
              <span>Potential Assays &nbsp;</span>
              <FilterView
                :filters="filterParams.availAssays"
                :formatter="filterParams.formatTag"
                :prevSelected="filterList"
                @updateFilter="updateRes"
              ></FilterView>
            </div>

            <div class="field">
              <span>Disease Phenotypes &nbsp;</span>
              <FilterView
                :filters="filterParams.availPhenotypes"
                :formatter="filterParams.formatTag"
                :prevSelected="filterList"
                @updateFilter="updateRes"
              ></FilterView>
            </div>
          </div>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import FilterView from "@/components/FilterView.vue";
import FilterParams from "@/assets/filterParams.js";

export default {
  name: "SearchFilter",
  components: {
    FilterView
  },
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
  data() {
    return {
      assayStatus: this.hasAssay,
      diseaesPhenotypeStatus: this.hasDiseasePhenotype,
      isOpen: window.innerWidth >= 768,
      filterList: [],
      filterParams: FilterParams
    };
  },
  methods: {
    updateRes(val, total) {
      // Update the filter list accordingly
      const left = this.filterList.filter(e => !total.includes(e));
      this.filterList = val.concat(left);
      this.$emit("updatedSearchFilter", this.filterList);
    },
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
