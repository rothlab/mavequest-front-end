<template>
  <div class="card">
    <div class="card-image">
      <div class="content cytoscape">
        <cytoscape :config="config" :preConfig="preConfig"/>
        <b-loading :active.sync="isLoading" :is-full-page="false" :can-cancel="true"></b-loading>
      </div>
    </div>
    <div class="card-content" v-if="showMessage">
      <b-message type="is-info">
          <div class="columns">
            <div class="column is-2">
              <p class="title is-4">{{selectedEdge.id}}</p>
              <p class="subtitle is-6">
                <span>Interations: {{selectedEdge.entries.length}}</span>
                <br>
                <span>
                  Methods:
                  {{selectedEdge.entries.map(e => e.method_id).filter(uniq).length}}
                </span>
              </p>
            </div>
            <div class="is-divider-vertical"></div>
            <div class="column interaction-detail">
              <div
                class="level is-marginless"
                v-for="entry in selectedEdge.entries"
                v-bind:key="JSON.stringify(entry)"
              >
                <div class="level-left">
                  Method: &nbsp;
                  <a
                    class="is-capitalized"
                    :href="'http://purl.obolibrary.org/obo/MI_' 
                    + entry.method_id"
                  >{{entry.method}}</a>
                </div>
                <div class="level-right">
                  <span>{{entry.ref}} &nbsp;</span>
                  <a :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + entry.pubmed_id">PMID</a>
                </div>
              </div>
            </div>
          </div>
      </b-message>
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
          },
          {
            selector: "edge.highlighted",
            style: {
              width: 3,
              "line-color": "#209CEE",
              "target-arrow-color": "#ccc",
              "target-arrow-shape": "triangle"
            }
          },
        ]
      },
      isLoading: false,
      cy: Object,
      nodes: [],
      edges: [],
      selectedEdge: {},
      showMessage: false
    };
  },
  mounted() {
    this.cyUpdate();
  },
  methods: {
    parseElement() {
      // Extract interactions given interaction ids
      return this.$http
        .get(this.$apiEntryPoint + "/interactome/" + this.elements)
        .then(res => {
          const json = res.body;

          // Add head node
          this.nodes.push({
            data: { id: this.head },
            classes: "head"
          });

          // Add other nodes and edges
          this.elements.forEach(node => {
            // Find corresponding interaction
            const interaction = json.found.find(e => e.name == node);
            const subId =
              interaction.entrez_id_a == this.head
                ? interaction.entrez_id_b
                : interaction.entrez_id_a;
            this.nodes.push({
              data: { id: subId }
            });
            this.edges.push({
              data: {
                id: interaction.name,
                source: this.head,
                target: subId,
                entries: interaction.entries
              }
            });
          });
        });
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
        .then(async cy => {
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
          await this.parseElement();
          cy.add(this.nodes.concat(this.edges));

          // Draw the graph and fit to the page
          cy.layout({
            name: "concentric",
            padding: 80,
            spacingFactor: 1.25,
            animate: true,
            animationEasing: "ease-in-out-expo",
            concentric: node => {
              return node.degree();
            },
            levelWidth: nodes => {
              // the letiation of concentric values in each level
              return nodes.maxDegree();
            }
          }).run();
          cy.reset();
          cy.center();
          cy.fit(80);

          // Register click event
          cy.unbind('tap');
          cy.on("tap", "edge", evt => {
            // Highlight the tapped edge
            cy.edges().removeClass('highlighted');
            evt.target.addClass('highlighted');

            // Store tapped edge
            this.showMessage = true;
            this.selectedEdge = evt.target.data();
          });
        })
        .then(() => {
          this.isLoading = false;
        });
    },
    uniq(value, index, self) {
      return self.indexOf(value) === index;
    }
  }
};
</script>

<style>
.cytoscape {
  width: 50vw;
  height: 70vh;
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
.interaction-detail {
  max-height: 20vh;
  overflow-y: scroll;
}
</style>
