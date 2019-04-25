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
                <li v-if="hasAssay.genome_crispr">
                  <a href="#genome-crispr">GenomeCRISPR</a>
                </li>
                <li v-if="hasAssay.genome_rnai">
                  <a href="#genome-rnai">GenomeRNAi</a>
                </li>
                <li v-if="hasAssay.orthology">
                  <a href="#comp">Orthology</a>
                </li>
                <li v-if="hasAssay.overexpression">
                  <a href="#over-expression">Over Expression</a>
                </li>
                <li v-if="hasAssay.huri">
                  <a href="#huri">Human Interactome</a>
                </li>
              </ul>
              <p class="menu-label" v-if="hasPhenotype.any">Disease Phenotype</p>
              <ul class="menu-list" v-if="hasPhenotype.any">
                <li v-if="hasPhenotype.clinvar">
                  <a href="#clinvar">Clinvar</a>
                </li>
                <li v-if="hasPhenotype.omim">
                  <a href="#omim">OMIM</a>
                </li>
                <li v-if="hasPhenotype.cancer_census">
                  <a href="#cancer_census">Cancer Gene Census</a>
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
              <p class="menu-label" v-if="lastUpdate">Last Update: {{lastUpdate}}</p>
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
                      <span v-if="alias || alias_description">
                      (Alias: {{flatten([alias, alias_description]).join(", ")}})
                      </span>
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
                            </a>
                          </b-tooltip>
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
                <AssayTitle
                  anchor="genome-crispr"
                  title="GenomeCRISPR"
                  icon="fas fa-bars"
                  reflink="/about#genome-crispr"
                ></AssayTitle>

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
                      <b-table-column field="source" label="Pubmed Source" width="150">
                        <a
                          :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + 
                              props.row.source"
                          target="_blank"
                        >
                          <span>{{props.row.source}} &nbsp;</span>
                          <b-tag type="is-warning" v-show="tkoPubmed.includes(props.row.source)">TKO</b-tag>
                        </a>
                      </b-table-column>

                      <b-table-column
                        field="condition"
                        label="Condition"
                        width="300"
                      >{{props.row.condition}}</b-table-column>

                      <b-table-column field="screen" label="Screen" width="150">{{props.row.screen}}</b-table-column>

                      <b-table-column field="cellline" label="Cell Lines">
                        <ExpandableRow :elements="props.row.cellline" preview_items="5"></ExpandableRow>
                      </b-table-column>
                    </template>
                  </b-table>
                </div>
              </div>

              <div v-if="hasAssay.genome_rnai">
                <AssayTitle
                  anchor="genome-rnai"
                  title="GenomeRNAi"
                  icon="fas fa-bars"
                  reflink="/about#genome-rnai"
                ></AssayTitle>

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
                      <b-taglist attached>
                        <b-tag size="is-medium" type="has-background-grey-lighter">
                          Hits / Total &nbsp;
                          <b-tooltip
                            type="is-dark"
                            multilined
                            label="Hits vs. Total entries in genome RNAi 
                              database. Click to read the full explanation."
                          >
                            <a
                              href="http://www.genomernai.org/v17/geneFrequentHitters"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <b-icon pack="fas" size="is-small" icon="question-circle"></b-icon>
                            </a>
                          </b-tooltip>
                        </b-tag>
                        <b-tag size="is-medium" type="has-background-white-bis">
                          {{genomeRNAiData.length}}
                          / {{genomeRNAiTotalEntries}}
                        </b-tag>
                      </b-taglist>
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

                      <b-table-column
                        field="phenotype"
                        label="Phenotype"
                        width="350"
                      >{{props.row.phenotype.join(', ')}}</b-table-column>

                      <b-table-column field="cellline" label="Cell Line">
                        <ExpandableRow
                          :elements="props.row.cellline.split(',')"
                          preview_items="5"
                          bold
                        ></ExpandableRow>
                      </b-table-column>
                    </template>
                  </b-table>
                </div>
              </div>

              <div v-if="hasAssay.orthology">
                <AssayTitle
                  anchor="orthology"
                  title="Orthology"
                  icon="fas fa-bars"
                  reflink="/about#orthology"
                ></AssayTitle>

                <div class="card has-table-padding in-paragraph in-list">
                  <b-table
                    :data="orthologyData"
                    paginated
                    per-page="10"
                    pagination-simple
                    hoverable
                    narrowed
                  >
                    <template slot-scope="props" slot="header">
                      {{props.column.label}}
                      <b-tooltip
                        v-if="!!props.column.meta"
                        :label="props.column.meta"
                        type="is-dark"
                        multilined
                      >
                        <b-icon pack="fas" size="is-small" icon="question-circle"></b-icon>
                      </b-tooltip>
                    </template>

                    <template slot-scope="props">
                      <b-table-column field="source" label="Pubmed Source" width="150">
                        <a
                          :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + props.row.source"
                          target="_blank"
                        >{{props.row.source}}</a>
                      </b-table-column>

                      <b-table-column field="species" label="Species" width="150">
                        <span class="is-italic">{{props.row.species}}</span>
                      </b-table-column>

                      <b-table-column
                        field="complementation"
                        label="Complementation"
                        meta="Trans-species complementation. 
                        NA stands for data not available."
                        width="200"
                      >{{props.row.complementation}}</b-table-column>

                      <b-table-column field="gene" label="Gene">
                        <!-- Use different source for S. cerevisiae and S. pombe -->
                        <div v-if="props.row.species == 'S. cerevisiae'">
                          <ExpandableRow
                            :elements="props.row.gene"
                            link_prefix="https://www.yeastgenome.org/locus/"
                            preview_items="5"
                            bold
                          ></ExpandableRow>
                        </div>
                        <div v-else-if="props.row.species == 'S. pombe'">
                          <ExpandableRow
                            :elements="props.row.gene"
                            link_prefix="../redirect/spombe+"
                            preview_items="5"
                            bold
                          ></ExpandableRow>
                        </div>
                        <div v-else>
                          <ExpandableRow :elements="props.row.gene" preview_items="5" bold></ExpandableRow>
                        </div>
                      </b-table-column>
                    </template>
                  </b-table>
                </div>
              </div>

              <div id="overexpression" v-if="hasAssay.overexpression">
                <AssayTitle
                  anchor="over-expression"
                  title="Over Expression Assay"
                  icon="fas fa-bars"
                ></AssayTitle>
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
                            type="is-dark"
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

              <div v-if="hasAssay.huri">
                <AssayTitle anchor="huri" title="Human Interactome" icon="fas fa-bars"></AssayTitle>

                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list is-flex is-vcentered">
                    <button
                      class="button is-outlined"
                      @click="showCytoscapeView = !showCytoscapeView"
                    >
                      <figure class="image is-24x24 is-marginless">
                        <img src="../assets/cytoscape-logo.png" alt="cytoscape-logo">
                      </figure>
                      <span>&nbsp;&nbsp; Visualize with CytoScape.js</span>
                    </button>
                    &nbsp;&nbsp; {{geneName}} has {{huriData.length}}
                    interaction pair{{huriData.length > 1 ? "s" : ""}}
                    in the HuRI database.
                    <b-modal :active.sync="showCytoscapeView" has-modal-card width="500">
                      <CytoscapeView :head="geneName" :elements="huriData"/>
                    </b-modal>
                  </div>
                </div>
              </div>
            </section>

            <div class="is-divider" v-if="hasPhenotype.any"></div>

            <section class="section is-paddingless" v-if="hasPhenotype.any">
              <h1 class="title">Disease Phenotype</h1>
              <div v-if="hasPhenotype.clinvar">
                <AssayTitle
                  anchor="clinvar"
                  title="Clinvar"
                  icon="fas fa-bars"
                  reflink="/about#clinvar"
                ></AssayTitle>
                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list">
                    <div class="clinvar-stats clinvar-stats-adaptive">
                      <apexchart type="bar" height="120px" :options="chartOptions" :series="clinvarStats"></apexchart>
                    </div>

                    <b-table v-if="clinvarData.pathogenic_variants"
                      :data="clinvarData.pathogenic_variants"
                      narrowed
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                      detailed
                      detailed-key="id"
                      default-sort="review_star"
                      default-sort-direction="desc"
                      class="clinvar-table"
                    >
                      <template slot="bottom-left">
                          Click&nbsp;
                          <b-icon pack="fas" type="is-link" size="is-small" icon="chevron-right"></b-icon>
                          &nbsp;to Show Phenotypes
                      </template>

                      <template slot-scope="props">
                        <b-table-column field="id" label="Clinvar ID" width="100">
                          <a
                            :href="'https://www.ncbi.nlm.nih.gov/clinvar/variation/'+ props.row.id"
                            target="_blank"
                          >{{props.row.id}}</a>
                        </b-table-column>

                        <b-table-column
                          class="is-capitalized"
                          field="name"
                          label="Name"
                        >{{props.row.name}}</b-table-column>

                        <b-table-column field="review_star" label="Review Status" sortable>
                          <b-tooltip class="is-capitalized" type="is-dark" :label="props.row.review_stats" multilined>
                            <b-icon
                              pack="fas"
                              icon="star"
                              type="is-warning"
                              v-for="n in props.row.review_star"
                              v-bind:key="n"
                            ></b-icon>
                            <b-icon
                              pack="far"
                              icon="star"
                              type="is-warning"
                              v-if="props.row.review_star < 1"
                            ></b-icon>
                          </b-tooltip>
                        </b-table-column>

                        <b-table-column
                          sortable
                          class="is-capitalized"
                          field="type"
                          label="Type"
                        >{{props.row.type === "single nucleotide variant" ? "SNV" : props.row.type}}</b-table-column>

                        <b-table-column class="is-capitalized" field="origin" label="Origin">
                          <ExpandableRow :elements="props.row.origin.split('/')" preview_items="5"></ExpandableRow>
                        </b-table-column>
                      </template>

                      <template slot="detail" slot-scope="props">
                        <p class="title is-5">Phenotype</p>
                        <div class="columns">
                          <div class="column">
                            <p
                              class="is-marginless is-capitalized"
                              v-for="p in splitInChunk(props.row.phenotype.split(';'), 2, 1)"
                              v-bind:key="p"
                            >{{p}}</p>
                          </div>
                          <div class="column">
                            <p
                              class="is-marginless is-capitalized"
                              v-for="p in splitInChunk(props.row.phenotype.split(';'), 2, 2)"
                              v-bind:key="p"
                            >{{p}}</p>
                          </div>
                        </div>
                      </template>
                    </b-table>

                    <div v-else class="has-text-centered">No pathogenic variants available.</div>
                  </div>
                </div>
              </div>

              <div v-if="hasPhenotype.omim">
                <AssayTitle
                  anchor="omim"
                  title="OMIM Database"
                  icon="fas fa-bars"
                  reflink="/about#omim"
                ></AssayTitle>
                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list">
                    <b-table
                      :data="omimPhenotype"
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                      narrowed
                    >
                      <template slot-scope="props" slot="header">
                        {{props.column.label}}
                        <b-tooltip
                          v-if="props.column.meta"
                          label="More details can be found on OMIM website."
                          type="is-dark"
                          multilined
                        >
                          <a
                            href="https://www.omim.org/help/faq#1_6"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <b-icon pack="fas" size="is-small" icon="question-circle"></b-icon>
                          </a>
                        </b-tooltip>
                      </template>

                      <template slot-scope="props">
                        <b-table-column field="phenotype" label="Phenotype">{{props.row.phenotype}}</b-table-column>

                        <b-table-column field="badge" label="Annotation" :meta="true">
                          <ExpandableRow
                            class="is-inline cell-line is-capitalized"
                            :elements="flatten([
                              props.row.inheritance.split('|'), 
                              props.row.phenotype_type,
                              parseOmimType(props.row.mapping_annot)
                            ])"
                            preview_items="5"
                          ></ExpandableRow>
                        </b-table-column>
                      </template>
                    </b-table>
                  </div>
                </div>
              </div>

              <div v-if="hasPhenotype.cancer_census">
                <AssayTitle
                  anchor="cancer_census"
                  title="Cancer Gene Census"
                  icon="fas fa-bars"
                  reflink="/about#cancer-census"
                ></AssayTitle>
                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list">
                    <b-table
                      :data="cancerGeneCensusPhenotype"
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                      narrowed
                    >
                      <template slot-scope="props">
                        <b-table-column field="tier" label="Tier" width="50">{{props.row.tier}}</b-table-column>

                        <b-table-column
                          field="inheritance"
                          label="Inheritance"
                          width="50"
                        >{{props.row.inheritance}}</b-table-column>

                        <b-table-column field="hallmark" label="Hallmark" width="50">
                          <b-icon
                            pack="fas"
                            type="is-grey"
                            :icon="props.row.hallmark ? 'check-circle' : 'times-circle'"
                          ></b-icon>
                        </b-table-column>

                        <b-table-column field="germline" label="Germline" width="400">
                          <ExpandableRow
                            class="is-capitalized"
                            :elements="props.row.tumour_germline.map(e => e.trim())"
                            preview_items="3"
                          ></ExpandableRow>
                        </b-table-column>

                        <b-table-column field="somatic" label="Somatic">
                          <ExpandableRow
                            class="is-capitalized"
                            :elements="props.row.tumour_somatic.map(e => e.trim())"
                            preview_items="3"
                          ></ExpandableRow>
                        </b-table-column>
                      </template>
                    </b-table>
                  </div>
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
                    <b-table
                      :data="orphanetData"
                      narrowed
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                    >
                      <template slot-scope="props">
                        <b-table-column field="id" label="ORPHA ID" width="100">
                          <a
                            :href="'https://www.orpha.net/consor/cgi-bin/Disease_Search_Simple.php?lng=EN&Disease_Disease_Search_diseaseGroup='
                             + props.row.id + '&Disease_Disease_Search_diseaseType=ORPHA'"
                            target="_blank"
                          >{{props.row.id}}</a>
                        </b-table-column>

                        <b-table-column field="source" label="Source" width="75">
                          <ExpandableRow :elements="props.row.source" preview_items="3"></ExpandableRow>
                        </b-table-column>

                        <b-table-column field="prevalence" label="Prevalence" width="100">
                          <ExpandableRow :elements="props.row.prevalence" preview_items="3"></ExpandableRow>
                        </b-table-column>

                        <b-table-column field="type" label="Type" width="300">
                          <ExpandableRow
                            :elements="props.row.prev_type.split('|')"
                            preview_items="3"
                          ></ExpandableRow>
                        </b-table-column>

                        <b-table-column field="disorder" label="Disorder">{{props.row.disorder}}</b-table-column>
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
                      hoverable
                    >
                      <template slot-scope="props">
                        <b-table-column field="id" label="Test ID" width="100">
                          <a
                            :href="'https://www.invitae.com/en/physician/tests/'+ props.row.id"
                            target="_blank"
                          >{{props.row.id}}</a>
                        </b-table-column>

                        <b-table-column field="panel" label="Panel">
                          <ExpandableRow :elements="props.row.panel" preview_items="3"></ExpandableRow>
                        </b-table-column>

                        <b-table-column field="name" label="Test Name">{{props.row.name}}</b-table-column>
                      </template>
                    </b-table>
                  </div>
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
import CytoscapeView from "@/components/CytoscapeView.vue";
import ErrorView from "@/components/ErrorView.vue";
import Lodash from "lodash";
import VueApexCharts from 'vue-apexcharts'

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
  render: function(createElement) {
    return this.constructElement(this.reflink, createElement);
  },
  methods: {
    constructElement: function(reflink, createElement) {
      return createElement(
        "a",
        { attrs: { href: reflink, target: "_blank" } },
        [
          createElement("b-tag", [
            createElement("b-icon", { props: { icon: "far fa-file-alt" } }),
            createElement("span", "Source")
          ])
        ]
      );
    }
  }
};

