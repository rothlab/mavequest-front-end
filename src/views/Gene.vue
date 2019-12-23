<template>
  <div class="details">
    <!-- Header -->
    <Header v-bind:title="geneName"></Header>

    <!-- Main -->
    <section class="section fill-screen-withheader">
      <div class="container">
        <!-- Display an error component if received a bad response from the back-end -->
        <ErrorView v-if="showErrorComponent" :response="errorResponse"></ErrorView>

        <div class="columns" v-if="!showErrorComponent">
          <!-- Table of Contents -->
          <div class="column is-3 is-hidden-touch">
            <aside class="menu float">
              <scrollactive ref="scrollactive" :offset="400">
                <p class="menu-label" v-if="hasAssay.any">Potential Assay</p>
                <ul class="menu-list" v-if="hasAssay.any">
                  <li v-if="hasAssay.genome_crispr">
                    <a href="#genome_crispr" class="scrollactive-item">GenomeCRISPR</a>
                  </li>
                  <li v-if="hasAssay.genome_rnai">
                    <a href="#genome_rnai" class="scrollactive-item">GenomeRNAi</a>
                  </li>
                  <li v-if="hasAssay.ogee">
                    <a href="#ogee" class="scrollactive-item">OGEE</a>
                  </li>
                  <li v-if="hasAssay.orthology">
                    <a href="#orthology" class="scrollactive-item">Orthology</a>
                  </li>
                  <li v-if="hasAssay.overexpression">
                    <a href="#over-expression" class="scrollactive-item">Over Expression</a>
                  </li>
                  <li v-if="hasAssay.huri">
                    <a href="#huri" class="scrollactive-item">Human Interactome</a>
                  </li>
                </ul>
                <p class="menu-label" v-if="hasPhenotype.any">Disease Phenotype</p>
                <ul class="menu-list" v-if="hasPhenotype.any">
                  <li v-if="hasPhenotype.clinvar">
                    <a href="#clinvar" class="scrollactive-item">ClinVar</a>
                  </li>
                  <li v-if="hasPhenotype.omim">
                    <a href="#omim" class="scrollactive-item">OMIM</a>
                  </li>
                  <li v-if="hasPhenotype.cancer_census">
                    <a href="#cancer_census" class="scrollactive-item">Cancer Gene Census</a>
                  </li>
                  <li v-if="hasPhenotype.pharmgkb">
                    <a href="#pharmgkb" class="scrollactive-item">PharmGKB</a>
                  </li>
                  <li v-if="hasPhenotype.orphanet">
                    <a href="#orpha" class="scrollactive-item">Orphanet</a>
                  </li>
                </ul>
                <p class="menu-label" v-if="hasClinicalInterest.any">Clinical Interest</p>
                <ul class="menu-list" v-if="hasClinicalInterest.any">
                  <li v-if="hasClinicalInterest.invitae">
                    <a href="#invitae" class="scrollactive-item">Invitae</a>
                  </li>
                  <li v-if="hasClinicalInterest.ambry">
                    <a href="#ambry" class="scrollactive-item">Ambry</a>
                  </li>
                  <li v-if="hasClinicalInterest.genedx">
                    <a href="#genedx" class="scrollactive-item">GeneDx</a>
                  </li>
                </ul>
                <p class="menu-label" v-if="lastUpdate">Last Update: {{lastUpdate}}</p>
              </scrollactive>
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

                  <div class="column gene-summary gene-card-description-adaptive">
                    <p class="is-capitalized is-italic" style="margin-bottom:0.5rem">
                      {{description}}
                      <span
                        v-if="alias || alias_description"
                      >(Alias: {{flatten([alias, alias_description]).join(", ")}})</span>
                    </p>
                    <div style="margin-bottom:0.5rem" v-if="aaLength">
                      <span>Canonical Isoform:</span>
                      <span v-if="aaLength.is_agreed === 'agree'">
                        {{aaLength.combined.join(', ')}} a.a.
                        <b-tooltip
                          label="Agreed between Ensembl and Uniprot databases."
                          type="is-dark"
                          position="is-left"
                          multilined
                        >
                          <b-icon type="is-success" icon="check-circle" pack="fas"></b-icon>
                        </b-tooltip>
                      </span>

                      <span v-else-if="aaLength.is_agreed === 'intersect'">
                        {{aaLength.combined.join(', ')}} a.a.
                        <b-tooltip
                          label="Intersect between Ensembl and Uniprot databases."
                          type="is-dark"
                          position="is-left"
                          multilined
                        >
                          <b-icon icon="dot-circle" pack="far"></b-icon>
                        </b-tooltip>
                        {{aaLength.ensembl.join(', ')}} a.a. (Ensembl),
                        {{aaLength.uniprot.join(', ')}} a.a. (Uniprot)
                      </span>

                      <span v-else-if="aaLength.is_agreed === 'disagree'">
                        {{aaLength.ensembl.join(', ')}} a.a. (Ensembl),
                        {{aaLength.uniprot.join(', ')}} a.a. (Uniprot)
                        <b-tooltip
                          label="Disagreement between Ensembl and Uniprot databases."
                          type="is-dark"
                          position="is-left"
                          multilined
                        >
                          <b-icon type="is-danger" icon="exclamation-triangle" pack="fas"></b-icon>
                        </b-tooltip>
                      </span>

                      <span v-else-if="aaLength.is_agreed === 'one-missing'">
                        {{aaLength.combined.join(', ')}} a.a.
                        <b-tooltip
                          :label="aaLength.uniprot ? 
                            'Data missing in Ensembl databases.' 
                            : 'Data missing in Uniprot databases.'"
                          type="is-dark"
                          position="is-left"
                          multilined
                        >
                          <b-icon icon="exclamation-triangle" pack="fas"></b-icon>
                        </b-tooltip>
                      </span>
                    </div>

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

                      <div class="control" v-if="uniprotID.length > 0">
                        <b-tooltip :label="uniprotID.join(', ')" type="is-dark">
                          <b-tag class="has-background-grey">
                            <a
                              :href="uniprotID.length > 1 ? 
                                'https://www.uniprot.org/uniprot/?query=' + uniprotID.join('+OR+')
                                : 'https://www.uniprot.org/uniprot/' + uniprotID[0]"
                              target="_blank"
                              class="has-text-white"
                            >
                              Uniprot &nbsp;
                              <b-icon icon="external-link-alt" size="is-small"></b-icon>&nbsp;
                            </a>
                          </b-tag>
                        </b-tooltip>
                      </div>
                    </b-field>
                  </div>
                </div>

                <div class="has-background-white" v-if="ensemblID">
                  <b-collapse
                    aria-id="transcript-peptide"
                    :open.sync="showTranscripts"
                    @open="queryEnsembl"
                  >
                    <div
                      slot="trigger"
                      class="panel-heading"
                      role="button"
                      aria-controls="transcript-peptide"
                    >
                      <b-icon
                        pack="fas"
                        icon="chevron-right"
                        size="is-small"
                        :style="{ transform: showTranscripts ? 'rotate(0.25turn)' : '' } "
                      ></b-icon>
                      <span>&nbsp;&nbsp;Isoforms and Transcripts</span>
                    </div>

                    <div class="item-border">
                      <b-table
                        class="is-fullwidth"
                        :data="transcriptList"
                        paginated
                        per-page="10"
                        pagination-simple
                        hoverable
                        narrowed
                        default-sort="peptide_length"
                        default-sort-direction="desc"
                        :selected="transcriptList[0]"
                      >
                        <template slot="bottom-left">
                          <b-taglist>
                            <b-tag type="is-info" size="is-medium">Canonical isoform</b-tag>
                            <b-tag type="is-light" size="is-medium">
                              Data Source:&nbsp;
                              <a
                                href="https://useast.ensembl.org/index.html"
                                target="_blank"
                              >Ensembl</a>
                            </b-tag>
                          </b-taglist>
                        </template>

                        <template slot="empty">
                          <p
                            class="title is-6 is-flex is-vcentered is-hcentered"
                            v-if="loadingTranscriptsStatus === 1"
                          >
                            <SyncLoader :size="5" color="#7A7A7A"></SyncLoader>
                            <span class="has-text-grey">&nbsp;&nbsp;Loading</span>
                          </p>
                          <p
                            class="has-text-centered title is-6"
                            v-else-if="loadingTranscriptsStatus === -1"
                          >
                            <span class="has-text-grey">Failed to load from Ensembl API</span>
                          </p>
                        </template>

                        <template slot-scope="props" slot="header">
                          {{props.column.label}}
                          <b-tooltip
                            v-if="props.column.meta"
                            label="Find more details on Ensembl website."
                            type="is-dark"
                            multilined
                          >
                            <a
                              href="https://www.ensembl.org/info/genome/genebuild/biotypes.html"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <b-icon pack="fas" size="is-small" icon="question-circle"></b-icon>
                            </a>
                          </b-tooltip>
                        </template>

                        <template slot-scope="props">
                          <b-table-column field="transcript" label="Transcript ID" width="200">
                            <a
                              :href="'https://www.ensembl.org/Homo_sapiens/transview??transcript=' + props.row.id"
                              target="_blank"
                              rel="noopener noreferrer"
                            >{{props.row.id}}</a>
                          </b-table-column>
                          <b-table-column field="name" label="Display Name">{{props.row.name}}</b-table-column>
                          <b-table-column
                            class="is-capitalized"
                            field="biotype"
                            label="Biotype"
                            sortable
                            meta="true"
                            :custom-sort="bioTypeSort"
                          >{{props.row.biotype.replace(/_/g, " ")}}</b-table-column>
                          <b-table-column
                            field="num_exons"
                            label="# Exons"
                            sortable
                          >{{props.row.num_exons}}</b-table-column>
                          <b-table-column field="peptide" label="Peptide ID">
                            <a
                              v-if="props.row.peptide_id != 'NA'"
                              :href="'https://www.ensembl.org/Homo_sapiens/protview?peptide=' + props.row.peptide_id"
                              target="_blank"
                              rel="noopener noreferrer"
                            >{{props.row.peptide_id}}</a>
                            <span v-else>{{props.row.peptide_id}}</span>
                          </b-table-column>
                          <b-table-column
                            field="peptide_length"
                            label="Length (a.a.)"
                            sortable
                            :custom-sort="lengthAaSort"
                          >{{props.row.peptide_length}}</b-table-column>
                        </template>
                      </b-table>
                    </div>
                  </b-collapse>
                </div>
              </div>
            </section>

            <!-- No assays and phenotypes banner -->
            <section v-if="(!hasAssay.any && !hasPhenotype.any) && !isLoading">
              <ErrorView icon="fas fa-file" response="No Potential Assays or Phenotypes Found"></ErrorView>
            </section>

            <section class="section is-paddingless" v-if="hasAssay.any">
              <h1 class="title">Potential Assay</h1>

              <div v-if="hasAssay.mavedb">
                <AssayTitle
                  anchor="mavedb"
                  title="MaveDB"
                  icon="fas fa-bars"
                  :dblink="'https://www.mavedb.org/search/?target=' + geneName"
                  reflink="/about#mavedb"
                ></AssayTitle>

                <div class="card has-table-padding in-paragraph in-list">
                  <b-table
                    :data="mavedbData"
                    paginated
                    per-page="10"
                    pagination-simple
                    hoverable
                    narrowed
                  >
                    <template slot="bottom-left">
                      <b-tag
                        size="is-medium"
                        >
                        <b-icon pack="fas" size="is-small" icon="info-circle"></b-icon>
                        <span>&nbsp;MAVE studies related to {{geneName}}</span>
                      </b-tag>
                    </template>
                    <template slot-scope="props">
                      <b-table-column field="id" label="ID">
                        <a
                          :href="'https://www.mavedb.org/experiment/' + props.row.id"
                          target="_blank"
                        >{{props.row.id}}</a>
                      </b-table-column>

                      <b-table-column field="name" label="Name">
                        {{props.row.name}}
                      </b-table-column>

                      <b-table-column field="type" label="Type">
                        {{props.row.type}}
                      </b-table-column>
                    </template>
                  </b-table>
                </div>
              </div>

              <div v-if="hasAssay.genome_crispr">
                <AssayTitle
                  anchor="genome_crispr"
                  title="GenomeCRISPR"
                  icon="fas fa-bars"
                  :dblink="'http://genomecrispr.dkfz.de/#!/results/' + geneName"
                  reflink="/about#genome_crispr"
                ></AssayTitle>
                <GenomeCRISPRView
                  :genomeCRISPRData="genomeCRISPRData"
                  :genomeCRISPRStats="genomeCRISPRStats"
                ></GenomeCRISPRView>
              </div>

              <div v-if="hasAssay.genome_rnai">
                <AssayTitle
                  anchor="genome_rnai"
                  title="GenomeRNAi"
                  icon="fas fa-bars"
                  :dblink="'http://www.genomernai.org/v17/geneSearch/' + geneName"
                  reflink="/about#genome_rnai"
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
                        <b-tag size="is-medium" type="is-light">
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
                          v-if="props.row.source && props.row.source !== '0'"
                        >{{props.row.source}}</a>
                        <span v-else>NA</span>
                      </b-table-column>

                      <b-table-column
                        field="phenotype"
                        label="Phenotype"
                        width="350"
                      >{{props.row.phenotype.join(', ')}}</b-table-column>

                      <b-table-column field="cellline" label="Cell Line">
                        <ExpandableRow :elements="props.row.cellline" preview_items="5" bold></ExpandableRow>
                      </b-table-column>
                    </template>
                  </b-table>
                </div>
              </div>

              <div v-if="hasAssay.ogee">
                <AssayTitle
                  anchor="ogee"
                  title="OGEE"
                  icon="fas fa-bars"
                  :dblink="['http://ogee.medgenius.info/browse/Homo%2520sapiens/'+ ensemblID]"
                  reflink="/about#ogee"
                ></AssayTitle>

                <div class="card has-table-padding in-paragraph in-list">
                  <b-tabs vertical class="is-expanded">
                    <b-tab-item v-for="(entry, index) of ogeeData" :key="index">
                      <template slot="header">
                        <b-taglist attached>
                          <b-tag
                            type="is-light">
                            PMID: {{entry.pubmed}}
                          </b-tag>
                          <b-tag
                            :type="entry.essential ? 'is-info' 
                              : 'has-background-white-bis'">
                            {{entry.essential ? 'Essential' : 'Non-essential'}}
                          </b-tag>
                        </b-taglist>
                      </template>
                      <h2 class="subtitle">
                        <a
                              :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + 
                                entry.pubmed"
                              target="_blank"
                              rel="noopener noreferrer">
                              <strong>PubMed:</strong> {{entry.pubmed}}
                            </a>
                      </h2>
                      <div
                        class="content"
                        v-for="(study, index) of ogeeStudy[entry.pubmed]"
                        :key="index">
                          <p>
                            <strong>Assay:</strong> {{study.assay}} <br>
                            <strong>Condition:</strong> {{study.condition}} <br>
                            <strong>Definition of Essentiality:</strong> 
                              {{study.def_essential}}
                          </p>
                      </div>
                    </b-tab-item>
                  </b-tabs>
                </div>
              </div>

              <div v-if="hasAssay.orthology">
                <AssayTitle
                  anchor="orthology"
                  title="Orthology"
                  icon="fas fa-bars"
                  :dblink="['http://inparanoid.sbc.su.se/cgi-bin/gene_search.cgi?id='+ geneName, 
                  'http://ppod.princeton.edu/cgi-bin/ppod.cgi?s=' + geneName + '&an=2&t=10&t=42',
                  'https://www.alliancegenome.org/search?category=gene&q=' +geneName + '&species=Homo%20sapiens']"
                  :dblabel="['Inparanoid', 'P-POD', 'AGR']"
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
                    <template slot-scope="props">
                      <b-table-column field="source" label="Pubmed Source" width="150">
                        <a
                          :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + props.row.source"
                          target="_blank"
                          v-if="props.row.source != 'NA'"
                        >{{props.row.source}}</a>
                        <span v-else>{{props.row.source}}</span>
                      </b-table-column>

                      <b-table-column field="species" label="Species" width="150">
                        <span class="is-italic">{{props.row.species}}</span>
                      </b-table-column>

                      <b-table-column
                        field="complementation"
                        label="Trans-species Complementation"
                        width="300"
                      >{{parseComplementation(props.row.complementation)}}</b-table-column>

                      <b-table-column field="gene" label="Orthologous Genes">
                        <!-- Use different source for S. cerevisiae and S. pombe -->

                        <div v-if="orthologDbAvailable.includes(props.row.species)">
                          <ExpandableRow
                            :elements="props.row.gene"
                            :link_prefix="'../redirect/' + props.row.species.replace('. ', '').toLowerCase() + '+'"
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
                <AssayTitle
                  anchor="huri"
                  title="Human Interactome"
                  icon="fas fa-bars"
                  reflink="/about#huri"
                ></AssayTitle>
                <b-modal :active.sync="showCytoscapeView" has-modal-card width="500">
                  <CytoscapeView :head="geneName" :elements="huriData" />
                </b-modal>

                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list is-flex is-vcentered">
                    <div class="level is-fullwidth">
                      <div class="level-left">
                        <span class="subtitle is-5 is-vcentered is-flex">
                          <b-tag rounded size="is-medium" type="is-dark">{{huriData.length}}</b-tag>
                          &nbsp;pair{{huriData.length > 1 ? "s" : ""}}
                          in the HuRI database.
                        </span>
                      </div>
                      <div class="level-right">
                        <button
                          class="button is-outlined is-info is-fullwidth"
                          @click="showCytoscape()"
                        >Visualize with CytoScape.js</button>
                      </div>
                    </div>
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
                  title="ClinVar"
                  icon="fas fa-bars"
                  :dblink="'https://www.ncbi.nlm.nih.gov/clinvar/?term=' + 
                    geneName + '[gene] AND &quot;single gene&quot;[Properties]'"
                  reflink="/about#clinvar"
                ></AssayTitle>
                <ClinvarView
                  :symbol="geneName"
                  :clinvarData="clinvarData"
                  :aaLength="Math.max(parseInt(aaLength.combined))"
                  :conflictCanonical="aaLength.is_agreed !== 'agree'"
                ></ClinvarView>
              </div>

              <div v-if="hasPhenotype.omim">
                <AssayTitle
                  anchor="omim"
                  title="OMIM"
                  icon="fas fa-bars"
                  :dblink="'https://omim.org/entry/' + omimID"
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
                        <b-table-column field="phenotype" label="Phenotype">
                          {{props.row.phenotype.replace(/\d*$/, "")}}
                          <a
                            :href="'https://www.omim.org/entry/' + props.row.phenotype.match(/\d*$/).toString()"
                            target="_blank"
                            rel="noopener noreferrer"
                          >{{props.row.phenotype.match(/\d*$/).toString()}}</a>
                        </b-table-column>

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
                  :dblink="'https://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=' + geneName"
                  reflink="/about#cancer_census"
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
                      <template slot-scope="props" slot="header">
                        {{props.column.label}}
                        <b-tooltip
                          v-if="props.column.field === 'hallmark'"
                          label="Information on the function of proteins coded by cancer genes"
                          type="is-dark"
                          multilined
                        >
                          <b-icon pack="fas" size="is-small" icon="question-circle"></b-icon>
                        </b-tooltip>
                      </template>

                      <template slot-scope="props">
                        <b-table-column field="tier" label="Tier" width="50">{{props.row.tier}}</b-table-column>

                        <b-table-column
                          field="inheritance"
                          label="Inheritance"
                          width="50"
                        >{{props.row.inheritance}}</b-table-column>

                        <b-table-column field="hallmark" label="Hallmark" width="50">
                          <a
                            v-if="props.row.hallmark"
                            :href="'https://cancer.sanger.ac.uk/cosmic/census-page/' 
                              + geneName"
                          >
                            <b-icon pack="fas" icon="check-circle"></b-icon>
                          </a>
                          <b-icon v-else pack="fas" icon="times-circle"></b-icon>
                        </b-table-column>

                        <b-table-column field="germline" label="Germline" width="400">
                          <ExpandableRow
                            v-if="props.row.tumour_germline"
                            class="is-capitalized"
                            :elements="props.row.tumour_germline.map(e => e.trim())"
                            preview_items="3"
                          ></ExpandableRow>
                        </b-table-column>

                        <b-table-column field="somatic" label="Somatic">
                          <ExpandableRow
                            v-if="props.row.tumour_somatic"
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

              <div v-if="hasPhenotype.pharmgkb">
                <AssayTitle
                  anchor="pharmgkb"
                  title="PharmGKB"
                  icon="fas fa-bars"
                  :dblink="'https://www.pharmgkb.org/gene/' + pharmgkbData.pharmgkb_id"
                  reflink="/about#pharmgkb"
                ></AssayTitle>
                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list">
                    <b-table
                      :data="pharmgkbData.records"
                      narrowed
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                    >
                      <template slot-scope="props">
                        <b-table-column
                          class="is-capitalized"
                          field="annot_id"
                          label="Annotation ID">
                          <a
                            :href="'https://www.pharmgkb.org/variantAnnotation/'
                              + props.row.annot_id" 
                            target="_blank"
                            rel="noopener noreferrer">
                            {{props.row.annot_id}}
                          </a>
                        </b-table-column>
                        <b-table-column field="source" label="Pubmed Source">
                          <a
                            :href="'https://www.ncbi.nlm.nih.gov/pubmed/'
                              + props.row.pmid"
                            target="_blank"
                          >{{props.row.pmid}}</a>
                        </b-table-column>
                        <b-table-column
                          class="is-capitalized"
                          field="drug"
                          label="Drug">
                          {{props.row.drug}}
                        </b-table-column>
                        <b-table-column
                          field="phenotype"
                          label="Phenotype"
                          class="is-capitalized">
                          {{props.row.phenotype}}
                        </b-table-column>
                        <b-table-column
                          field="clinical_annot"
                          label="Clinical Evidence Level">
                          <b-tag v-if="props.row.evidence != 'NA'">
                            Level {{props.row.evidence}}
                          </b-tag>
                        </b-table-column>
                      </template>
                    </b-table>
                  </div>
                </div>
              </div>
              <div v-if="hasPhenotype.orphanet">
                <AssayTitle
                  anchor="orpha"
                  title="Orphanet"
                  icon="fas fa-bars"
                  :dblink="'https://www.orpha.net/consor/cgi-bin/Disease_Genes_Simple.php?lng=EN&Disease_Disease_Genes_diseaseGroup=' 
                    + geneName + '&Disease_Disease_Genes_diseaseType=Gen'"
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
                            :href="'https://www.orpha.net/consor/cgi-bin/OC_Exp.php?lng=en&Expert='+ props.row.id"
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
                          <ExpandableRow :elements="props.row.prev_type" preview_items="3"></ExpandableRow>
                        </b-table-column>

                        <b-table-column field="disorder" label="Disorder">{{props.row.disorder}}</b-table-column>
                      </template>
                    </b-table>
                  </div>
                </div>
              </div>
            </section>

            <div class="is-divider" v-if="hasClinicalInterest.any"></div>

            <section class="section is-paddingless" v-if="hasClinicalInterest.any">
              <h1 class="title">Clinical Interest</h1>

              <div v-if="hasClinicalInterest.invitae">
                <AssayTitle
                  anchor="invitae"
                  title="Invitae Panels"
                  icon="fas fa-bars"
                  :dblink="'https://www.invitae.com/search?q='+ geneName"
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

              <div v-if="hasClinicalInterest.ambry">
                <AssayTitle
                  anchor="ambry"
                  title="Ambry Panels"
                  icon="fas fa-bars"
                  :dblink="'https://www.ambrygen.com/#search/'+ geneName"
                  reflink="/about#ambry"
                ></AssayTitle>
                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list">
                    <b-table
                      :data="ambryData"
                      narrowed
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                    >
                      <template slot-scope="props">
                        <b-table-column field="id" label="Test ID">
                          <a
                            :href="'https://www.ambrygen.com' + props.row.link"
                            target="_blank"
                          >{{props.row.id}}</a>
                        </b-table-column>

                        <b-table-column field="name" label="Test Name">{{props.row.name}}</b-table-column>
                      </template>
                    </b-table>
                  </div>
                </div>
              </div>

              <div v-if="hasClinicalInterest.genedx">
                <AssayTitle
                  anchor="genedx"
                  title="GeneDx Panels"
                  icon="fas fa-bars"
                  :dblink="'https://www.genedx.com/?s=' + geneName + '&t=all'"
                  reflink="/about#genedx"
                ></AssayTitle>
                <div class="content">
                  <div class="card has-table-padding in-paragraph in-list">
                    <b-table
                      :data="genedxData"
                      narrowed
                      paginated
                      per-page="10"
                      pagination-simple
                      hoverable
                    >
                      <template slot-scope="props">
                        <b-table-column field="id" label="Test ID">
                          <a :href="props.row.link" target="_blank">{{props.row.id}}</a>
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
import GenomeCRISPRView from "@/components/GenomeCRISPRView.vue";
import CytoscapeView from "@/components/CytoscapeView.vue";
import ClinvarView from "@/components/ClinvarView.vue";
import ErrorView from "@/components/ErrorView.vue";
import flattenDeep from "lodash/flattenDeep";
import { SyncLoader } from "@saeris/vue-spinners";

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
            createElement("b-icon", { props: { icon: "far fa-file-alt" } })
          ])
        ]
      );
    }
  }
};

