<template>
    <b-dropdown hoverable multiple v-model="selected" @change="emitFiltersChanged">
        <button class="button is-small is-light" slot="trigger">
          <i class="fas fa-filter"></i>
          <div class="has-text-link has-text-weight-bold">
            <span v-if="selected.length > 0">
              &nbsp; {{selected.length}}
            </span>
          </div>
        </button>

        <b-dropdown-item v-for="item in filters" 
          :key="item" :value="item" class="is-capitalized">
          {{formatter(item)}}
        </b-dropdown-item>
      </b-dropdown>
</template>

<script>
export default {
    name: "summary-filter",
    props: {
        filters: Array,
        formatter: Function,
        prevSelected: Array
    },
    data() {
        return {
            selected: []
        }
    },
    mounted() {
        this.selected = this.prevSelected.filter(e => this.filters.includes(e));
    },
    methods: {
        emitFiltersChanged() {
            this.$emit('updateFilter', this.selected, this.filters);
        }
    }
}
</script>
