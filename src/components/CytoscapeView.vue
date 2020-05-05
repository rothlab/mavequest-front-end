<template>
  <div class="card cytoscape-container">
    <div class="cytoscape-display">
      <cytoscape :config="config" :preConfig="preConfig" :afterCreated="cyUpdate"/>
      <resize-observer @notify="handleResize"/>
      <b-loading :active.sync="isLoading" :is-full-page="false" :can-cancel="true"></b-loading>
      <div class="cy-navigator"></div>
      <div class="cy-copyright has-text-grey-light">
        <figure class="image is-16x16 is-marginless is-inline-block">
          <img src="../assets/cytoscape-logo.png" alt="cytoscape-logo">
        </figure>
        <span class="is-size-6" style="vertical-align: text-bottom;">
          Powered by
          <a
            class="has-text-grey"
            href="https://js.cytoscape.org/"
            target="_blank"
            rel="noopener noreferrer"
          >Cytoscape.js</a>
        </span>
      </div>
    </div>

    <div class="cy-info is-hidden-mobile" v-if="showMessage">
      <b-message type="is-info">
        <p class="is-flex is-vcentered">
          <span class="title is-4 is-marginless">{{selectedEdge.name}}</span>
          <b-tag type="is-dark" class="cy-badge">
            {{selectedEdge.entries.length}} interations,
            {{selectedEdge.entries.map(e => e.method_id).filter(uniq).length}} methods
          </b-tag>
        </p>

        <div
          class="cy-list-interation-container is-fullwidth is-marginless"
          v-for="entry in selectedEdge.entries"
          v-bind:key="JSON.stringify(entry)"
        >
          <div>
            <a
              class="is-capitalized"
              :href="'http://purl.obolibrary.org/obo/MI_' 
                    + entry.method_id"
            >{{entry.method}}</a>
          </div>
          <div class="source">
            <b-tooltip :label="entry.ref" type="is-dark" position="is-left">
              <a
                v-if="entry.pubmed_id.startsWith('biorxiv')"
                :href="'https://www.biorxiv.org/search/' 
                    + entry.pubmed_id.replace('biorxiv:', '')"
              >BioRxiv</a>
              <a
                v-else
                :href="'https://www.ncbi.nlm.nih.gov/pubmed/' 
                    + entry.pubmed_id"
              >PMID</a>
            </b-tooltip>
          </div>
        </div>
      </b-message>
    </div>
  </div>
</template>

<script>
import Panzoom from "cytoscape-panzoom";
import "cytoscape-panzoom/cytoscape.js-panzoom.css";
import Navitagor from "cytoscape-navigator";
import "cytoscape-navigator/cytoscape.js-navigator.css";

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
              "background-color": "#a0d5f8",
              label: "data(id)"
            }
          },
          {
            selector: "node.highlighted",
            style: {
              "background-color": "#3273DC",
              label: "data(id)",
              "z-index": 100
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
              width: 4,
              "line-color": "#209CEE",
              "target-arrow-color": "#ccc",
              "target-arrow-shape": "triangle",
              "z-index": 100
            }
          }
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
    this.isLoading = true;
    // this.cyUpdate();
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
              interaction.symbol_a == this.head
                ? interaction.symbol_b
                : interaction.symbol_a;
            this.nodes.push({
              data: { id: subId }
            });
            this.edges.push({
              data: {
                id: interaction.name,
                name: this.head + "-" + subId,
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

      // Register navigator panel
      if (typeof cytoscape("core", "navigator") !== "function") {
        Navitagor(cytoscape);
      }
    },
    async cyUpdate(cy) {
      // Remove all elements
      cy.remove(cy.elements());

      // Add the panzoom control
      cy.panzoom({
        sliderHandleIcon: "fas fa-minus",
        zoomInIcon: "fas fa-plus",
        zoomOutIcon: "fas fa-minus",
        resetIcon: "fas fa-expand"
      });

      // Add navigator
      cy.navigator({
        container: ".cy-navigator",
        viewLiveFramerate: 0,
        thumbnailEventFramerate: 30,
        thumbnailLiveFramerate: false,
        dblClickDelay: 200,
        removeCustomContainer: true,
        rerenderDelay: 100
      });

      // Add nodes and edges
      await this.parseElement();
      cy.add(this.nodes.concat(this.edges));

      // Draw the graph and fit to the page
      cy.layout({
        name: "cose",
        animate: true,
        padding: 50,
        nodeOverlap: 60
      }).run();
      cy.reset();
      cy.center();
      cy.fit(80);

      // Register click event
      cy.unbind("tap");
      cy.on("tap", evt => {
        const evtTarget = evt.target;
        if (evtTarget === cy) {
          cy.nodes().removeClass("highlighted");
          cy.edges().removeClass("highlighted");
          this.showMessage = false;
          this.selectedEdge = [];

          return;
        }

        if (evtTarget.group() === "nodes" && evtTarget.hasClass("head")) return;

        // Extract tapped edge and node
        let node, edge;
        if (evtTarget.group() === "nodes") {
          node = evtTarget;
          edge = cy.edges("[target='" + evtTarget.id() + "']");
        } else {
          node = cy.nodes("[id='" + evtTarget.data().target + "']");
          edge = evtTarget;
        }

        // Highlight the tapped edge and node
        cy.nodes().removeClass("highlighted");
        cy.edges().removeClass("highlighted");
        node.addClass("highlighted");
        edge.addClass("highlighted");

        if (window.innerWidth < 768) {
          this.$buefy.toast.open({
            message: "Cannot show interactions on mobile devices.",
            type: "is-warning",
            queue: false
          });
        } else {
          // Store tapped edge
          this.showMessage = true;
          this.selectedEdge = edge.data();
        }
      });

      this.isLoading = false;
    },
    uniq(value, index, self) {
      return self.indexOf(value) === index;
    },
    handleResize() {
      this.$cytoscape.instance.then(cy => {
        cy.resize();
        // Only center the network when it's not zoomed in
        if (cy.zoom() <= 0.85) cy.center();
      });
    }
  }
};
</script>

<style>
.cytoscape-container {
  display: flex;
  max-height: 70vh;
}
.card > .cytoscape-display {
  min-width: 50vw;
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
.cy-info {
  min-width: 20vw;
  max-width: 30vw;
  margin: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
}
.cy-badge {
  margin-left: auto;
  padding-left: 1rem;
  text-align: right;
}
.cy-navigator {
  position: relative;
  float: right;
  right: 1em;
  top: -12.5vh;
  /* push it up into the element before it. This is a trick for bottom-right */
  right: 2.5vh;
  z-index: 200;
  opacity: 1;
  font-weight: bolder;
  height: 10vh;
  width: 10vh;
  overflow: hidden;
  border-style: solid;
  border-width: 2px;
  background-color: white;
}
.cy-copyright {
  position: relative;
  float: left;
  left: 1.25em;
  top: -5vh;
  z-index: 200;
}
.cy-list-interation-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 0.5rem;
}
.cy-list-interation-container .source {
  margin-left: auto;
  padding-left: 1rem;
  text-align: right;
}
@media screen and (max-width: 768px) {
  .card > .cytoscape-display {
    width: 100vw;
  }
}
</style>
