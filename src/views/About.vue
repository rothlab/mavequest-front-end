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
              <p class="menu-label">Acknowledgement</p>
              <ul class="menu-list">
                <li>
                  <a href="#primary-data">Primary Data Source</a>
                </li>
              </ul>
            </aside>
          </div>

          <div class="column">
            <div class="content">
              <h2 id="primary-data" class="subtitle is-anchor">Primary Data Source</h2>

              <ul class="data-source">
                <!-- TKO -->
                <li>
                  <h4 id="tko">
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
                </li>

                <!-- Genome RNAi -->
                <li>
                  <h4 id="genome-rnai" class="in-list">
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
                </li>

                <!-- Genome CRISPR -->
                <li>
                  <h4 id="genome-crispr" class="in-list">
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
                </li>

                <!-- Y2H -->
                <li>
                  <h4 id="huri" class="in-list">
                    The Human Reference Protein Interactome Mapping Project (HuRI) &nbsp;
                    <a
                      href="http://interactome.baderlab.org"
                      target="_blank"
                    >
                      <b-icon icon="external-link-alt" size="is-small"></b-icon>
                    </a>
                  </h4>

                  <p>Publication in preparation.</p>
                </li>

                <!-- Yeast Complementation -->
                <!-- OMIM -->
                <li>
                  <h4 id="omim" class="in-list">
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
                </li>

                <!-- HGMD -->
                <li>
                  <h4 id="hgmd" class="in-list">
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
                </li>

                <!-- Sanger -->
                <li>
                  <h4 id="sanger" class="in-list">
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
                </li>

                <!-- Orphanet -->
                <li>
                  <h4 id="orphanet" class="in-list">
                    Orphanet &nbsp;
                    <a href="https://www.orpha.net" target="_blank">
                      <b-icon icon="external-link-alt" size="is-small"></b-icon>
                    </a>
                  </h4>
                  <p>
                    <strong>Orphanet: an online database of rare diseases and orphan drugs.</strong>
                    Copyright, INSERM 1997.
                  </p>
                </li>
              </ul>
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
      isFloat: false
    };
  },
  mounted() {
    // Update highlighted navbar item
    this.$emit('updateNav', 'about');
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
.float {
  position: fixed;
  top: 4rem;
}
</style>

