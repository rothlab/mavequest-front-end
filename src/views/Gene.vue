<template>
  <div class="details">
    <!-- Header -->
    <Header v-bind:title="geneName" v-observe-visibility="visibilityChanged"></Header>

    <!-- Main -->
    <section class="section">
      <div class="container">
        <!-- Display an error component if received a bad response from the back-end -->
        <section class="section is-medium has-text-centered" v-if="showErrorComponent">
          <h1 class="title has-text-grey"><b-icon icon="meh"></b-icon></h1>
          <h1 class="subtitle has-text-grey">Nothing Found</h1>
        </section>
        <div class="columns" v-if="!showErrorComponent">
          <!-- Table of Contents -->
          <div class="column is-3">
            <aside class="menu" :class="{float: isFloat}">
              <p class="menu-label" v-if="hasAssay.any">Assay</p>
              <ul class="menu-list" v-if="hasAssay.any">
                <li v-if="hasAssay.yeast_comp">
                  <a href="#yeast-comp">Yeast Complementation</a>
                </li>
                <li v-if="hasAssay.human_comp">
                  <a href="#human-comp">Human Complementation</a>
                </li>
                <li v-if="hasAssay.y2h">
                  <a href="#y2h">Yeast Two-Hybrid</a>
                </li>
              </ul>
              <p class="menu-label" v-if="hasPhenotype.any">Disease Phenotype</p>
              <ul class="menu-list" v-if="hasPhenotype.any">
                <li v-if="hasPhenotype.omim">
                  <a href="#omim">OMIM</a>
                </li>
                <li v-if="hasPhenotype.hgmd">
                  <a href="#hgmd">HGMD</a>
                </li>
                <li v-if="hasPhenotype.cancer_census">
                  <a href="#cancer-census">Cancer Gene Census</a>
                </li>
                <li v-if="hasPhenotype.orphanet">
                  <a href="#orphanet">Orphanet</a>
                </li>
                <li v-if="hasPhenotype.others">
                  <a href="#other-phenotype">Other Sources</a>
                </li>
              </ul>
            </aside>
          </div>

          <!-- Main Grid -->
          <div class="column">
            <section class="section is-paddingless">
              <h1 class="title">{{geneName}}</h1>
              <h2 class="subtitle">{{description}}</h2>

              <!-- Gene info -->
              <div class="block">
                <li>
                  Entrez ID:
                  <a
                    v-bind:href="'https://www.genecards.org/cgi-bin/carddisp.pl?gene=' + entrezID"
                    target="_blank"
                  >{{entrezID}}</a>
                </li>
                <li>
                  Ensembl ID:
                  <a
                    v-bind:href="'https://www.ensembl.org/Homo_sapiens/geneview?gene=' + ensemblID"
                    target="_blank"
                  >{{ensemblID}}</a>
                </li>
                <li>
                  OMIM ID:
                  <a
                    v-bind:href="'https://omim.org/entry/' + omimID"
                    target="_blank"
                  >{{omimID}}</a>
                </li>
                <li>Alias: {{alias.join(", ")}}</li>
              </div>
            </section>

            <div class="is-divider"></div>

            <section class="section is-paddingless" v-if="hasAssay.any">
              <h1 class="title">Assay</h1>
              <div class="container is-fluid" v-if="hasAssay.yeast_comp">
                <AssayTitle id="yeast-comp" title="Yeast Complementation Assay"></AssayTitle>
                <div class="content">
                  <ul>
                    <li>Essentiality: {{yeastEssentiality}}</li>
                    <li>Yeast Synthetic Lethality:</li>
                    <div class="card in-list">
                      <b-table :data="yeastHomologData" :columns="yeastHomologColumns"></b-table>
                    </div>
                  </ul>
                </div>
              </div>

              <div class="container is-fluid" v-if="hasAssay.human_comp">
                <AssayTitle id="human-comp" title="Human Complementation Assay"></AssayTitle>
                <div class="content" v-if="hasAssay.genome_rnai">
                  <ul>
                    <li>GenomeRNAi Phenotype:
                      <ol>
                        <li v-for="item in genomeRNAiPhenotype" :key="item">{{item}}</li>
                      </ol>
                    </li>
                    <li>GenomeRNAi Records:</li>
                    <div class="card in-paragraph in-list">
                      <b-table :data="genomeRNAiData" :columns="genomeRNAiColumns"></b-table>
                    </div>
                  </ul>
                </div>

                <div class="content" v-if="hasAssay.genome_crispr">
                  <ul>
                    <li>GenomeCRISPR Records:</li>
                    <div class="card in-paragraph in-list" v-if="hasAssay.genome_crispr">
                      <b-table :data="genomeCRISPRData" :columns="genomeCRISPRColumns"></b-table>
                    </div>
                  </ul>
                </div>

                <div class="content" v-if="hasAssay.tko">
                  <ul>
                    <li>TKO Cell Lines:
                      <ol>
                        <li v-for="item in tkoCellLine" :key="item">{{item.toUpperCase()}}</li>
                      </ol>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="container is-fluid" v-if="hasAssay.y2h">
                <AssayTitle id="y2h" title="Yeast Two-Hybrid Assay"></AssayTitle>
                <div class="content">
                  <ul>
                    <li>Interaction Partners:
                      <ol>
                        <li v-for="item in y2hInteractors" :key="item">{{item}}</li>
                      </ol>
                    </li>
                  </ul>
                </div>
                <figure class="image cytoscape">
                  <img
                    src="https://cytoscape.org/images/logo/cy3logoOrange.svg"
                    alt="Placeholder image"
                  >
                </figure>
              </div>
            </section>

            <div class="is-divider" v-if="hasAssay.any"></div>

            <section class="section is-paddingless" v-if="hasPhenotype.any">
              <h1 class="title">Diseaes Phenotype</h1>
              <div class="container is-fluid" v-if="hasPhenotype.omim">
                <AssayTitle id="omim" title="Online Mendelian Inheritance in Man (OMIM) Database"></AssayTitle>
                <div class="content">
                  <ul>
                    <li>OMIM Phenotype:
                      <ol>
                        <li v-for="item in omimPhenotype" :key="item">{{item}}</li>
                      </ol>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="container is-fluid" v-if="hasPhenotype.hgmd">
                <AssayTitle id="hgmd" title="The Human Gene Mutation Database (HGMD)"></AssayTitle>
                <div class="content">
                  <ul>
                    <li>HGMD Phenotype:
                      <ol>
                        <li v-for="item in hgmdPhenotype" :key="item">{{item}}</li>
                      </ol>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="container is-fluid" v-if="hasPhenotype.cancer_census">
                <AssayTitle id="cancer-census" title="Cancer Gene Census Database"></AssayTitle>
                <div class="content">
                  <ul>
                    <li>Somatic Phenotype:
                      <ol>
                        <li v-for="item in cancerGeneCensusPhenotype.somatic" :key="item">{{item}}</li>
                      </ol>
                    </li>
                    <li>Germline Phenotype:
                      <ol>
                        <li v-for="item in cancerGeneCensusPhenotype.germline" :key="item">{{item}}</li>
                      </ol>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="container is-fluid" v-if="hasPhenotype.orphanet">
                <AssayTitle id="orphanet" title="Orphanet Database"></AssayTitle>
                <div class="card in-paragraph">
                  <b-table :data="orphanetData" :columns="orphanetColumns"></b-table>
                </div>
              </div>

              <div class="container is-fluid" v-if="hasPhenotype.others">
                <AssayTitle id="other-phenotype" title="Other Sources"></AssayTitle>
                <div class="content">
                  <ul>
                    <li>Dei et al. Phenotype:
                      <ol>
                        <li v-for="item in deoEtalPhenotype" :key="item">{{item}}</li>
                      </ol>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

