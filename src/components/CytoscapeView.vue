<template>
  <div class="card">
    <div class="card-content is-paddingless">
      <div class="content cytoscape">
        <cytoscape :config="config" :preConfig="preConfig"/>
        <b-loading :active.sync="isLoading" :is-full-page="false" :can-cancel="true"></b-loading>
      </div>
    </div>
  </div>
</template>

<script>
import Panzoom from "cytoscape-panzoom";
import "cytoscape-panzoom/cytoscape.js-panzoom.css";

export default {
  name: "CytoscapeView",
  props: {
    head: {
      type: String,
      required: true
    },
    elements: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      config: {
        elements: [],
        style: [
          {
            selector: "node",
            style: {
              "background-color": "#3273DC",
              label: "data(id)"
            }
          },
          {
            selector: ".head",
            style: {
              "background-color": "#FF3860",
              label: "data(id)"
            }
          },
          {
            selector: "edge",
            style: {
              width: 3,
              "line-color": "#ccc",
              "target-arrow-color": "#ccc",
              "target-arrow-shape": "triangle"
            }
          }
        ]
      },
      isLoading: false,
      cy: Object
    };
  },
  mounted() {
    this.cyUpdate();
  },
  methods: {
    parseElement() {
      let nodes = [];
      let edges = [];

      // Add head node
      nodes.push({
        data: { id: this.head },
        classes: "head"
      });

      // Add other nodes and edges
      this.elements.forEach(node => {
        nodes.push({
          data: { id: node }
        });
        edges.push({
          data: { id: this.head + node, source: this.head, target: node }
        });
      });

      return nodes.concat(edges);
    },
    preConfig(cytoscape) {
      // Register zoom panel
      if (typeof cytoscape("core", "panzoom") !== "function") {
        Panzoom(cytoscape);
      }
    },
    cyUpdate() {
      this.isLoading = true;

      // Update the cytoscape instance
      this.$cytoscape.instance
        .then(cy => {
          // Remove all elements
          cy.remove(cy.elements());

          // Add the panzoom control
          cy.panzoom({
            sliderHandleIcon: "fas fa-minus",
            zoomInIcon: "fas fa-plus",
            zoomOutIcon: "fas fa-minus",
            resetIcon: "fas fa-expand"
          });

          // Add nodes and edges
          cy.add(this.parseElement());

          // Draw the graph and fit to the page
          cy.layout({
            name: "concentric",
            padding: 80,
            spacingFactor: 2,
            concentric: node => {
              return node.degree();
            },
            levelWidth: nodes => {
              // the letiation of concentric values in each level
              return nodes.maxDegree() / 4;
            }
          }).run();
          cy.reset();
          cy.center();
          cy.fit(80);
        })
        .then(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style>
.cytoscape {
  max-width: 500px;
  height: 500px;
}
.cy-panzoom-zoom-button > .icon {
  height: 0 !important;
  width: 0 !important;
}
.cy-panzoom-slider-handle > .icon {
  height: 0 !important;
  width: 0.5rem !important;
}
.cy-panzoom {
  margin: 1rem;
  z-index: 9 !important;
}
</style>
