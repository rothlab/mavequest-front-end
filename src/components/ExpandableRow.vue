<template>
  <div class="expandable-row">
    <b-tag
      class="is-light element"
      v-bind:class="{ 'is-uppercase': bold }"
      v-for="element in total_elements"
      v-bind:key="element"
    >
      <!-- Add link if prefix is given -->
      <a
        v-if="!!link_prefix"
        :href="link_prefix + element"
        target="_blank"
        rel="noopener noreferrer"
      >{{element}}</a>
      <span v-else>{{element}}</span>
    </b-tag>

    <b-tag
      v-if="elements.length > parseInt(preview_items)"
      class="has-background-grey"
      @click.native="isExpandDetail = !isExpandDetail"
    >
      <b-icon
        type="is-white"
        pack="fas"
        v-bind:icon="isExpandDetail ? 'minus' : 'plus'"
        size="is-small"
      ></b-icon>
    </b-tag>
  </div>
</template>

<script>
export default {
  name: "ExpandableRow",
  props: {
    elements: Array,
    preview_items: String,
    bold: Boolean,
    link_prefix: String
  },
  data() {
    return {
      isExpandDetail: false,
    };
  },
  computed: {
    total_elements: function() {
      if (!this.isExpandDetail) {
        return this.elements.slice(0, parseInt(this.preview_items));
      } else {
        return this.elements
      }
    }
  }
};
</script>

<style scoped>
.element {
  margin-right: 5px;
}
@media all and (max-width: 768px) {
  .element {
    justify-content: left;
    max-width: 200px;
  }
  .element > span > span {
    display: block;
    max-width: 185px;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }
}
.element:last-child {
  margin-right: 0px;
}
</style>
