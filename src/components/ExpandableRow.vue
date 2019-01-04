<template>
  <div class="expandable-row">
    <div v-if="!isExpandDetail">
      <b-tag
        class="is-light element"
        v-for="element in elements.slice(0, 5)"
        v-bind:key="element"
      >{{element}}</b-tag>
      <b-tooltip type="is-info" label="Expand the List" animated>
        <button
            class="button is-small has-background-grey-lighter element is-rounded"
            @click="isExpandDetail = !isExpandDetail"
        >
            <b-icon class="fas fa-caret-down"></b-icon>
        </button>
      </b-tooltip>
    </div>

    <b-collapse :open.sync="isExpandDetail">
      <b-tag
        class="is-light element"
        v-for="element in elements"
        v-bind:key="element"
      >{{element}}</b-tag>
      <b-tooltip type="is-info" label="Collapse the List" animated>
        <button
            class="button is-small has-background-grey-lighter element is-rounded"
            @click="isExpandDetail = !isExpandDetail"
        >
            <b-icon class="fas fa-caret-up"></b-icon>
        </button>
      </b-tooltip>
    </b-collapse>
  </div>
</template>

<script>
export default {
    name: "ExpandableRow",
    props: {
        elements: []
    },
    data() {
        return {
            isExpandDetail: false
        }
    }
}
</script>

<style scoped>
.element {
  margin-right: 5px;
}
</style>
