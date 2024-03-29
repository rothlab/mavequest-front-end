<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Variant Summary</p>
      <div class="card-header-icon" v-if="downloadData.length > 0">
        <download-csv
          class="button is-outlined is-info"
          :data="downloadData"
          :name="symbol + '_clinvar.csv'">
          <b-icon pack="fas" icon="download" size="is-small"></b-icon>
          <p>Download</p>
        </download-csv>
      </div>
    </header>
    <div class="card-content clinvar-stats clinvar-stats-adaptive">
      <apexchart type="bar" height="140px" 
        :options="variantSumChartOptions" :series="variantStats"></apexchart>
      <div
        v-if="this.clinvarData.all_variants.others > 0"
        class="has-text-grey-light"
        style="position:relative; top:-2rem; float:right"
      >
        <b-tooltip
          type="is-light"
          position="is-left"
          multilined
          size="is-small"
          label="Variants don't fit in other categories."
          style="display: initial;"
        >
          <b-icon pack="fas" icon="lightbulb" size="is-small"></b-icon>
          <span> What are Others?</span>
        </b-tooltip>
      </div>
    </div>

    <header class="card-header">
      <p class="card-header-title">Single-nucleotide Variants (SNVs) Distribution</p>
      <div
        class="card-header-icon is-hidden-mobile"
        style="z-index: 10;"
        v-if="clinvarData.benign_variants || clinvarData.pathogenic_variants">
        <p style="margin-right: 0.5rem;">
          Review Status
          <a
            href="https://www.ncbi.nlm.nih.gov/clinvar/docs/review_status/"
            target="_blank"
            rel="noopener noreferrer">
            <b-icon pack="fas" size="is-small" icon="question-circle"></b-icon>
          </a>
        </p>
        <b-field>
          <b-checkbox-button
            v-for="star in reviewStars"
            :key="star"
            :native-value="star"
            type="is-info"
            v-model="selectedStars">
            {{star}}
          </b-checkbox-button>
        </b-field>
      </div>
    </header>
    <div class="card-content" v-if="pathoVariants || benignVariants">
      <div
        class="pathogenic-stats pathogenic-stats-adaptive is-hidden-mobile"
      >
        <apexchart
          type="scatter"
          class="clickable"
          height="200px"
          :options="distriChartOptions"
          :series="distriData"
        ></apexchart>
      </div>

      <div v-if="structureSeries" class="structure-chart is-hidden-mobile">
        <apexchart
          type="rangeBar"
          class="clickable"
          style="z-index: 0;"
          :height="20 * numStructure"
          :options="structureChartOptions"
          :series="structureSeries"
        ></apexchart>

        <a style="position:relative; z-index: 1;"
          href="/about#interpro"
          target="_blank"
          rel="noopener noreferrer">
          <b-tag>
            <b-icon icon="far fa-file-alt" size="is-small"></b-icon>
            <span>&nbsp;InterPro</span>
          </b-tag>
        </a>

        <a style="position:relative; z-index: 1; margin-left: 0.5rem"
          href="/about#uniprot"
          target="_blank"
          rel="noopener noreferrer">
          <b-tag>
            <b-icon icon="far fa-file-alt" size="is-small"></b-icon>
            <span>&nbsp;Uniprot</span>
          </b-tag>
        </a>
      </div>

      <p
        class="is-hidden-mobile"
        style="position:relative; top:0.5rem; text-align: center"
      >Amino Acid Position (a.a.)</p>
      
      <div class="media is-hidden-tablet is-vcentered">
        <div class="media-left">
          <b-icon pack="fas" icon="expand-arrows-alt" size="is-medium" 
            custom-class="fa-rotate-90"></b-icon>
        </div>
        <div class="level-content">
          Your device or browser window is too small for 
          this panel to display.
        </div>
      </div>
    </div>

    <div class="card-content" v-else>
      <p class="has-text-centered">No non-synonmous SNVs for this gene.</p>
    </div>

    <b-modal :active.sync="isVariantModalActive" :width="400" 
      @close="closeVariantModal">
      <div class="modal-card" style="width: auto">
        <b-message 
          :title="`ClinVar Variants at A.A. Pos ${selectedVariants.pos}`"
          aria-close-label="Close" 
          @close="closeVariantModal" type="is-info">
          <b-taglist v-for="ele in selectedVariants.data" :key="ele.id">
            <a :href="`https://www.ncbi.nlm.nih.gov/clinvar/variation/${ele.id}`" 
              target="_blank" rel="noopener noreferrer" 
              style="text-decoration: none;" class="is-fullwidth">
              <b-taglist attached>
                <b-tag class="has-background-grey has-text-white" 
                  size="is-medium" style="width: 30%">ID {{ele.id}}</b-tag>
                <b-tag type="is-light" size="is-medium" style="width: 70%">
                  <span>{{ele.hgvs}}&nbsp;&nbsp;</span>
                  <b-icon icon="external-link-alt" size="is-small"></b-icon>
                </b-tag>
              </b-taglist>
            </a>
          </b-taglist>
        </b-message>
      </div>
    </b-modal>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import uniq from "lodash/uniq";
