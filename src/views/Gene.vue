<template>
  <div class="details">
    <!-- Header -->
    <Header v-bind:title="geneName" v-observe-visibility="visibilityChanged"></Header>

    <!-- Main -->
    <section class="section fill-screen-withheader">
      <div class="container">
        <!-- Display an error component if received a bad response from the back-end -->
        <ErrorView v-if="showErrorComponent" :response="errorResponse"></ErrorView>

        <div class="columns" v-if="!showErrorComponent">
          <!-- Table of Contents -->
          <div class="column is-3 is-hidden-mobile">
            <aside class="menu" :class="{float: isFloat}">
              <p class="menu-label" v-if="hasAssay.any">Potential Assay</p>
              <ul class="menu-list" v-if="hasAssay.any">
                <li v-if="hasAssay.human_comp">
                  <a href="#human-comp">Human Complementation</a>
                </li>
                <li v-if="hasAssay.over_expression">
                  <a href="#over-expression">Over Expression</a>
                </li>
                <li v-if="hasAssay.yeast_comp">
                  <a href="#yeast-comp">Yeast Complementation</a>
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
                <li v-if="hasPhenotype.invitae">
                  <a href="#invitae">Invitae</a>
                </li>
                <li v-if="hasPhenotype.others">
                  <a href="#other-phenotype">Other Sources</a>
                </li>
              </ul>
            </aside>
          </div>

          <!-- Main Grid -->
          <div class="column">
            <section class="section is-paddingless in-paragraph">
              <!-- Gene info card -->
              <div class="card gene-basic has-background-light">
                <div class="columns">
                  <div class="column is-narrow is-flex is-vcentered gene-card-adaptive">
                    <h1
                      class="title is-fullwidth has-text-centered"
                      style="margin-left:1rem; margin-right:1rem"
                    >{{geneName}}</h1>
                  </div>

                  <div class="is-divider-vertical is-paddingless is-hidden-mobile"></div>

                  <div class="column gene-summary">
                    <p class="is-capitalized is-italic" style="margin-bottom:0.5rem">
                      {{description}}
                      <span v-if="alias.length > 1">(Alias: {{alias.join(", ")}})</span>
                    </p>

                    <b-field grouped group-multiline class="gene-summary">
                      <div class="control">
                        <b-taglist attached v-if="entrezID">
                          <b-tag type="is-dark">Entrez</b-tag>
                          <b-tag type="is-link">
                            <a
                              v-bind:href="'https://www.genecards.org/cgi-bin/carddisp.pl?gene=' + entrezID"
                              target="_blank"
                              class="has-text-white"
                            >
                              {{entrezID}}
                              &nbsp;
                              <b-icon icon="external-link-alt" size="is-small"></b-icon>&nbsp;
                            </a>
                          </b-tag>
                        </b-taglist>
                      </div>

                      <div class="control">
                        <b-taglist attached v-if="omimID">
                          <b-tag type="is-dark">OMIM</b-tag>
                          <b-tag type="is-info">
                            <a
                              v-bind:href="'https://omim.org/entry/' + omimID"
                              target="_blank"
                              class="has-text-white"
                            >
                              {{omimID}}
                              &nbsp;
                              <b-icon icon="external-link-alt" size="is-small"></b-icon>&nbsp;
                            </a>
                          </b-tag>
                        </b-taglist>
                      </div>

                      <div class="control">
                        <b-taglist attached v-if="ensemblID">
                          <b-tag type="is-dark">Google Scholar</b-tag>
                          <b-tag type="is-primary">
                            <a
                              v-bind:href="'https://scholar.google.com/scholar?q=' + geneName"
                              target="_blank"
                              class="has-text-white"
                            >
                              {{geneName}}
                              &nbsp;
                              <b-icon icon="external-link-alt" size="is-small"></b-icon>&nbsp;
                            </a>
                          </b-tag>
                        </b-taglist>
                      </div>

                      <div class="control">
                        <b-taglist attached v-if="ensemblID">
                          <b-tag type="is-dark">Ensembl</b-tag>
                          <b-tag type="is-success">
                            <a
                              v-bind:href="'https://www.ensembl.org/Homo_sapiens/geneview?gene=' + ensemblID"
                              target="_blank"
                              class="has-text-white"
                            >
                              {{ensemblID}}
                              &nbsp;
                              <b-icon icon="external-link-alt" size="is-small"></b-icon>&nbsp;
                            </a>
                          </b-tag>
                        </b-taglist>
                      </div>
                    </b-field>
                  </div>
                </div>
              </div>
            </section>

            <section class="section is-paddingless" v-if="hasAssay.any">
              <h1 class="title">Potential Assay</h1>
              <div v-if="hasAssay.human_comp">
                <AssayTitle
                  anchor="human-comp"
                  title="Human Complementation Assay"
                  icon="fas fa-bars"
                ></AssayTitle>

                <div class="content" v-if="hasAssay.genome_crispr">
                  <RecordTitle title="GenomeCRISPR Records" reflink="/about#genome-crispr"></RecordTitle>

                  <div
                    class="card has-table-padding in-paragraph in-list"
                    v-if="hasAssay.genome_crispr"
                  >
                    <b-table
                      :data="genomeCRISPRData"
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                      narrowed
                    >
                      <template slot="bottom-left">
                        <a href="/about#tko" target="_blank" v-if="genomeCRISPRData.filter(e => tkoPubmed.includes(e.pubmed)).length > 0">
                          <b-tag type="is-warning" class="cell-line">TKO</b-tag>Toronto Knockout Library &nbsp;
                        </a>
                      </template>

                      <template slot-scope="props">
                        <b-table-column field="pubmed" label="Pubmed Source" width="150">
                          <a
                            :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + props.row.pubmed"
                            target="_blank"
                          >
                            <span>{{props.row.pubmed}} &nbsp;</span>
                            <b-tag
                              type="is-warning"
                              v-show="tkoPubmed.includes(props.row.pubmed)"
                            >TKO</b-tag>
                          </a>
                        </b-table-column>

                        <b-table-column
                          field="condition"
                          label="Condition"
                          width="200"
                        >{{props.row.condition}}</b-table-column>

                        <b-table-column
                          field="screen"
                          label="Screen"
                          width="150"
                        >{{props.row.screen}}</b-table-column>

                        <b-table-column field="cell_line" label="Cell Lines">
                          <!-- Less than five cell lines -->
                          <div v-if="props.row.cell_line.length <= 5">
                            <b-tag
                              class="is-light cell-line"
                              v-for="cell in props.row.cell_line"
                              v-bind:key="cell"
                            >{{cell}}</b-tag>
                          </div>

                          <!-- More than five cell lines -->
                          <div v-if="props.row.cell_line.length > 5">
                            <ExpandableRow :elements="props.row.cell_line"></ExpandableRow>
                          </div>
                        </b-table-column>
                      </template>

                      <template slot="detail" slot-scope="props">
                        <b-tag
                          class="is-light is-size-6 cell-line"
                          v-for="cell in props.row.cell_line"
                          v-bind:key="cell"
                        >{{cell}}</b-tag>
                      </template>
                    </b-table>
                  </div>
                </div>

                <div class="content" v-if="hasAssay.genome_rnai">
                  <RecordTitle title="GenomeRNAi Records" reflink="/about#genome-rnai"></RecordTitle>

                  <div class="card has-table-padding in-paragraph in-list">
                    <b-table
                      :data="genomeRNAiData"
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                      narrowed
                    >
                      <template slot-scope="props">
                        <b-table-column field="id" label="ID" width="150">
                          <a
                            :href="'http://www.genomernai.org/v17/singleExpPhenotypes/' + props.row.id"
                            target="_blank"
                          >{{props.row.id}}</a>
                        </b-table-column>

                        <b-table-column field="pubmed" label="Pubmed Source" width="150">
                          <a
                            :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + props.row.pubmed"
                            target="_blank"
                          >{{props.row.pubmed}}</a>
                        </b-table-column>

                        <b-table-column field="cell_line" label="Cell Lines">
                          <!-- Less than five cell lines -->
                          <div v-if="props.row.cell_line.length <= 5">
                            <b-tag
                              class="is-light cell-line"
                              v-for="cell in props.row.cell_line"
                              v-bind:key="cell"
                            >{{cell}}</b-tag>
                          </div>

                          <!-- More than five cell lines -->
                          <div v-if="props.row.cell_line.length > 5">
                            <ExpandableRow :elements="props.row.cell_line"></ExpandableRow>
                          </div>
                        </b-table-column>
                      </template>

                      <template slot="detail" slot-scope="props">
                        <b-tag
                          class="is-light is-size-6 cell-line"
                          v-for="cell in props.row.cell_line"
                          v-bind:key="cell"
                        >{{cell}}</b-tag>
                      </template>
                    </b-table>
                  </div>

                  <ExpandableList
                    class="in-paragraph in-list"
                    heading="GenomeRNAi Phenotype"
                    :elements="genomeRNAiPhenotype"
                  ></ExpandableList>
                </div>
              </div>

              <div v-if="hasAssay.yeast_comp">
                <AssayTitle
                  anchor="yeast-comp"
                  title="Yeast Complementation Assay"
                  icon="fas fa-bars"
                ></AssayTitle>
                <div class="content">
                  <b-taglist attached>
                    <b-tag size="is-medium" type="is-dark">Has Essential Yeast Paralogs</b-tag>
                    <b-tag size="is-medium" type="is-info">
                      <b-icon icon="fas fa-check" v-if="yeastEssentiality"></b-icon>
                      <b-icon icon="fas fa-times" v-else></b-icon>
                    </b-tag>
                  </b-taglist>
                  <li v-if="yeastHomologData">Yeast Synthetic Lethality:</li>
                  <div class="card in-list has-table-padding" v-if="yeastHomologData">
                    <b-table :data="yeastHomologData" :columns="yeastHomologColumns" narrowed></b-table>
                  </div>
                </div>
              </div>

              <div v-if="hasAssay.over_expression">
                <AssayTitle anchor="over-expression" title="Over Expression" icon="fas fa-bars"></AssayTitle>
                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list">
                    <b-table
                      :data="overexprData"
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                      narrowed
                    >
                      <template slot-scope="props">
                        <b-table-column field="taxonomy" label="Taxonomy">
                          <b-tooltip
                            type="is-info"
                            animated
                            dashed
                            :active="getSpeciesName(props.row.taxonomy) != 'NA'"
                            :label="getSpeciesName(props.row.taxonomy)"
                          >
                            <a
                              :href="'https://www.ncbi.nlm.nih.gov/taxonomy/' + props.row.taxonomy"
                              target="_blank"
                            >{{props.row.taxonomy}}</a>
                          </b-tooltip>
                        </b-table-column>

                        <b-table-column field="pubmed" label="Pubmed Source">
                          <a
                            :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + props.row.pubmed"
                            target="_blank"
                          >{{props.row.pubmed}}</a>
                        </b-table-column>

                        <b-table-column field="method" label="Assay">{{props.row.method}}</b-table-column>

                        <b-table-column field="phenotype" label="Phenotype">{{props.row.phenotype}}</b-table-column>
                      </template>
                    </b-table>
                  </div>
                </div>
              </div>

              <div v-if="hasAssay.y2h">
                <AssayTitle anchor="y2h" title="Yeast Two-Hybrid Assay" icon="fas fa-bars"></AssayTitle>

                <div class="content">
                  <RecordTitle title="HuRI Interactions" reflink="/about#huri"></RecordTitle>

                  <CytoscapeView :head="geneName" :elements="y2hInteractors"/>
                </div>
              </div>
            </section>

            <div class="is-divider" v-if="hasAssay.any"></div>

            <section class="section is-paddingless" v-if="hasPhenotype.any">
              <h1 class="title">Disease Phenotype</h1>
              <div v-if="hasPhenotype.omim">
                <AssayTitle
                  anchor="omim"
                  title="Online Mendelian Inheritance in Man (OMIM) Database"
                  icon="fas fa-bars"
                  reflink="/about#omim"
                ></AssayTitle>
                <div class="content">
                  <b-message type="is-info" has-icon>
                    Due to restrictions in OMIM's
                    <a
                      href="https://www.omim.org/help/copyright"
                      target="_blank"
                    >Copyright statement</a>,
                    MaveQuest is unable to display data obtained from OMIM database.
                    Please visit
                    <a
                      v-bind:href="'https://omim.org/entry/' + omimID"
                      target="_blank"
                    >OMIM website (ID: {{omimID}})</a> for more details.
                  </b-message>
                  <!-- <ExpandableList heading="OMIM Phenotype" :elements="omimPhenotype"></ExpandableList> -->
                </div>
              </div>

              <div v-if="hasPhenotype.hgmd">
                <AssayTitle
                  anchor="hgmd"
                  title="The Human Gene Mutation Database (HGMD)"
                  icon="fas fa-bars"
                  reflink="/about#hgmd"
                ></AssayTitle>
                <div class="content">
                  <b-message type="is-info" has-icon>
                    Due to restrictions in HGMD's
                    <a
                      href="http://www.hgmd.cf.ac.uk/docs/copyright.html"
                      target="_blank"
                    >Copyright statement</a>,
                    MaveQuest is unable to display data obtained from HGMD database.
                    Please visit
                    <a
                      v-bind:href="'http://www.hgmd.cf.ac.uk/ac/gene.php?gene=' + geneName"
                      target="_blank"
                    >HGMD website ({{geneName}})</a> for more details.
                  </b-message>
                  <!-- <ExpandableList heading="HGMD Phenotype" :elements="hgmdPhenotype"></ExpandableList> -->
                </div>
              </div>

              <div v-if="hasPhenotype.cancer_census">
                <AssayTitle
                  anchor="cancer-census"
                  title="Cancer Gene Census Database"
                  icon="fas fa-bars"
                  reflink="/about#cancer-census"
                ></AssayTitle>
                <div class="content">
                  <ExpandableList
                    heading="Cancer Gene Census Phenotype"
                    :names="['Somatic', 'Germline']"
                    :elements="[cancerGeneCensusPhenotype.somatic, cancerGeneCensusPhenotype.germline]"
                  ></ExpandableList>
                </div>
              </div>

              <div v-if="hasPhenotype.orphanet">
                <AssayTitle
                  anchor="orphanet"
                  title="Orphanet Database"
                  icon="fas fa-bars"
                  reflink="/about#orphanet"
                ></AssayTitle>
                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list">
                    <b-table :data="orphanetData" narrowed>
                      <template slot-scope="props">
                        <b-table-column field="id" label="ORPHA ID" width="150">
                          <a
                            :href="'https://www.orpha.net/consor/cgi-bin/Disease_Search_Simple.php?lng=EN&Disease_Disease_Search_diseaseGroup='
                             + props.row.id + '&Disease_Disease_Search_diseaseType=ORPHA'"
                            target="_blank"
                          >{{props.row.id}}</a>
                        </b-table-column>

                        <b-table-column
                          field="disorder"
                          label="Disorder"
                          width="300"
                        >{{props.row.disorder}}</b-table-column>

                        <b-table-column
                          field="prevalence"
                          label="Prevalence"
                        >{{props.row.prevalence}}</b-table-column>
                      </template>
                    </b-table>
                  </div>
                </div>
              </div>

              <div v-if="hasPhenotype.invitae">
                <AssayTitle
                  anchor="invitae"
                  title="Invitae Panel Database"
                  icon="fas fa-bars"
                  reflink="/about#invitae"
                ></AssayTitle>
                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list">
                    <b-table :data="invitaeData" narrowed>
                      <template slot-scope="props">
                        <b-table-column field="id" label="Test ID">
                          <a
                            :href="'https://www.invitae.com/en/physician/tests/'+ props.row.id"
                            target="_blank"
                          >{{props.row.id}}</a>
                        </b-table-column>

                        <b-table-column field="name" label="Test Name">{{props.row.name}}</b-table-column>

                        <b-table-column field="panel" label="Panel">
                          <b-tag
                            class="is-light cell-line"
                            v-for="panel in props.row.panel"
                            v-bind:key="panel"
                          >{{panel}}</b-tag>
                        </b-table-column>
                      </template>
                    </b-table>
                  </div>
                </div>
              </div>

              <div v-if="hasPhenotype.others">
                <AssayTitle anchor="other-phenotype" title="Other Sources" icon="fas fa-bars"></AssayTitle>

                <div class="content">
                  <RecordTitle title="Dei et al. Phenotype" reflink="/about#deo-etal"></RecordTitle>

                  <b-taglist class="in-paragraph in-list">
                    <b-tag
                      size="is-medium"
                      type="is-info"
                      v-for="item in deoEtalPhenotype"
                      :key="item"
                    >{{item.toUpperCase()}}</b-tag>
                  </b-taglist>
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
import ExpandableRow from "@/components/ExpandableRow.vue";
import ExpandableList from "@/components/ExpandableList.vue";
import CytoscapeView from "@/components/CytoscapeView.vue";
import ErrorView from "@/components/ErrorView.vue";