// Declare reference badge
const LinkBadge = {
  props: ["reflink", "label"],
  render: function(createElement) {
    return this.constructElement(this.reflink, this.label, createElement);
  },
  methods: {
    constructElement: function(reflink, label, createElement) {
      if (!(Array.isArray(reflink) && Array.isArray(label))) {
        reflink = [reflink];
        label = [label];
      }

      const inner = reflink.map((e, i) => {
        const icon = [
          createElement("b-icon", { props: { icon: "fas fa-database" } })
        ];

        if (label[i]) icon.push(createElement("span", label[i]));

        return createElement(
          "a",
          { attrs: { href: e, target: "_blank", style: "margin-right: 5px;" } },
          [createElement("b-tag", icon)]
        );
      });
      return createElement(
        "div",
        { attrs: { style: "display: inline" } },
        inner
      );
    }
  }
};

// Declare assay title as a little in-line component as it is not going to be used by another component/view
const AssayTitle = {
  props: ["title", "icon", "anchor", "dblink", "dblabel", "reflink"],
  render() {
    let linkBadge = undefined;
    if (this.dblink) {
      linkBadge = (
        <LinkBadge
          reflink={this.dblink}
          label={this.dblabel}
          style="vertical-align: super;"
        />
      );
    }

    return (
      <div class="block" style="margin-top:1.5rem">
        <div class="is-hidden-mobile is-inline">
          <b-icon size="is-medium" icon={this.icon} /> &nbsp;&nbsp;
        </div>
        <span
          id={this.anchor}
          class="is-size-4 is-anchor"
          style="vertical-align: text-bottom;"
        >
          {this.title} &nbsp;
        </span>
        <b-tooltip
          style="display:initial;"
          type="is-light"
          position="is-bottom"
          label="Visit source database(s)"
        >
          {linkBadge}
        </b-tooltip>
        <b-tooltip
          style="display:initial;"
          type="is-light"
          position="is-bottom"
          label="Reference"
        >
          <RefBadge reflink={this.reflink} style="vertical-align: super;" />
        </b-tooltip>
      </div>
    );
  }
};