// Declare assay title as a little in-line component as it is not going to be used by another component/view
const AssayTitle = {
  props: ["title"],
  render() {
    return (
      <div class="block is-flex is-vcentered" style="margin-top:1.5rem">
        <b-icon size="is-medium" icon="fas fa-angle-right" />
        <span class="is-size-4">{this.title}</span>
      </div>
    );
  }
};

export default {
  name: "gene-details",
  components: {
    Header,
    AssayTitle
  },
  created() {
    this.geneName = this.$route.params.name.toUpperCase();
  },
  mounted() {
    // Display loading animation
    const loadingComponent = this.$loading.open();

    // Get detail info
    this.$http
      .get("https://demo6436483.mockable.io/detail/" + this.geneName)
      .then(
        response => {
          // Make sure the response has a non-empty body
          if (
            !response.hasOwnProperty("body") ||
            typeof response.body == "string"
          ) {
            return;
          }

          const json = response.body;

          // TODO: validate response fingerprint
          // Populate basic information
          this.description = json.description;
          this.entrezID = json.entrez_id;
          this.ensemblID = json.ensembl_id;
          this.omimID = json.omim_id;
          this.alias = json.alias;

          // Populate Assay information
          this.hasAssay.any =
            json.hasOwnProperty("yeast_comp") ||
            json.hasOwnProperty("human_comp") ||
            json.hasOwnProperty("y2h");

          if (json.hasOwnProperty("yeast_comp")) {
            // Yeast Complementation
            this.hasAssay.yeast_comp = true;
            this.yeastEssentiality = json.yeast_comp.yeast_essentiality;
            this.yeastHomologData = json.yeast_comp.yeast_homolog_data;
          }

          if (json.hasOwnProperty("human_comp")) {
            // Human Complementation
            this.hasAssay.human_comp = true;

            if (
              json.human_comp.hasOwnProperty("genome_rnai_phenotype") &&
              json.human_comp.hasOwnProperty("genome_rnai_data")
            ) {
              this.hasAssay.genome_rnai = true;
              this.genomeRNAiPhenotype = json.human_comp.genome_rnai_phenotype;
              this.genomeRNAiData = json.human_comp.genome_rnai_data;
            }

            if (json.human_comp.hasOwnProperty("genome_crispr_data")) {
              this.hasAssay.genome_crispr = true;
              this.genomeCRISPRData = json.human_comp.genome_crispr_data;
            }

            if (json.human_comp.hasOwnProperty("tko_cell_line")) {
              this.hasAssay.tko = true;
              this.tkoCellLine = json.human_comp.tko_cell_line;
            }
          }

          if (json.hasOwnProperty("y2h")) {
            // Yeast Two-Hybrid
            this.hasAssay.y2h = true;
            this.y2hInteractors = json.y2h.y2h_interactors;
          }

          // Populate Disease Phenotype information
          this.hasPhenotype.any =
            json.hasOwnProperty("omim") ||
            json.hasOwnProperty("hgmd") ||
            json.hasOwnProperty("cancer_census") ||
            json.hasOwnProperty("orphanet") ||
            json.hasOwnProperty("deo_etal");

          if (json.hasOwnProperty("omim")) {
            // OMIM Phenotype
            this.hasPhenotype.omim = true;
            this.omimPhenotype = json.omim.omim_phenotype;
          }

          if (json.hasOwnProperty("hgmd")) {
            // HGMD Phenotype
            this.hasPhenotype.hgmd = true;
            this.hgmdPhenotype = json.hgmd.hgmd_phenotype;
          }

          if (json.hasOwnProperty("cancer_census")) {
            // Cancer Census Phenotype
            this.hasPhenotype.cancer_census = true;
            this.cancerGeneCensusPhenotype.somatic = json.cancer_census.cancer_census_somatic;
            this.cancerGeneCensusPhenotype.germline = json.cancer_census.cancer_census_germline;
          }

          if (json.hasOwnProperty("orphanet")) {
            // Orphanet Phenotype
            this.hasPhenotype.orphanet = true;
            this.orphanetData = json.orphanet.orphanet_data;
          }

          if (json.hasOwnProperty("deo_etal")) {
            // Deo et. al Phenotype
            this.hasPhenotype.others = true;
            this.deoEtalPhenotype = json.deo_etal.deo_etal_phenotype;
          }
        },
        response => {
          // Error handling
          const error = response.status;
          let errorMsg = "Other Errors";

          // Handle common error
          switch (error) {
            case 404:
              errorMsg = "No record.";
              break;
            case 406:
              errorMsg = "One gene per request.";
              break;
            default:
              break;
          }
          this.$snackbar.open({
            message: `Failed. Error Message: [${response.status}] ${errorMsg}`,
            type: "is-danger",
            position: "is-top",
            actionText: "Dismiss",
            indefinite: true
          });

          // Show error component
          this.showErrorComponent = true;
        }
      )
      .then(() => {
        // Close loading animation
        loadingComponent.close();
      });
  },
  data() {
    return {
      showErrorComponent: false,
      isFloat: false,
      description: "",
      entrezID: "",
      ensemblID: "",
      omimID: "",
      alias: [],
      hasAssay: {
        any: false,
        yeast_comp: false,
        human_comp: false,
        genome_rnai: false,
        genome_crispr: false,
        tko: false,
        y2h: false
      },
      hasPhenotype: {
        any: false,
        omim: false,
        hgmd: false,
        cancer_census: false,
        orphanet: false,
        others: false
      },
      yeastEssentiality: false,
      yeastHomologData: [],
      yeastHomologColumns: [
        {
          field: "yeast_homolog",
          label: "Yeast Homolog"
        },
        {
          field: "synthetic_lethal_partners",
          label: "Synthetic Lethal Partners"
        }
      ],
      tkoCellLine: [],
      y2hInteractors: [],
      genomeRNAiPhenotype: [],
      genomeRNAiData: [],
      genomeRNAiColumns: [
        {
          field: "id",
          label: "ID"
        },
        {
          field: "pubmed",
          label: "PubMed Source"
        },
        {
          field: "cell_line",
          label: "Cell Line"
        }
      ],
      genomeCRISPRData: [],
      genomeCRISPRColumns: [
        {
          field: "pubmed",
          label: "PubMed Source"
        },
        {
          field: "cell_line",
          label: "Cell Line"
        },
        {
          field: "condition",
          label: "Condition"
        },
        {
          field: "screen",
          label: "Screen"
        }
      ],
      omimPhenotype: [],
      hgmdPhenotype: [],
      cancerGeneCensusPhenotype: {
        somatic: [],
        germline: []
      },
      orphanetData: [],
      orphanetColumns: [
        {
          field: "id",
          label: "ORPHA ID"
        },
        {
          field: "disorder",
          label: "Disorder"
        },
        {
          field: "prevalence",
          label: "Prevalence"
        }
      ],
      deoEtalPhenotype: []
    };
  },
  methods: {
    visibilityChanged(visible) {
      // Position the table of contents absolutely so that it will stay on the screen
      this.isFloat = !visible;
    }
  }
};
</script>

<style scoped>
.image.cytoscape {
  max-width: 60%;
  width: auto;
}
.float {
  position: fixed;
  top: 4rem;
}
</style>
