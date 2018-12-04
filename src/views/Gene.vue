<template>
  <div class="details">
    <!-- Header -->
    <Header v-bind:title="geneName"></Header>

    <!-- Main -->
    <section class="section">
      <div class="container">
        <div class="columns">
          <!-- Table of Contents -->
          <div class="column is-3">
            <aside class="menu">
              <p class="menu-label">Assay</p>
              <ul class="menu-list">
                <li>
                  <a href="#yeast-comp">Yeast Complementation</a>
                </li>
                <li>
                  <a href="#human-comp">Human Complementation</a>
                </li>
                <li>
                  <a href="#y2h">Yeast Two-Hybrid</a>
                </li>
              </ul>
              <p class="menu-label">Disease Phenotype</p>
              <ul class="menu-list">
                <li>
                  <a href="#omim">OMIM</a>
                </li>
                <li>
                  <a href="#hgmd">HGMD</a>
                </li>
                <li>
                  <a href="#cancer-census">Cancer Gene Census</a>
                </li>
                <li>
                  <a href="#orphanet">Orphanet</a>
                </li>
                <li>
                  <a href="other-phenotype">Other Sources</a>
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

            <section class="section is-paddingless">
              <h1 class="title">Assay</h1>
              <div class="container is-fluid">
                <AssayTitle id="yeast-comp" title="Yeast Complementation Assay"></AssayTitle>
                <div class="block">
                  <li>Essentiality:</li>
                </div>
                <div class="card">
                  <b-table :data="yeastHomologData" :columns="yeastHomologColumns"></b-table>
                </div>
              </div>

              <div class="container is-fluid">
                <AssayTitle id="human-comp" title="Human Complementation Assay"></AssayTitle>
                <div class="block">
                  <li>GenomeRNAi Phenotype:</li>
                </div>
                <div class="card in-paragraph">
                  <b-table :data="genomeRNAiData" :columns="genomeRNAiColumns"></b-table>
                </div>
                <div class="block">
                  <li>GenomeCRISPR</li>
                </div>
                <div class="card in-paragraph">
                  <b-table :data="genomeCRISPRData" :columns="genomeCRISPRColumns"></b-table>
                </div>
                <div class="block">
                  <li>TKO Cell Lines:</li>
                </div>
              </div>

              <div class="container is-fluid">
                <AssayTitle id="y2h" title="Yeast Two-Hybrid Assay"></AssayTitle>
                <div class="block">
                  <li>Interaction Partners:</li>
                </div>
                <figure class="image cytoscape">
                  <img
                    src="https://cytoscape.org/images/logo/cy3logoOrange.svg"
                    alt="Placeholder image"
                  >
                </figure>
              </div>
            </section>

            <div class="is-divider"></div>

            <section class="section is-paddingless">
              <h1 class="title">Diseaes Phenotype</h1>
              <div class="container is-fluid">
                <AssayTitle id="omim" title="Online Mendelian Inheritance in Man (OMIM) Database"></AssayTitle>
                <div class="block">
                  <li>OMIM Phenotype: {{omimPhenotype}} </li>
                </div>
              </div>

              <div class="container is-fluid">
                <AssayTitle id="hgmd" title="The Human Gene Mutation Database (HGMD)"></AssayTitle>
                <div class="block">
                  <li>HGMD Phenotype: {{omimPhenotype}} </li>
                </div>
              </div>

              <div class="container is-fluid">
                <AssayTitle id="cancer-census" title="Cancer Gene Census Database"></AssayTitle>
                <div class="block">
                  <li>Somatic Phenotype: {{cancerGeneCensusPhenotype.somatic}} </li>
                  <li>Germline Phenotype: {{cancerGeneCensusPhenotype.germline}} </li>
                </div>
              </div>

              <div class="container is-fluid">
                <AssayTitle id="orphanet" title="Orphanet Database"></AssayTitle>
                <div class="card in-paragraph">
                  <b-table :data="orphanetData" :columns="orphanetColumns"></b-table>
                </div>
              </div>

              <div class="container is-fluid">
                <AssayTitle id="other-phenotype" title="Other Sources"></AssayTitle>
                <div class="block">
                  <li>Dei et al.: {{deoEtalPhenotype}} </li>
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
    this.geneName = this.$route.params.name;
  },
  data() {
    return {
      description: "Ubiquitin Conjugating Enzyme E2 I",
      entrezID: "7329",
      ensemblID: "ENSG00000103275",
      omimID: "601661",
      alias: ["ARH", "ARH1", "ARH2", "FHCB1", "FHCB2"],
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
          field: "cell-line",
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
  }
};
</script>

<style scoped>
.image.cytoscape {
  max-width: 60%;
  width: auto;
}
</style>
