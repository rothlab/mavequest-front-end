<template>
  <div class="about">
    <!-- Header -->
    <Header title="About MaveQuest"></Header>

    <!-- Main -->
    <section class="section">
      <div class="container">
        <div class="columns">
          <!-- Table of content -->
          <div class="column is-3 is-hidden-touch">
            <aside class="menu float">
              <scrollactive ref="scrollactive" :offset="400">
                <p class="menu-label">MaveQuest</p>
                <ul class="menu-list">
                  <li>
                    <a href="#what-is-mavequest" class="scrollactive-item">What is MaveQuest?</a>
                  </li>
                  <li>
                    <a href="#contact-us" class="scrollactive-item">Contact Us</a>
                  </li>
                </ul>
                <p class="menu-label">Acknowledgement</p>
                <ul class="menu-list">
                  <li>
                    <a href="#primary-data" class="scrollactive-item">Primary Data Source</a>
                  </li>
                  <li>
                    <a href="#open-source" class="scrollactive-item">Open Source Projects</a>
                  </li>
                </ul>
              </scrollactive>
            </aside>
          </div>

          <div class="column">
            <div class="content">
              <h2 id="what-is-mavequest" class="subtitle is-anchor">What is MaveQuest?</h2>

              <img src="../assets/logo_text_web.png" alt="MaveQuest Logo" class="main-logo">
              <span>
                <p>
                  MaveQuest is an online database for querying literature-curated functional assays,
                  phenotypes and evidence of clinical interests of human genes for MAVE studies.
                </p>

                <p>MaveQuest is developed by <a href="https://kevinkuang.net" target="_blank">Kevin Kuang</a> and others at the
                  <a href="http://llama.mshri.on.ca/" target="_blank">Roth Lab</a> at the Univeristy of Toronto.
                </p>
              </span>

              <div class="in-paragraph">
                <h4 class="in-list">Features</h4>

                <ul>
                  <li>
                    Search for literature-supported functional assays and phenotypes,
                    and evidence of clinical interests of human genes.
                  </li>
                  <li>List all human genes with literature-supported functional assays and phenotypes.</li>
                </ul>
              </div>

              <div class="in-paragraph">
                <h4 class="in-list">Database Statistics</h4>
                
                <span>
                  <p v-if="false">MaveQuest database contains all annotated human genes in HGNC database (accessed on ).</p>
                  
                  <p>A breakdown of human genes in MaveQuest database is the following.</p>
                </span>

                <div class="level in-list">
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Total<br>Genes</p>
                      <p class="title">{{stats.total.toLocaleString()}}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Genes With<br>Potential Assays</p>
                      <p class="title">{{stats.assay.toLocaleString()}}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Genes With<br>Disease Phenotypes</p>
                      <p class="title">{{stats.phenotype.toLocaleString()}}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Genes With<br>Clinical Interests</p>
                      <p class="title">{{stats.clinical_interest.toLocaleString()}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="content para-spacing">
              <h2 id="contact-us" class="subtitle is-anchor">Contact Us</h2>

              <span>
                <p>We would love to hear your thoughts and feedback so we can continue to improve MaveQuest.</p>
                
                <p>Please feel free to <a href="mailto:kvn.kuang@mail.utoronto.ca">email us</a> your comments and suggestions.</p>
              </span>
            </div>

            <div class="content para-spacing">
              <h2 id="primary-data" class="subtitle is-anchor">Primary Data Source</h2>

              <!-- Genome CRISPR -->
              <div ref="genome_crispr" class="in-paragraph">
                <h4 class="in-list" id="genome_crispr">
                  GenomeCRISPR &nbsp;
                  <a href="http://genomecrispr.dkfz.de/" target="_blank">
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>
                <p>
                  Rauscher, B., Heigwer, F., Breinig, M., Winter, J., & Boutros, M.
                  <strong>GenomeCRISPR - a database for high-throughput CRISPR/Cas9 screens. </strong>
                  <i>Nucleic acids research</i> (2016): gkw997.
                  <b-tag type="is-light">
                    <a
                      class="has-text-dark"
                      href="https://www.ncbi.nlm.nih.gov/pubmed/27789686"
                      target="_blank"
                    >PubMed</a>
                  </b-tag>
                </p>
              </div>

              <!-- Genome RNAi -->
              <div ref="genome_rnai" class="in-paragraph">
                <h4 class="in-list" id="genome_rnai">
                  GenomeRNAi &nbsp;
                  <a href="http://www.genomernai.org/" target="_blank">
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>
                <p>
                  Schmidt, E. E., Pelz, O., Buhlmann, S., Kerr, G., Horn, T., & Boutros, M.
                  <strong>GenomeRNAi: a database for cell-based and in vivo RNAi phenotypes, 2013 update. </strong>
                  <i>Nucleic acids research</i> 41, no. D1 (2012): D1021-D1026.
                  <b-tag type="is-light">
                    <a
                      class="has-text-dark"
                      href="https://www.ncbi.nlm.nih.gov/pubmed/23193271"
                      target="_blank"
                    >PubMed</a>
                  </b-tag>
                </p>
              </div>

              <!-- Orthology -->
              <div ref="orthology" class="in-paragraph">
                <h4 class="in-list" id="orthology">Orthology</h4>

                <p>
                  Sonnhammer, Erik LL, and Gabriel Östlund.
                  <strong>InParanoid 8: orthology analysis between 273 proteomes, mostly eukaryotic. </strong>
                  <i>Nucleic acids research</i> 43, no. D1 (2014): D234-D239.
                  <b-tag type="is-light">
                    <a
                      class="has-text-dark"
                      href="https://www.ncbi.nlm.nih.gov/pubmed/25429972"
                      target="_blank"
                    >PubMed</a>
                  </b-tag>
                </p>

                <p>
                  Heinicke, Sven, Michael S. Livstone, Charles Lu, Rose Oughtred, Fan Kang, Samuel V. Angiuoli, Owen White, David Botstein, and Kara Dolinski.
                  <strong>The Princeton Protein Orthology Database (P-POD): a comparative genomics analysis tool for biologists. </strong>
                  <i>PloS one</i> 2, no. 8 (2007): e766.
                  <b-tag type="is-light">
                    <a
                      class="has-text-dark"
                      href="https://www.ncbi.nlm.nih.gov/pubmed/17712414"
                      target="_blank"
                    >PubMed</a>
                  </b-tag>
                </p>

                <p>
                  Howe, Douglas G., Judith A. Blake, Yvonne M. Bradford, Carol J. Bult, Brian R. Calvi, Stacia R. Engel, James A. Kadin et al.
                  <strong>Model organism data evolving in support of translational medicine. </strong>
                  <i>Lab animal</i> (2018): 1.
                  <b-tag type="is-light">
                    <a
                      class="has-text-dark"
                      href="https://www.ncbi.nlm.nih.gov/pubmed/30224793"
                      target="_blank"
                    >PubMed</a>
                  </b-tag>
                </p>
              </div>

              <!-- HuRI -->
              <div ref="huri" class="in-paragraph">
                <h4 class="in-list" id="huri">
                  The Human Reference Protein Interactome Mapping Project (HuRI) &nbsp;
                  <a
                    href="http://interactome.baderlab.org"
                    target="_blank"
                  >
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>

                <p>
                  Luck, Katja, Dae Kyum Kim, Luke Lambourne, Kerstin Spirohn, Bridget E. Begg, Wenting Bian, Ruth Brignall et al.
                  <strong>A reference map of the human protein interactome. </strong>
                  <i>bioRxiv</i> (2019): 605451.
                  <b-tag type="is-light">
                    <a
                      class="has-text-dark"
                      href="https://www.biorxiv.org/content/10.1101/605451v2"
                      target="_blank"
                    >bioRxiv</a>
                  </b-tag>
                </p>
              </div>

              <!-- Clinvar -->
              <div ref="clinvar" class="in-paragraph">
                <h4 class="in-list" id="clinvar">
                  ClinVar &nbsp;
                  <a
                    href="https://www.ncbi.nlm.nih.gov/clinvar/"
                    target="_blank"
                  >
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>
                <p>
                  Landrum, Melissa J., Jennifer M. Lee, Mark Benson, Garth Brown, Chen Chao, Shanmuga Chitipiralla, Baoshan Gu et al.
                  <strong>ClinVar: public archive of interpretations of clinically relevant variants. </strong>
                  <i>Nucleic acids research</i> 44, no. D1 (2015): D862-D868.
                  <b-tag type="is-light">
                    <a
                      class="has-text-dark"
                      href="https://www.ncbi.nlm.nih.gov/pubmed/26582918"
                      target="_blank"
                    >PubMed</a>
                  </b-tag>
                </p>
              </div>

              <!-- OMIM -->
              <div ref="omim" class="in-paragraph">
                <h4 class="in-list" id="omim">
                  Online Mendelian Inheritance in Man (OMIM) &nbsp;
                  <a
                    href="https://www.omim.org/"
                    target="_blank"
                  >
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>
                <p>
                  <strong>Online Mendelian Inheritance in Man, OMIM®.</strong> McKusick-Nathans Institute of Genetic Medicine, Johns Hopkins University (Baltimore, MD), 2019.
                </p>
              </div>

              <!-- Cancer Census -->
              <div ref="cancer_census" class="in-paragraph">
                <h4 class="in-list" id="cancer_census">
                  The Cancer Gene Census &nbsp;
                  <a
                    href="https://cancer.sanger.ac.uk/census"
                    target="_blank"
                  >
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>
                <p>
                  Forbes, Simon A., David Beare, Harry Boutselakis, Sally Bamford, Nidhi Bindal, John Tate, Charlotte G. Cole et al.
                  <strong>COSMIC: somatic cancer genetics at high-resolution.</strong>
                  <i>Nucleic acids research</i> 45, no. D1 (2016): D777-D783.
                  <b-tag type="is-light">
                    <a
                      class="has-text-dark"
                      href="https://www.ncbi.nlm.nih.gov/pubmed/27899578"
                      target="_blank"
                    >PubMed</a>
                  </b-tag>
                </p>
              </div>

              <!-- Orphanet -->
              <div ref="orphanet" class="in-paragraph">
                <h4 class="in-list" id="orphanet">
                  Orphanet &nbsp;
                  <a href="https://www.orpha.net" target="_blank">
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>
                <p>
                  <strong>Orphanet: an online database of rare diseases and orphan drugs.</strong>
                  Copyright, INSERM 1997.
                </p>
              </div>

              <!-- Invitae Panel -->
              <div ref="invitae" class="in-paragraph">
                <h4 class="in-list" id="invitae">
                  Invitae &nbsp;
                  <a
                    href="https://www.invitae.com/en/physician/panelsgenes/"
                    target="_blank"
                  >
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>
                <p>
                  <strong>Invitae.</strong>
                  Copyright, Invitae Corporation.
                </p>
              </div>
            </div>

            <div class="content">
              <h2 id="open-source" class="subtitle is-anchor">Open Source Projects & Licenses</h2>

              <span>
                <p>
                  MaveQuest is built with an array of Open Source projects. 
                  Without technologies and supports from the Open Source community, it will be extremely difficult, if possible at all, to build MaveQuest.
                </p>

                <p>
                  Specifically, MaveQuest benefits from the following major Open Source projects:
                  <ul>
                    <li><a href="https://vuejs.org/" target="_blank">Vue.js</a></li>
                    <li><a href="https://buefy.org/" target="_blank">Buefy</a> and <a href="https://bulma.io/" target="_blank">Bulma</a></li>
                    <li><a href="https://nodejs.org/" target="_blank">Node.js</a> and <a href="https://expressjs.com/" target="_blank">Express</a></li>
                  </ul>
                </p>

                <p>
                  A complete list of Open Source projects used and their licenses can be found 
                  <a href="/THIRD-PARTY-LICENSES.html" target="_blank" rel="noopener noreferrer">here</a>.
                </p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  name: "about",
  components: {
    Header
  },
  data() {
    return {
      hash: "",
      stats: {
        total: 0,
        assay: 0,
        phenotype: 0
      }
    };
  },
  beforeMount() {
    // Capture the hash before it's overwritten by vue-scrollactive
    this.hash = window.location.hash;
  },
  mounted() {
    // Update highlighted navbar item
    this.$emit("updateNav", "about");

    // Update database stats
    this.getDatabaseStats();

    // Check if scrolling needs to be handled separately
    const autoScrollItems = this.$refs.scrollactive.$data.items;
    let handleScrolling = true;
    for (const item of autoScrollItems) {
      if (item.getAttribute('href') === this.hash) {
        handleScrolling = false;
      }
    }
    if (handleScrolling) {
      // Highlight data source if given as part of the url
      const elementID = this.hash.replace("#", "");
      if (this.$refs.hasOwnProperty(elementID)) {
        this.$refs[elementID].className += " highlight";
        this.$refs.scrollactive.scrollTo(this.$refs[elementID]);
      }
    }
  },
  methods: {
    getDatabaseStats() {
      this.$http
        .get(this.$apiEntryPoint + "/stats")
        .then(response => {
          this.stats = response.body;
        });
    }
  }
};
</script>

<style scoped>
.float {
  position: sticky;
  top: 4rem;
}
.highlight {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  background: #fff2a8;
}
@media screen and (min-width: 769px) {
  .main-logo {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
  }
}
.para-spacing {
  margin-top: 3rem;
  margin-bottom: 3rem;
}
</style>