// Declare assay title as a little in-line component as it is not going to be used by another component/view
const AssayTitle = {
  props: ["title", "icon", "anchor", "reflink"],
  render() {
    return (
      <div class="block is-flex is-vcentered" style="margin-top:1.5rem">
        <b-icon size="is-medium" icon={this.icon} /> &nbsp;&nbsp;
        <span id={this.anchor} class="is-size-4 is-anchor">
          {this.title} &nbsp;
        </span>
        <a href={this.reflink} target="_blank" v-show={this.reflink}>
          <b-tag>
            <b-icon icon="far fa-file-alt" />
            <span>Source</span>
          </b-tag>
        </a>
      </div>
    );
  }
};

// Delare Record title
const RecordTitle = {
  props: ["title", "reflink"],
  render() {
    return (
      <div>
        <h4 class="title is-inline">{this.title} &nbsp;</h4>
        <a href={this.reflink} target="_blank">
          <b-tag>
            <b-icon icon="far fa-file-alt" />
            <span>Source</span>
          </b-tag>
        </a>
      </div>
    );
  }
};

export default {
  name: "gene-details",
  components: {
    Header,
    ExpandableRow,
    ExpandableList,
    AssayTitle,
    RecordTitle,
    CytoscapeView,
    ErrorView
  },
  created() {
    this.geneName = this.$route.params.name.toUpperCase();
  },
  mounted() {
    // Update highlighted navbar item
    this.$emit("updateNav", "search");

    // Display loading animation
    const loadingComponent = this.$loading.open();

    // Get detail info
    this.$http
      .get(this.$apiEntryPoint + "/detail/" + this.geneName)
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
            json.hasOwnProperty("over_expression") ||
            json.hasOwnProperty("y2h");

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
          }

          if (json.hasOwnProperty("over_expression")) {
            // Over Expression
            this.hasAssay.over_expression = true;
            this.overexprData = json.over_expression;
          }

          if (json.hasOwnProperty("yeast_comp")) {
            // Yeast Complementation
            this.hasAssay.yeast_comp = true;
            this.yeastEssentiality = json.yeast_comp.yeast_essentiality;
            this.yeastHomologData = json.yeast_comp.yeast_homolog_data;
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
            this.cancerGeneCensusPhenotype.somatic =
              json.cancer_census.cancer_census_somatic;
            this.cancerGeneCensusPhenotype.germline =
              json.cancer_census.cancer_census_germline;
          }

          if (json.hasOwnProperty("orphanet")) {
            // Orphanet Phenotype
            this.hasPhenotype.orphanet = true;
            this.orphanetData = json.orphanet.orphanet_data;
          }

          if (json.hasOwnProperty("invitae")) {
            // Invitiae Panel
            this.hasPhenotype.invitae = true;
            this.invitaeData = json.invitae.invitae_panel;
          }

          if (json.hasOwnProperty("deo_etal")) {
            // Deo et. al Phenotype
            this.hasPhenotype.others = true;
            this.deoEtalPhenotype = json.deo_etal.deo_etal_phenotype;
          }
        },
        response => {
          // Error handling
          this.showErrorComponent = true;
          this.errorResponse = response;
        }
      )
      .then(() => {
        // Close loading animation
        loadingComponent.close();
      });
  },
  data() {
    return {
      isExpandDetail: false,
      showErrorComponent: false,
      errorResponse: undefined,
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
        over_expression: false,
        genome_rnai: false,
        genome_crispr: false,
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
      tkoPubmed: ["26627737", "28655737"],
      y2hInteractors: [],
      genomeRNAiPhenotype: [],
      genomeRNAiData: [],
      genomeCRISPRData: [],
      overexprData: [],
      omimPhenotype: [],
      hgmdPhenotype: [],
      cancerGeneCensusPhenotype: {
        somatic: [],
        germline: []
      },
      orphanetData: [],
      invitaeData: [],
      deoEtalPhenotype: []
    };
  },
  methods: {
    visibilityChanged(visible) {
      // Position the table of contents absolutely so that it will stay on the screen
      this.isFloat = !visible;
    },
    getSpeciesName(taxonomy) {
      let name = String;
      switch (taxonomy) {
        case "9606":
          name = "Homo Sapiens";
          break;
        case "4932":
          name = "Saccharomyces cerevisiae";
          break;
        default:
          name = "NA";
          break;
      }

      return name;
    }
  }
};
</script>

<style scoped>
.float {
  position: fixed;
  top: 4rem;
}
.has-table-padding {
  padding: 0.5rem;
}
.cell-line {
  margin-right: 5px;
}
.gene-basic {
  border-radius: 8px;
  padding: 1rem;
}

/* Adaptive styling */
@media all and (max-width: 768px) {
  .gene-card-adaptive {
    padding-bottom: 0px;
  }
  .gene-summary {
    text-align: center;
    align-items: center;
    justify-content: center;
  }
}
</style>
