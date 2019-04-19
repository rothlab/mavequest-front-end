<template>
  <div class="expandable-row">
    <b-tag
      class="is-light element"
      v-for="element in total_elements"
      v-bind:key="element"
    >{{element}}</b-tag>
    
    <b-tooltip v-if="elements.length > preview_items" 
        type="is-info"
        :label="isExpandDetail ? 'Collapse' : 'Expand'" animated
        >
        <b-tag
            class="has-background-grey element"
            @click.native="expandShrinkElements"
        >
            <b-icon type="is-white" pack="fas" 
              v-bind:icon="isExpandDetail ? 'minus' : 'plus'" 
              size="is-small"></b-icon>
        </b-tag>
    </b-tooltip>
  </div>
</template>

<script>
export default {
    name: "ExpandableRow",
    props: {
        elements: Array,
        preview_items: Number
    },
    data() {
      return {
        isExpandDetail: false,
        total_elements: []
      }
    },
    mounted() {
      // Init a preview list of elements
      this.total_elements = this.elements.slice(0, this.preview_items);
    },
    methods: {
      expandShrinkElements() {
        if (this.isExpandDetail) {
          this.total_elements = this.elements.slice(0, this.preview_items);
        } else {
          this.total_elements = this.elements;
        }
        
        this.isExpandDetail = !this.isExpandDetail;
      }
    } 
}
</script>

<style scoped>
.element {
  margin-right: 5px;
}
</style>