import compact from "lodash/compact";

const presetDistriColors = {
  plp: {
    missense: '#BF0032',
    synonymous: '#FF3860',
    stop: '#ffc3cf'
  },
  blb: {
    missense: '#23D160',
    synonymous: '#65de8f',
    stop: '#007E10'
  }
};

const presetDistriSeriesNames = {
  plp: '(Likely) Pathogenic',
  blb: '(Likely) Benign',
};

export default {
  name: "clinvar-view",
  components: {
    apexchart: VueApexCharts
  },
  props: {
    symbol: String,
    clinvarData: Object,
    structureData: Object,
    aaLength: Number,
    conflictCanonical: Boolean
  },
  data() {
    return {
      isVariantModalActive: false,
      variantSumChartOptions: {
        chart: {
          stacked: true,
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        colors: ['#23D160', '#2E93fA', '#FF3860', '#DBDBDB'],
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        grid: {
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: false } }
        },
        labels: ["All Variants", "Missense Variants"],
        xaxis: { show: false },
        yaxis: {
          labels: {
            style: {
              fontSize: "16px"
            },
            maxWidth: 200
          }
        },
        tooltip: {
          x: { show: false },
          y: {
            formatter: function(value, { series, dataPointIndex }) {
              return (
                value +
                ", " +
                (
                  (value /
                    series
                      .map(e => e[dataPointIndex])
                      .reduce((t, n) => t + parseInt(n))) *
                  100
                ).toFixed(2) +
                "%"
              );
            }
          },
          theme: "light"
        },
        dataLabels: { enabled: false },
        legend: {
          onItemClick: { toggleDataSeries: true },
          position: "top",
          offsetY: 15,
          fontSize: "16px",
          showForSingleSeries: true,
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              legend: { show: false },
              labels: ["All", "Missense"]
            }
          }
        ]
      },
      distriChartOptions: {
        chart: {
          zoom: {
            enabled: true,
            type: "x",
            zoomedArea: {
              fill: {
                color: "#90CAF9",
                opacity: 0.4
              },
              stroke: {
                color: "#0D47A1",
                opacity: 0.4,
                width: 1
              }
            }
          },
          toolbar: {
            tools: {
              download: false,
              reset: '<i class="fas fa-home"></i>'
            }
          },
          events: {
            beforeZoom: this.beforeZoom,
            zoomed: this.zoomIn,
            scrolled: this.zoomIn,
            dataPointSelection: this.selectPoint
          },
          animations: {
            dynamicAnimation: { enabled: false }
          }
        },
        dataLabels: { enabled: false },
        stroke: { curve: "straight" },
        markers: {
          size: 5,
          hover: {
            size: 9
          }
        },
        colors: [],
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                toolbar: { show: false },
                zoom: { enabled: false }
              },
              xaxis: {
                title: { offsetY: -10 }
              }
            }
          }
        ],
        xaxis: {
          tickAmount: 10,
          labels: {
            formatter: function(val) {
              return parseFloat(val).toFixed(0);
            }
          },
          tooltip: { enabled: false },
          min: 0,
          max: this.aaLength
        },
        yaxis: {
          title: {
            text: "# SNVs",
            style: { fontSize: "16px" }
          },
          min: 0,
          max: 0,
          tickAmount: 0
        },
        tooltip: {
          x: {
            formatter: function(value) {
              return "<b>A.A. Pos" + value + "</b>" +
                "<br> Click to show individual variants";
            }
          },
        },
        legend: {
          showForSingleSeries: true,
          position: "top",
          fontSize: "16px",
          width: 600,
          horizontalAlign: "left",
          offsetX: 40
        }
      },
      selectedVariants: {},
      selectedStars: [],
      structureChartOptions: {
        chart: {
          toolbar: {
            show: false,
          },
          animations: {
            dynamicAnimation: { enabled: false }
          },
          events: {
            dataPointSelection: this.selectStructure
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "100%",
            columnWidth: "0%"
          },
        },
        grid: {
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: false } },
          padding: {
            left: 40,
            right: 18,
            top: -15,
            bottom: 0
          }
        },
        xaxis: {
          type: "datetime",
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false },
          tooltip: { enabled: false },
          min: 0,
          max: this.aaLength
        },
        yaxis: {
          show: false,
          title: {
            show: false,
            text: "Structure",
            style: { fontSize: "16px" }
          },
          floating: true
        },
        legend: {
          show: true,
          position: "top",
          fontSize: "16px",
        },
        tooltip: {
          x: {
            formatter: function(value) {
              return value + 'a.a.';
            }
          },
        },
      },
    };
  },
  computed: {
    variantStats: function() {
      // Compute variant summary
      if (
        Object.prototype.hasOwnProperty.call(
          this.clinvarData,
          "all_variants"
        ) &&
        Object.prototype.hasOwnProperty.call(
          this.clinvarData,
          "missense_variants"
        )
      ) {
        return [
          {
            name: "(Likely) Benign",
            data: [
              this.clinvarData.all_variants.likely_benign + 
                this.clinvarData.all_variants.benign,
              this.clinvarData.missense_variants.likely_benign +
                this.clinvarData.missense_variants.benign
            ]
          },
          {
            name: "Uncertain",
            data: [
              this.clinvarData.all_variants.uncertain,
              this.clinvarData.missense_variants.uncertain
            ]
          },
          {
            name: "(Likely) Pathogenic",
            data: [
              this.clinvarData.all_variants.likely_pathogenic +
                this.clinvarData.all_variants.pathogenic,
              this.clinvarData.missense_variants.likely_pathogenic +
                this.clinvarData.missense_variants.pathogenic
            ]
          },
          {
            name: "Others",
            data: [
              this.clinvarData.all_variants.others,
              this.clinvarData.missense_variants.others
            ]
          }
        ];
      }
      return [];
    },
    pathoVariants: function() {
      if (
        Object.prototype.hasOwnProperty.call(
          this.clinvarData,
          "pathogenic_variants"
        )
      ) {
        const ret = this.parseVariants(this.clinvarData.pathogenic_variants);
        if (ret.missense || ret.synonymous) {
          return ret
        }
        return undefined;
      }
      return undefined;
    },
    benignVariants: function() {
      if (
        Object.prototype.hasOwnProperty.call(
          this.clinvarData,
          "benign_variants"
        )
      ) {
        const ret = this.parseVariants(this.clinvarData.benign_variants);
        if (ret.missense || ret.synonymous) {
          return ret
        }
        return undefined;
      }
      return undefined;
    },
    distriData: function() {
      return this.formatDistriData(this.pathoVariants, "plp")
        .concat(this.formatDistriData(this.benignVariants, "blb"));
    },
    downloadData: function() {
      return Array.prototype.concat(
        this.addCategory(this.clinvarData.benign_variants, 'benign'), 
        this.addCategory(this.clinvarData.pathogenic_variants, 'pathogenic')
        )
    },
    reviewStars: function() {
      if (this.clinvarData.benign_variants || 
        this.clinvarData.pathogenic_variants) {
        let stars = Array.prototype.concat(this.clinvarData.benign_variants, 
          this.clinvarData.pathogenic_variants);
        stars = compact(stars).filter(e => e.isSnv).map(e => e.review_star);

        return uniq(stars).sort()
      } else {
        return []
      }
    },
    structureSeries: function() {
      if (this.structureData && this.structureData.entries.length > 0) {
        let series = [];
        
        for (const entry of this.structureData.entries) {
          // Parse entry fragments
          const fragments = entry.fragments.map(fragment => {
            return {
              x: entry.entry_name,
              y: [fragment.pos_start, fragment.pos_end],
              acc: entry.entry_acc
            }
          });

          // Format entry type
          entry.entry_type = entry.entry_type.split('_')
          .map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(' ');

          // Append the entry to its category
          // If the category doesn't exist, create one
          const index = series.findIndex(element => 
            element.name == entry.entry_type);
          if (index < 0) {
            series.push({
              name: entry.entry_type,
              data: fragments
            })
          } else {
            series[index].data = series[index].data.concat(fragments)
          }
        }

        return series;
      }

      return undefined;
    },
    numStructure: function() {
      if (this.structureData && this.structureData.entries) {
        return this.structureData.entries.length;
      }

      return 0;
    }
  },
  mounted () {
    this.selectedStars = this.reviewStars;
  },
  methods: {
    parseVariants(vars) {
      // Deep copy objects
      const varList = vars
        .filter(e => e.isSnv && e.name && e.name.match(/p.\D*\d*/) 
          && this.selectedStars.includes(e.review_star))
        .map(e => {
          let res = Object.assign({}, e);
          res.pos = parseInt(e.name.match(/p.\D*\d*/)[0].match(/\d+/)[0]);
          res.isSyn = !(e.name.match(/p.\D*\d*=/) === null);
          res.isNonsense = !(e.name.match(/p.\D*\d*(Ter|\*)/) === null);
          return res;
        });

      const misVarList = varList.filter(e => !e.isNonsense && !e.isSyn);
      const synVarList = varList.filter(e => e.isSyn);
      const nonVarList = varList.filter(e => e.isNonsense);

      return {
        missense:
          misVarList.length > 0
            ? this.summarizeVariants(misVarList)
            : undefined,
        synonymous:
          synVarList.length > 0 
          ? this.summarizeVariants(synVarList) 
          : undefined,
        stop:
          nonVarList.length > 0 
          ? this.summarizeVariants(nonVarList)
          : undefined
      };
    },
    formatDistriData(vars, type) {
      let series = [];

      if (!vars) return series;

      if (vars.missense) {
        series.push({
          name: presetDistriSeriesNames[type] + " Missense",
          data: Object.entries(vars.missense).map(e => {
            return [parseInt(e[0]), e[1].count];
          })
        });
        this.distriChartOptions.colors.push(presetDistriColors[type].missense);
      }

      if (vars.synonymous) {
        series.push({
          name: presetDistriSeriesNames[type] + " Synonymous",
          data: Object.entries(vars.synonymous).map(e => {
            return [parseInt(e[0]), e[1].count];
          })
        });
        this.distriChartOptions.colors.push(presetDistriColors[type].synonymous);
      }

      if (vars.stop) {
        series.push({
          name: presetDistriSeriesNames[type] + " Stop",
          data: Object.entries(vars.stop).map(e => {
            return [parseInt(e[0]), e[1].count];
          })
        });
        this.distriChartOptions.colors.push(presetDistriColors[type].stop);
      }

      return series;
    },
    summarizeVariants(varList) {
      const count = varList.reduce((acc, val) => {
        if (!acc[val.pos]) {
          acc[val.pos] = {
            count: 0,
            ids: [],
            names: []
          };
        }
        acc[val.pos].count += 1;
        acc[val.pos].ids.push(val.id);
        acc[val.pos].names.push(val.name);

        return acc;
      }, {});

      // Update count
      const maxCount = 
        Math.max(...Object.values(count).map(e => e.count).filter(Number));
      if (this.distriChartOptions.yaxis.max < maxCount) {
        this.distriChartOptions.yaxis.max = maxCount;

        if (maxCount > 4) {
          this.distriChartOptions.yaxis.tickAmount = (maxCount % 2) + 4;
        } else {
          this.distriChartOptions.yaxis.tickAmount = maxCount;
        } 
      }
      return count;
    },
    beforeZoom(chartContext, { xaxis }) {
      return {
        xaxis: {
          min: xaxis.min < 0 ? 0 : xaxis.min,
          max: xaxis.max > this.aaLength ? this.aaLength : xaxis.max
        }
      };
    },
    zoomIn(chartContext, { xaxis }) {
      // Sync with secondary track plot
      // If zoomed out completely
      if (!xaxis.min || !xaxis.max) {
        this.structureChartOptions = {
          xaxis: {
            min: 0,
            max: this.aaLength
          }
        }
        return;
      }

      this.structureChartOptions = {
        xaxis: {
          min: xaxis.min,
          max: xaxis.max
        }
      }
    },
    selectPoint(event, chartContext, config) {
      // Don't respond to touchstart as another mousedown event will be fired
      if (event.type === "touchstart") return;

      const index = config.dataPointIndex;
      const series = config.seriesIndex;
      const data = this.distriData[series];
      const pos = data.data[index][0];

      // Check if pathogenic or benign
      let variants = {};
      if (data.name.toLowerCase().includes("pathogenic")) {
        if (data.name.toLowerCase().includes("missense")) {
          variants = this.pathoVariants.missense[pos];
        }

        if (data.name.toLowerCase().includes("synonymous")) {
          variants = this.pathoVariants.synonymous[pos];
        }

        if (data.name.toLowerCase().includes("stop")) {
          variants = this.pathoVariants.stop[pos];
        }
      }

      if (data.name.toLowerCase().includes("benign")) {
        if (data.name.toLowerCase().includes("missense")) {
          variants = this.benignVariants.missense[pos];
        }

        if (data.name.toLowerCase().includes("synonymous")) {
          variants = this.benignVariants.synonymous[pos];
        }

        if (data.name.toLowerCase().includes("stop")) {
          variants = this.benignVariants.stop[pos];
        }
      }

      this.isVariantModalActive = true;
      this.selectedVariants = {
        pos: pos,
        data: variants.ids.map((e, i) => {
          return {
            id: e,
            hgvs: variants.names[i]
          }
        })
      }
    },
    selectStructure (event, chartContext, config) {
      // Don't respond to touchstart as another mousedown event will be fired
      if (event.type === "touchstart") return;

      // Get Interpro Accession
      const seriesIndex = config.seriesIndex;
      const dataPointIndex = config.dataPointIndex;
      const data = this.structureSeries[seriesIndex].data[dataPointIndex];

      if (data.acc) {
        // If data point has accession, open it in Interpro
        // Open the detail page on InterPro
        const url = 'https://www.ebi.ac.uk/interpro/entry/InterPro/' + data.acc;
        window.open(url, "_blank");
      }
    },
    closeVariantModal () {
      this.isVariantModalActive = false;
      this.selectedVariants = {};
    },
    addCategory: function(list, category) {
      if (!list) {
        return []
      }

      return list.map(e => {
        e['category'] = category;
        return e;
      })
    },
  }
};
</script>
<style>
.clickable .apexcharts-series {
  cursor: pointer;
}
</style>
<style scoped>
.clinvar-stats {
  overflow: hidden;
  margin-top: -30px;
  margin-bottom: -50px;
  z-index: 1;
}
.pathogenic-stats {
  display: contents;
  overflow: hidden;
  margin-top: -10px;
  margin-left: -25px;
  z-index: 1;
}
.structure-chart {
  margin-top: -10px;
  margin-bottom: -30px;
}
.clinvar-table {
  position: relative;
  z-index: 2;
}
@media all and (max-width: 768px) {
  .clinvar-stats-adaptive {
    margin-top: -40px !important;
    margin-bottom: -60px !important;
    margin-left: -20px !important;
    margin-right: -10px !important;
  }
  .pathogenic-stats-adaptive {
    margin-top: -10px !important;
    margin-left: -40px !important;
    margin-right: -25px !important;
    margin-bottom: -20px !important;
  }
}
</style>
