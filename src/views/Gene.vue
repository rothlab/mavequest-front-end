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
                <li v-if="hasAssay.human_comp || hasAssay.yeast_comp">
                  <a href="#comp">Complementation</a>
                </li>
                <li v-if="hasAssay.over_expression">
                  <a href="#over-expression">Over Expression</a>
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
                  <a href="#sanger">Cancer Gene Census</a>
                </li>
                <li v-if="hasPhenotype.orphanet">
                  <a href="#orpha">Orphanet</a>
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
                      <div class="control" v-if="entrezID">
                        <b-tag type="is-link" v-if="entrezID">
                            <a
                              v-bind:href="'https://www.genecards.org/cgi-bin/carddisp.pl?gene=' + entrezID"
                              target="_blank"
                              class="has-text-white"
                            >
                              Entrez: {{entrezID}}
                              &nbsp;
                              <b-icon icon="external-link-alt" size="is-small"></b-icon>&nbsp;
                            </a>
                        </b-tag>
                      </div>

                      <div class="control" v-if="omimID">
                        <b-tag type="is-info">
                            <a
                              v-bind:href="'https://omim.org/entry/' + omimID"
                              target="_blank"
                              class="has-text-white"
                            >
                              OMIM: {{omimID}}
                              &nbsp;
                              <b-icon icon="external-link-alt" size="is-small"></b-icon>&nbsp;
                            </a>
                          </b-tag>
                      </div>

                      <div class="control" v-if="geneName">
                        <b-tag type="is-primary">
                            <a
                              v-bind:href="'https://scholar.google.com/scholar?q=' + geneName + ' gene'"
                              target="_blank"
                              class="has-text-white"
                            >
                              Google Scholar &nbsp;
                              <b-icon icon="external-link-alt" size="is-small"></b-icon>&nbsp;
                            </a>
                        </b-tag>
                      </div>

                      <div class="control" v-if="ensemblID">
                        <b-tag type="is-success">
                          <b-tooltip :label="ensemblID" type="is-dark">
                            <a
                              v-bind:href="'https://www.ensembl.org/Homo_sapiens/geneview?gene=' + ensemblID"
                              target="_blank"
                              class="has-text-white"
                            >
                              Ensembl
                              &nbsp;
                              <b-icon icon="external-link-alt" size="is-small"></b-icon>&nbsp;
                            </a></b-tooltip>
                          </b-tag>
                      </div>
                    </b-field>
                  </div>
                </div>
              </div>
            </section>

            <!-- No-info banner -->
            <section v-if="(!hasAssay.any && !hasPhenotype.any) && !isLoading">
              <ErrorView icon="fas fa-file" response="No Potential Assays or Phenotypes Found"></ErrorView>
            </section>

            <section class="section is-paddingless" v-if="hasAssay.any">
              <h1 class="title">Potential Assay</h1>
              <div v-if="hasAssay.genome_crispr">
                <AssayTitle anchor="comp" title="GenomeCRISPR" 
                  icon="fas fa-bars" reflink="/about#genome-crispr"></AssayTitle>

                <div class="card has-table-padding in-paragraph in-list">
                    <b-table
                      :data="genomeCRISPRData"
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                      narrowed
                    >
                      <template slot="bottom-left">
                        <a
                          href="/about#tko"
                          target="_blank"
                          v-if="genomeCRISPRData.filter(e => 
                            tkoPubmed.includes(e.source)).length > 0"
                        >
                          <b-tag type="is-warning" class="cell-line">TKO</b-tag>
                          <span>Toronto Knockout Library &nbsp;</span>
                          <RefBadge reflink="/about#tko"></RefBadge>
                        </a>
                      </template>

                      <template slot-scope="props">
                        <b-table-column field="source" 
                          label="Pubmed Source" width="150">
                          <a
                            :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + 
                              props.row.source" target="_blank"
                          >
                            <span>{{props.row.source}} &nbsp;</span>
                            <b-tag
                              type="is-warning"
                              v-show="tkoPubmed.includes(props.row.source)"
                            >TKO</b-tag>
                          </a>
                        </b-table-column>

                        <b-table-column
                          field="condition"
                          label="Condition"
                          width="300"
                        >{{props.row.condition}}</b-table-column>

                        <b-table-column
                          field="screen"
                          label="Screen"
                          width="150"
                        >{{props.row.screen}}</b-table-column>

                        <b-table-column field="cellline" label="Cell Lines">
                          <ExpandableRow :elements="props.row.cellline" 
                           preview_items="5"></ExpandableRow>
                        </b-table-column>
                      </template>
                    </b-table>
                  </div>

                <div v-if="hasAssay.genome_rnai">
                  <AssayTitle anchor="genome_rnai" title="GenomeRNAi" 
                  icon="fas fa-bars" reflink="/about#genome-rnai"></AssayTitle>

                  <div class="card has-table-padding in-paragraph in-list">
                    <b-table
                      :data="genomeRNAiData"
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                      narrowed
                    >

                      <template slot="bottom-left">
                        Hits: {{genomeRNAiData.length}}; Total RNAi experiments: {{genomeRNAiTotalEntries}}
                      </template>

                      <template slot-scope="props">
                        <b-table-column field="id" label="ID" width="150">
                          <a
                            :href="'http://www.genomernai.org/v17/singleExpPhenotypes/' + props.row.id"
                            target="_blank"
                          >{{props.row.id}}</a>
                        </b-table-column>

                        <b-table-column field="source" label="Pubmed Source" width="150">
                          <a
                            :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + props.row.source"
                            target="_blank"
                          >{{props.row.source}}</a>
                        </b-table-column>

                        <b-table-column field="cellline" label="Cell Line" width="120">
                          <b-tooltip v-if="props.row.cellline.length > 20" 
                            :label="props.row.cellline" type="is-dark">
                            {{props.row.cellline.substring(0,20) + '...'}}
                          </b-tooltip>
                          <div v-else>
                            {{props.row.cellline}}
                          </div>
                        </b-table-column>

                        <b-table-column field="phenotype" label="Phenotype">
                          {{props.row.phenotype.join(', ')}}
                        </b-table-column>
                      </template>
                    </b-table>
                  </div>
                </div>

                <div id="yeast_comp" class="content" v-if="hasAssay.yeast_comp">
                  <b-taglist attached>
                    <b-tag size="is-medium" type="is-info">Has Essential Yeast Orthologs</b-tag>
                    <b-tag size="is-medium" type="is-grey">
                      <b-icon icon="fas fa-check" v-if="yeastEssentiality"></b-icon>
                      <b-icon icon="fas fa-times" v-else></b-icon>
                      <span>{{yeastEssentiality == ture ? "Yes" : "No"}}</span>
                    </b-tag>
                  </b-taglist>
                </div>

                <div class="content" v-if="yeastHomologData.length > 0">
                  <RecordTitle title="Yeast Synthetic Lethality"></RecordTitle>

                  <div class="card in-list has-table-padding">
                    <b-table
                      :data="yeastHomologData"
                      narrowed
                      paginated
                      pagination-simple
                    >
                      <template slot-scope="props">
                        <b-table-column field="yeast_homolog" label="Yeast Homolog">
                          <b-tag 
                            class="is-light is-size-6 cell-line"
                            v-for="homolog in props.row.yeast_homolog.split(',')"
                            v-bind:key="homolog"
                          >{{homolog}}</b-tag>
                        </b-table-column>
                        <b-table-column field="synthetic_lethal_partners" label="Synthetic Lethal Partners">
                          <div
                            v-for="partners in props.row.synthetic_lethal_partners"
                            v-bind:key="partners"
                          >
                            <b-tag
                              class="is-light is-size-6 cell-line"
                              v-for="partner in partners.split(',')"
                              v-bind:key="partner"
                              >{{partner}}</b-tag>
                          </div>
                        </b-table-column>
                      </template>
                    </b-table>
                  </div>
                </div>
              </div>

              <div id="overexpression" v-if="hasAssay.over_expression">
                <AssayTitle anchor="over-expression" title="Over Expression Assay" icon="fas fa-bars"></AssayTitle>
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

            <div class="is-divider" v-if="hasPhenotype.any"></div>

            <section class="section is-paddingless" v-if="hasPhenotype.any">
              <h1 class="title">Disease Phenotype</h1>
              <div v-if="hasPhenotype.omim">
                <AssayTitle
                  anchor="omim"
                  title="OMIM Database"
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
                  title="HGMD Database"
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
                  anchor="sanger"
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
                  anchor="orpha"
                  title="Orphanet Database"
                  icon="fas fa-bars"
                  reflink="/about#orphanet"
                ></AssayTitle>
                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list">
                    <b-table :data="orphanetData" 
                      narrowed
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable>
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
                    <b-table
                      :data="invitaeData"
                      narrowed 
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable>
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

                <div id="deo_etal" class="content">
                  <RecordTitle title="Deo et al. Phenotype" reflink="/about#deo-etal"></RecordTitle>

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