function initialState() {
  return {
    hash: "",
    isExpandDetail: false,
    isLoading: true,
    loadingTranscriptsStatus: 0,
    showErrorComponent: false,
    showTranscripts: false,
    errorResponse: undefined,
    isFloat: false,
    description: "",
    entrezID: "",
    ensemblID: "",
    uniprotID: [],
    omimID: undefined,
    aaLength: {},
    lastUpdate: "",
    transcriptList: [],
    alias: [],
    alias_description: [],
    hasAssay: {},
    hasPhenotype: {},
    hasClinicalInterest: {},
    orthologyData: [],
    orthologDbAvailable: [
      "S. cerevisiae",
      "S. pombe",
      "M. musculus",
      "D. melanogaster",
      "C. elegans",
      "R. norvegicus",
      "D. rerio"
    ],
    huri: [],
    showCytoscapeView: false,
    mavedbData: [],
    genomeRNAiTotalEntries: 0,
    genomeRNAiData: [],
    genomeCRISPRData: [],
    genomeCRISPRStats: {},
    ogeeData: [],
    ogeeStudy: [],
    overexprData: [],
    clinvarData: {},
    variantStats: [],
    omimPhenotype: [],
    cancerGeneCensusPhenotype: [],
    pharmgkbData: {},
    orphanetData: [],
    invitaeData: [],
    ambryData: [],
    genedxData: [],
  };
}
export default {
  name: "gene-details",
  components: {
    Header,
    ExpandableRow,
    AssayTitle,
    GenomeCRISPRView,
    CytoscapeView,
    ClinvarView,
    ErrorView,
    SyncLoader
  },
  beforeMount() {
    // Capture the hash before it's overwritten by vue-scrollactive
    this.hash = window.location.hash;
  },
  beforeRouteUpdate(to, from, next) {
    this.resetData();
    this.loadData(to.params.name);
    next();
  },
  mounted() {
    // Update highlighted navbar item
    this.$emit("updateNav", "search");

    this.loadData(this.geneName);
  },
  data() {
    return initialState();
  },
  computed: {
    geneName: function() {
      let name = this.$route.params.name;
      // Handle C*orf* gene name
      // TODO: fix this properly
      if (!/C\d*orf\d*/g.test(name)) {
        name = name.toUpperCase();
      }
      return name;
    }
  },
  methods: {
    resetData() {
      Object.assign(this.$data, initialState());
    },
    loadData(gene) {
      // Display loading animation
      const loadingComponent = this.$buefy.loading.open();

      // Get detail info
      this.$http
        .get(this.$apiEntryPoint + "/detail/" + gene)
        .then(
          response => {
            // Make sure the response has a non-empty body
            if (
              !Object.prototype.hasOwnProperty.call(response, "body") ||
              typeof response.body == "string"
            )
              return;
            const json = response.body;

            // Populate basic information
            this.description = json.description;
            this.entrezID = json.entrez_id;
            this.ensemblID = json.ensembl_id;
            this.uniprotID = json.uniprot_id;
            this.aaLength = json.aa_length;
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
            if (Object.prototype.hasOwnProperty.call(json, "mavedb")) {
              this.hasAssay.any = true;
              this.hasAssay.mavedb = true;
              this.mavedbData = json.mavedb.experiments;
            }

            if (Object.prototype.hasOwnProperty.call(json, "genome_rnai")) {
              this.hasAssay.any = true;
              this.hasAssay.genome_rnai = true;
              this.genomeRNAiData = json.genome_rnai.hits;
              this.genomeRNAiTotalEntries = json.genome_rnai.total_entries;
            }

            if (Object.prototype.hasOwnProperty.call(json, "genome_crispr")) {
              this.hasAssay.any = true;
              this.hasAssay.genome_crispr = true;
              this.genomeCRISPRData = json.genome_crispr;
              this.genomeCRISPRStats = json.genome_crispr_stats;
            }

            if (Object.prototype.hasOwnProperty.call(json, "ogee_gene")) {
              this.hasAssay.any = true;
              this.hasAssay.ogee = true;
              this.ogeeData = json.ogee_gene;
              this.ogeeStudy = json.ogee_study;
            }

            if (Object.prototype.hasOwnProperty.call(json, "orthology")) {
              this.hasAssay.any = true;
              this.hasAssay.orthology = true;
              this.orthologyData = json.orthology;
            }

            if (Object.prototype.hasOwnProperty.call(json, "overexpression")) {
              // Over Expression
              this.hasAssay.any = true;
              this.hasAssay.overexpression = true;
              this.overexprData = json.overexpression;
            }

            if (Object.prototype.hasOwnProperty.call(json, "huri")) {
              // Human Interactome
              this.hasAssay.any = true;
              this.hasAssay.huri = true;
              this.huriData = json.huri;
            }

            if (Object.prototype.hasOwnProperty.call(json, "omim")) {
              // OMIM Phenotype
              this.hasPhenotype.any = true;
              this.hasPhenotype.omim = true;
              this.omimPhenotype = json.omim.records;
              this.omimID = json.omim.omim_id;
            }

            if (Object.prototype.hasOwnProperty.call(json, "clinvar")) {
              // Clinvar Phenotype
              this.hasPhenotype.any = true;
              this.hasPhenotype.clinvar = true;
              this.clinvarData = json.clinvar;
            }

            if (Object.prototype.hasOwnProperty.call(json, "cancer_census")) {
              // Cancer Census Phenotype
              this.hasPhenotype.any = true;
              this.hasPhenotype.cancer_census = true;
              this.cancerGeneCensusPhenotype = json.cancer_census;
            }

            if (Object.prototype.hasOwnProperty.call(json, "pharmgkb")) {
              // PharmGKB
              this.hasPhenotype.any = true;
              this.hasPhenotype.pharmgkb = true;
              this.pharmgkbData = json.pharmgkb;
            }
            if (Object.prototype.hasOwnProperty.call(json, "orphanet")) {
              // Orphanet Phenotype
              this.hasPhenotype.any = true;
              this.hasPhenotype.orphanet = true;
              this.orphanetData = json.orphanet;
            }

            if (Object.prototype.hasOwnProperty.call(json, "invitae")) {
              // Invitiae Panel
              this.hasClinicalInterest.any = true;
              this.hasClinicalInterest.invitae = true;
              this.invitaeData = json.invitae;
            }

            if (Object.prototype.hasOwnProperty.call(json, "ambry")) {
              // Ambry Panel
              this.hasClinicalInterest.any = true;
              this.hasClinicalInterest.ambry = true;
              this.ambryData = json.ambry;
            }

            if (Object.prototype.hasOwnProperty.call(json, "genedx")) {
              // GeneDx Panel
              this.hasClinicalInterest.any = true;
              this.hasClinicalInterest.genedx = true;
              this.genedxData = json.genedx;
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

          // Scroll to element if set by hash
          if (this.hash !== "") {
            const element = document.getElementById(this.hash.replace("#", ""));
            if (element) this.$refs.scrollactive.scrollTo(element);
          }
        });
    },
    showCytoscape() {
      this.showCytoscapeView = true;
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
    flatten(list) {
      return flattenDeep(list.filter(e => e != "NA" && e != undefined));
    },
    parseComplementation(comp) {
      switch (comp) {
        case "NA":
          return "Data not available";
        case "conflicting":
          return "Conflicting evidence";
        default:
          return comp;
      }
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
    bioTypeSort(a, b, isAsc) {
      // Priority lower to higher
      const priority = [
        "retained_intron",
        "processed_transcript",
        "protein_coding"
      ];

      const biotypeA = a.biotype;
      const biotypeB = b.biotype;
      const indA = priority.indexOf(biotypeA);
      const indB = priority.indexOf(biotypeB);

      if (indA === -1 && indB === -1) {
        // None was in the priority list
        // Just do a normal string comparison
        return isAsc
          ? biotypeA.localeCompare(biotypeB)
          : biotypeB.localeCompare(biotypeA);
      } else {
        // If one in the priority list
        // Rank based on priority
        return isAsc ? indA - indB : indB - indA;
      }
    },
    lengthAaSort(a, b, isAsc) {
      const lenA = a.peptide_length;
      const lenB = b.peptide_length;

      if (lenA === "NA") return 1;
      if (lenB === "NA") return -1;

      return isAsc ? lenA - lenB : lenB - lenA;
    },
    queryEnsembl() {
      if (this.showErrorComponent) return;
      if (!this.ensemblID) return;
      if (this.transcriptList.length > 0) return;

      this.loadingTranscriptsStatus = 1;

      // Get Ensembl Data
      this.$http
        .get(
          "https://rest.ensembl.org/lookup/id/" +
            this.ensemblID +
            "?expand=1;content-type=application/json"
        )
        .then(
          res => {
            const json = res.body;

            if (Object.prototype.hasOwnProperty.call(json, "Transcript")) {
              // Populate transcripts database
              for (const entity of json.Transcript) {
                const newEntry = {
                  id: entity.id,
                  name: entity.display_name,
                  biotype: entity.biotype,
                  num_exons: entity.Exon.length,
                  peptide_id: entity.Translation ? entity.Translation.id : "NA",
                  peptide_length: entity.Translation
                    ? entity.Translation.length
                    : "NA"
                };

                // Make sure canonical entry always goes to the front
                if (entity.is_canonical) {
                  this.transcriptList.unshift(newEntry);
                } else {
                  this.transcriptList.push(newEntry);
                }
              }
            }
          },
          () => {
            // Error handling
            this.loadingTranscriptsStatus = -1;
          }
        );
    }
  }
};
</script>

<style scoped>
.float {
  position: sticky;
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
.omim-phenotype {
  margin-left: 0.5rem;
  margin-bottom: 0.75rem;
}
.item-border {
  padding: 0.5rem;
  border-style: solid;
  border-width: 1px;
  border-color: hsl(0, 0%, 86%);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
.gene-card-description-adaptive {
  margin-left: 1rem;
}
/* Adaptive styling */
@media all and (max-width: 768px) {
  .gene-card-adaptive {
    padding-bottom: 0px;
  }
  .gene-card-description-adaptive {
    margin-left: 0rem;
  }
  .gene-summary {
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  .clinvar-stats-adaptive {
    margin-top: -40px !important;
    margin-bottom: -60px !important;
  }
  .is-expanded {
    display: block !important;
  }
}
</style>
