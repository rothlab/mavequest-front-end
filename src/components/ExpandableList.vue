<template>
  <div class="expandable-list">
    <nav class="panel">
      <div class="panel-heading">
        <b-field class="is-marginless is-hidden-tablet">
          <b-input
            placeholder="Filter..."
            type="search"
            icon="fas fa-search"
            v-model="filter"
            class="is-fullwidth"
          ></b-input>
        </b-field>

        <div class="level is-marginless is-hidden-mobile">
          <div class="level-left">{{heading}}</div>
          <div class="level-right">
            <b-field>
              <b-input placeholder="Filter..." type="search" icon="fas fa-search" v-model="filter"></b-input>
            </b-field>
          </div>
        </div>
      </div>

      <b-tabs
        @change="changeActive"
        v-if="isMultiPages"
        class="panel-block is-marginless is-vcentered block"
        position="is-centered"
        size="is-small"
        expanded
      >
        <b-tab-item v-for="name in tabNames" v-bind:key="name" :label="name"></b-tab-item>
      </b-tabs>
      <div class="is-scrollable">
        <a
          class="panel-block"
          v-for="item in currentElements.filter(item => item.toLowerCase().includes(filter.concat(filter, 'recessive')))"
          :key="item"
        >
          <b-tag class="is-warning">Recessive</b-tag>
          &nbsp;{{item.replace("{", "").replace("}", "")}}
        </a>
        <a
          class="panel-block"
          v-for="item in currentElements.filter(item => item.toLowerCase().includes(filter.concat(filter, 'dominant')))"
          :key="item"
        >
          <b-tag class="is-danger">Dominant</b-tag>
          &nbsp;{{item.replace("{", "").replace("}", "")}}
        </a>
        <a
          class="panel-block"
          v-for="item in currentElements.filter(item => (!item.toLowerCase().includes(['recessive']) 
          && !item.toLowerCase().includes(['dominant'])) && item.toLowerCase().includes(filter))"
          :key="item"
        >{{item.replace("{", "").replace("}", "")}}</a>
      </div>
      <a class="panel-block is-paddingless"></a>
    </nav>
  </div>
</template>

<script>
export default {
  name: "ExpandableList",
  props: {
    heading: String,
    names: Array,
    elements: Array
  },
  data() {
    return {
      filter: "",
      tabNames: [],
      isMultiPages: false,
      currentElements: []
    };
  },
  methods: {
    changeActive(index) {
      this.currentElements = this.elements[index];
    }
  },
  mounted() {
    if (this.names) {
      // Filter out undefined tabs
      this.tabNames = [this.names[this.elements.map(Boolean).indexOf(true)]];

      this.isMultiPages = true;
      this.changeActive(0);
    } else {
      this.currentElements = this.elements;
    }
  }
};
</script>

<style scoped>
.is-scrollable {
  overflow-y: scroll;
  width: auto;
  max-height: 12rem;
}
</style>