// Declare reference badge
const RefBadge = {
  props: ["reflink"],
  render: function (createElement) {
    return (
      this.constructElement(this.reflink, createElement)
    )
  },
  methods: {
    constructElement: function(reflink, createElement) {
      return (
        createElement("a", { attrs: {href: reflink, target: "_blank" }}, [
          createElement("b-tag", [
            createElement("b-icon", { props: {icon: "far fa-file-alt" }}),
            createElement("span", "Source")
          ])
        ])
      )
    }
  }
}

// Declare Record title
const RecordTitle = {
  props: ["title", "reflink"],
  render: function (createElement) {
    let subElements= [
      createElement("h4", { class: "title is-inline", style: "margin-right: 0.75rem"}, this.title)
    ];

    if (this.reflink) {
      subElements.push(RefBadge.methods.constructElement(this.reflink, createElement))
    }
    
    return (
      createElement("div", subElements)
    )
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
    RefBadge,
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
          if (!response.hasOwnProperty("body") || 
            typeof response.body == "string") return;
          const json = response.body;

          // Populate basic information
          this.description = json.description;
          this.entrezID = json.entrez_id;
          this.ensemblID = json.ensembl_id;
          this.omimID = json.omim_id;
          this.alias = json.alias;
          this.alias_description = json.alias_description;

          // Populate Assay information
          if (json.hasOwnProperty('genome_rnai')) {
            this.hasAssay.any = true;
            this.hasAssay.genome_rnai = true;
            this.genomeRNAiData = json.genome_rnai.hits;
            this.genomeRNAiTotalEntries = json.genome_rnai.total_entries;
          }

          if (json.hasOwnProperty('genome_crispr')) {
            this.hasAssay.any = true;
            this.hasAssay.genome_crispr = true;
            this.genomeCRISPRData = json.genome_crispr;
          }

          // if (json.hasOwnProperty("over_expression")) {
          //   // Over Expression
          //   this.hasAssay.over_expression = true;
          //   this.overexprData = json.over_expression;
          // }

          // if (json.hasOwnProperty("yeast_comp")) {
          //   // Yeast Complementation
          //   this.hasAssay.yeast_comp = true;
          //   this.yeastEssentiality = json.yeast_comp.yeast_essentiality;
          //   this.yeastHomologData = json.yeast_comp.yeast_homolog_data ? json.yeast_comp.yeast_homolog_data : this.yeastHomologData;
          // }

          // if (json.hasOwnProperty("y2h")) {
          //   // Yeast Two-Hybrid
          //   this.hasAssay.y2h = true;
          //   this.y2hInteractors = json.y2h.y2h_interactors;
          // }

          // // Populate Disease Phenotype information
          // this.hasPhenotype.any =
          //   json.hasOwnProperty("omim") ||
          //   json.hasOwnProperty("hgmd") ||
          //   json.hasOwnProperty("cancer_census") ||
          //   json.hasOwnProperty("orphanet") ||
          //   json.hasOwnProperty("invitae") ||
          //   json.hasOwnProperty("deo_etal");

          // if (json.hasOwnProperty("omim")) {
          //   // OMIM Phenotype
          //   this.hasPhenotype.omim = true;
          //   this.omimPhenotype = json.omim.omim_phenotype;
          // }

          // if (json.hasOwnProperty("hgmd")) {
          //   // HGMD Phenotype
          //   this.hasPhenotype.hgmd = true;
          //   this.hgmdPhenotype = json.hgmd.hgmd_phenotype;
          // }

          // if (json.hasOwnProperty("cancer_census")) {
          //   // Cancer Census Phenotype
          //   this.hasPhenotype.cancer_census = true;
          //   this.cancerGeneCensusPhenotype.somatic =
          //     json.cancer_census.cancer_census_somatic ? json.cancer_census.cancer_census_somatic : this.cancerGeneCensusPhenotype.somatic;
          //   this.cancerGeneCensusPhenotype.germline =
          //     json.cancer_census.cancer_census_germline ? json.cancer_census.cancer_census_germline : this.cancerGeneCensusPhenotype.germline;
          // }

          // if (json.hasOwnProperty("orphanet")) {
          //   // Orphanet Phenotype
          //   this.hasPhenotype.orphanet = true;
          //   this.orphanetData = json.orphanet.orphanet_data;
          // }

          // if (json.hasOwnProperty("invitae")) {
          //   // Invitiae Panel
          //   this.hasPhenotype.invitae = true;
          //   this.invitaeData = json.invitae.invitae_panel;
          // }

          // if (json.hasOwnProperty("deo_etal")) {
          //   // Deo et. al Phenotype
          //   this.hasPhenotype.others = true;
          //   this.deoEtalPhenotype = json.deo_etal.deo_etal_phenotype;
          // }
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
        this.isLoading = false;

        // Scroll to the element if route has is set
        if (this.$route.hash) {
          this.scrollToElement(this.$route.hash);
        }
      });
  },
  data() {
    return {
      isExpandDetail: false,
      isLoading: true,
      showErrorComponent: false,
      errorResponse: undefined,
      isFloat: false,
      description: "",
      entrezID: "",
      ensemblID: "",
      omimID: "",
      alias: [],
      hasAssay: {},
      hasPhenotype: {},
      yeastEssentiality: false,
      yeastHomologData: [],
      tkoPubmed: ["26627737", "28655737"],
      y2hInteractors: [],
      genomeRNAiTotalEntries: 0,
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
    },
    scrollToElement(element) {
      const option = {
        easing: "ease-in-out",
        offset: -60,
        force: true,
        cancelable: true,
        x: false,
        y: true
      };
      this.$scrollTo(element, option);
    },
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
