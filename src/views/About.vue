<template>
  <div class="about">
    <!-- Header -->
    <Header title="About MaveQuest" v-observe-visibility="visibilityChanged"></Header>

    <!-- Main -->
    <section class="section">
      <div class="container">
        <div class="columns">
          <!-- Table of content -->
          <div class="column is-3 is-hidden-mobile">
            <aside class="menu" :class="{float: isFloat}">
              <p class="menu-label">MaveQuest</p>
              <ul class="menu-list">
                <li>
                  <a href="#what-is-mavequest">What is MaveQuest?</a>
                </li>
                <li>
                  <a href="#contact-us">Contact Us</a>
                </li>
              </ul>
              <p class="menu-label">Acknowledgement</p>
              <ul class="menu-list">
                <li>
                  <a href="#primary-data">Primary Data Source</a>
                </li>
                <li>
                  <a href="#open-source">Open Source Products</a>
                </li>
              </ul>
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
              <div ref="genome-crispr" class="in-paragraph">
                <h4 class="in-list" id="genome-crispr">
                  GenomeCRISPR &nbsp;
                  <a href="http://genomecrispr.dkfz.de/" target="_blank">
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>
                <p>
                  Rauscher, B., Heigwer, F., Breinig, M., Winter, J., & Boutros, M.
                  <strong>GenomeCRISPR - a database for high-throughput CRISPR/Cas9 screens.</strong>
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

              <!-- TKO -->
              <div ref="tko" class="in-paragraph">
                <h4 class="in-list" id="tko">
                  The Toronto KnockOut Library (TKO) &nbsp;
                  <a
                    href="http://tko.ccbr.utoronto.ca/"
                    target="_blank"
                  >
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>
                <p>
                  Hart T, Tong A, Chan K, van Leeuwen J, Seetharaman A, Aregger M, Chandrashekhar M,
                  Hustedt N, Seth S, Noonan A, Habsid A, Sizova O, Nedyalkova L, Climie R, Lawson K,
                  Augusta Sartori M, Alibai S, Tieu D, Masud S, Mero P, Weiss A, Brown KR, Usaj M,
                  Billman M, Rahman M, Costanzo M, Myers CL, Andrews B, Boone C, Durocher D, Moffat J.
                  <strong>Evaluation and Design of Genome-Wide CRISPR/SpCas9 Knockout Screens.</strong>
                  <i>G3: Genes, Genomes, Genetics</i> (2017): g3-117.
                  <b-tag type="is-light">
                    <a
                      class="has-text-dark"
                      href="https://www.ncbi.nlm.nih.gov/pubmed/28655737"
                      target="_blank"
                    >PubMed</a>
                  </b-tag>
                </p>
              </div>

              <!-- Genome RNAi -->
              <div ref="genome-rnai" class="in-paragraph">
                <h4 class="in-list" id="genome-rnai">
                  GenomeRNAi &nbsp;
                  <a href="http://www.genomernai.org/" target="_blank">
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>
                <p>
                  Schmidt, E. E., Pelz, O., Buhlmann, S., Kerr, G., Horn, T., & Boutros, M.
                  <strong>GenomeRNAi: a database for cell-based and in vivo RNAi phenotypes, 2013 update.</strong>
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

              <!-- Y2H -->
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

                <p>Publication in preparation.</p>
              </div>

              <!-- Yeast Complementation -->
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

              <!-- HGMD -->
              <div ref="hgmd" class="in-paragraph">
                <h4 class="in-list" id="hgmd">
                  The Human Gene Mutation Database (HGMD) &nbsp;
                  <a
                    href="http://www.hgmd.cf.ac.uk/"
                    target="_blank"
                  >
                    <b-icon icon="external-link-alt" size="is-small"></b-icon>
                  </a>
                </h4>
                <p>
                  Stenson, Peter D., Matthew Mort, Edward V. Ball, Katy Howells, Andrew D. Phillips, Nick ST Thomas, and David N. Cooper.
                  <strong>The human gene mutation database: 2008 update.</strong>
                  <i>Genome medicine</i> 1, no. 1 (2009): 13.
                  <b-tag type="is-light">
                    <a
                      class="has-text-dark"
                      href="https://www.ncbi.nlm.nih.gov/pubmed/12754702"
                      target="_blank"
                    >PubMed</a>
                  </b-tag>
                </p>
              </div>

              <!-- Sanger -->
              <div ref="cancer-census" class="in-paragraph">
                <h4 class="in-list" id="cancer-census">
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
      isFloat: false,
      stats: {
        total: 0,
        assay: 0,
        phenotype: 0
      }
    };
  },
  mounted() {
    // Update highlighted navbar item
    this.$emit("updateNav", "about");

    // Update database stats
    this.getDatabaseStats();

    // Scroll to the element if route has is set
    if (this.$route.hash) {
      this.scrollToElement(this.$route.hash);
    }

    // Highlight data source if given as part of the url
    const elementID = this.$route.hash.replace("#", "");
    if (this.$refs.hasOwnProperty(elementID)) {
      this.$refs[elementID].className += " highlight";
    }
  },
  methods: {
    visibilityChanged(visible) {
      // Position the table of contents absolutely so that it will stay on the screen
      this.isFloat = !visible;
    },
    scrollToElement(element) {
      const option = {
        easing: "ease-in",
        offset: -60,
        force: true,
        cancelable: true,
        x: false,
        y: true
      };
      this.$scrollTo(element, option);
    },
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
  position: fixed;
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