export default {
  name: "gene-details",
  components: {
    Header,
    ExpandableRow,
    AssayTitle,
    RefBadge,
    CytoscapeView,
    ErrorView,
    'apexchart': VueApexCharts
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
          )
            return;
          const json = response.body;

          // Populate basic information
          this.description = json.description;
          this.entrezID = json.entrez_id;
          this.ensemblID = json.ensembl_id;
          this.omimID = json.omim_id;
          this.alias = json.alias;
          this.alias_description = json.alias_description;

          // Handle date
          const date = new Date(json.last_update);
          this.lastUpdate =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate();

          // Populate Assay information
          if (json.hasOwnProperty("genome_rnai")) {
            this.hasAssay.any = true;
            this.hasAssay.genome_rnai = true;
            this.genomeRNAiData = json.genome_rnai.hits;
            this.genomeRNAiTotalEntries = json.genome_rnai.total_entries;
          }

          if (json.hasOwnProperty("genome_crispr")) {
            this.hasAssay.any = true;
            this.hasAssay.genome_crispr = true;
            this.genomeCRISPRData = json.genome_crispr;
          }

          if (json.hasOwnProperty("orthology")) {
            this.hasAssay.any = true;
            this.hasAssay.orthology = true;
            this.orthologyData = json.orthology;
          }

          if (json.hasOwnProperty("overexpression")) {
            // Over Expression
            this.hasAssay.any = true;
            this.hasAssay.overexpression = true;
            this.overexprData = json.overexpression;
          }

          if (json.hasOwnProperty("huri")) {
            // Human Interactome
            this.hasAssay.any = true;
            this.hasAssay.huri = true;
            this.huriData = json.huri;
          }

          if (json.hasOwnProperty("omim")) {
            // OMIM Phenotype
            this.hasPhenotype.any = true;
            this.hasPhenotype.omim = true;
            this.omimPhenotype = json.omim;
          }

          if (json.hasOwnProperty("clinvar")) {
            // OMIM Phenotype
            this.hasPhenotype.any = true;
            this.hasPhenotype.clinvar = true;
            this.clinvarData = json.clinvar;

            // Construct apexgraph
            this.clinvarStats = [
              {
                name: 'Benign',
                data: [this.clinvarData.benign]
              },
              {
                name: 'Likely Benign',
                data: [this.clinvarData.likely_benign]
              },
              {
                name: 'Uncertain',
                data: [this.clinvarData.uncertain]
              },
              {
                name: 'Likely Pathogenic',
                data: [this.clinvarData.likely_pathogenic]
              },
              {
                name: 'Pathogenic',
                data: [this.clinvarData.pathogenic]
              },
              {
                name: 'Others',
                data: [this.clinvarData.others]
              }
            ]
          }

          if (json.hasOwnProperty("cancer_census")) {
            // Cancer Census Phenotype
            this.hasPhenotype.any = true;
            this.hasPhenotype.cancer_census = true;
            this.cancerGeneCensusPhenotype = json.cancer_census;
          }

          if (json.hasOwnProperty("orphanet")) {
            // Orphanet Phenotype
            this.hasPhenotype.any = true;
            this.hasPhenotype.orphanet = true;
            this.orphanetData = json.orphanet;
          }

          if (json.hasOwnProperty("invitae")) {
            // Invitiae Panel
            this.hasPhenotype.any = true;
            this.hasPhenotype.invitae = true;
            this.invitaeData = json.invitae;
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
      lastUpdate: "",
      alias: [],
      alias_description: [],
      hasAssay: {},
      hasPhenotype: {},
      orthologyData: [],
      tkoPubmed: ["26627737", "28655737"],
      huri: [],
      showCytoscapeView: false,
      genomeRNAiTotalEntries: 0,
      genomeRNAiData: [],
      genomeCRISPRData: [],
      overexprData: [],
      clinvarData: {},
      clinvarStats: [],
      omimPhenotype: [],
      cancerGeneCensusPhenotype: [],
      orphanetData: [],
      invitaeData: [],
      chartOptions: {
        chart: {
          stacked: true,
          stackType: '100%',
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false },
          crosshairs: { show: false },
          tooltip: { enabled: false }
        },
        yaxis: { 
          show: false,
          axisBorder: { show: false },
          axisTicks: { show: false },
          crosshairs: { show: false },
          tooltip: { enabled: false }
        },
        grid: { show: false },
        tooltip: {
          x: { show: false },
          y: {
            formatter: function(value, { series }) {
              return value + ", " + (value / series.map(Number).reduce((t, n) => t + parseInt(n)) * 100).toFixed(2) + "%"
            }
          },
          theme: "light",
        },
        dataLabels: { 
          enabled: true,
          style: { fontSize: '18px' }
        },
        legend: {
          onItemClick: { toggleDataSeries: false },
          position: "top",
          offsetY: 15
        },
        responsive: [{
          breakpoint: 768,
          options: {
            legend: { show: false }
          }
        }]
      }
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
    flatten(list) {
      return Lodash.flattenDeep(list.filter(e => e != "NA" && e != undefined));
    },
    parseOmimType(type) {
      switch (type) {
        case 1:
          return "Mapping Wildtype";
        case 2:
          return "Mapping Phenotype";
        case 3:
          return "Known Molecular Basis";
        case 4:
          return "Chromosome Deletion/Duplication";
        default:
          return "Unknown Type";
      }
    },
    splitInChunk(list, total, index) {
      // Remove not provided unless there's nothing else
      let l = list.filter(e => e != "not provided");
      if (l.length < 1) l = ["not provided"];

      return Lodash.chunk(l, total)[index - 1];
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
.omim-phenotype {
  margin-left: 0.5rem;
  margin-bottom: 0.75rem;
}
@media all and (max-width: 768px) {
  .clinvar-stats-adaptive {
    margin-top: -35px !important;
  }
}
.clinvar-stats {
  overflow: hidden;
  margin-top: -10px;
  margin-bottom: -50px;
  z-index: 1;
}
.clinvar-table {
  position: relative;
  z-index: 2;
}
</style>
