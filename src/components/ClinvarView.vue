<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Clinvar Variant Summary</p>
    </header>
    <div class="card-content clinvar-stats clinvar-stats-adaptive">
      <apexchart type="bar" height="140px" :options="variantSumChartOptions" :series="variantStats"></apexchart>
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
      <p class="card-header-title">Non-synonymous SNV Distributions</p>
    </header>
    <div class="card-content" v-if="pathoVariants || benignVariants">
      <div
        class="pathogenic-stats pathogenic-stats-adaptive"
      >
        <apexchart
          type="scatter"
          height="200px"
          :options="distriChartOptions"
          :series="distriData"
        ></apexchart>
      </div>

      <span
          class="has-text-grey-light is-hidden-mobile"
          style="position:relative; top:-2rem; float:right"
        >
          <b-icon pack="fas" icon="lightbulb" size="is-small"></b-icon>
          <span v-if="!hasZoomedIn"> Select a region to zoom in</span>
          <span v-else>
            Click
            <b-icon pack="fas" icon="home" size="is-small"></b-icon> to reset zoom
          </span>
        </span>
    </div>

    <div class="card-content" v-else>
      <p class="has-text-centered">No non-synonmous SNVs for this gene.</p>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "clinvar-view",
  components: {
    apexchart: VueApexCharts
  },
  props: {
    clinvarData: Object,
    aaLength: Number
  },
  data() {
    return {
      isMobile: window.innerWidth < 768,
      hasZoomedIn: 0,
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
          onItemClick: { toggleDataSeries: false },
          position: "top",
          offsetY: 15,
          fontSize: "16px"
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
            zoomed: this.selectDatapoints
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
          title: {
            text: "Amino Acid Position (a.a.)",
            style: { fontSize: "16px" }
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
              return "A.A. Pos " + value;
            }
          }
        },
        legend: {
          showForSingleSeries: true,
          position: "top"
        }
      }
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
            name: "Benign",
            data: [
              this.clinvarData.all_variants.benign,
              this.clinvarData.missense_variants.benign
            ]
          },
          {
            name: "Likely Benign",
            data: [
              this.clinvarData.all_variants.likely_benign,
              this.clinvarData.missense_variants.likely_benign
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
            name: "Likely Pathogenic",
            data: [
              this.clinvarData.all_variants.likely_pathogenic,
              this.clinvarData.missense_variants.likely_pathogenic
            ]
          },
          {
            name: "Pathogenic",
            data: [
              this.clinvarData.all_variants.pathogenic,
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
        if (ret.missense || ret.stop) {
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
        if (ret.missense || ret.stop) {
          return ret
        }
        return undefined;
      }
      return undefined;
    },
    distriData: function() {
      return this.formatDistriData(this.pathoVariants, "(Likely) Pathogenic")
        .concat(this.formatDistriData(this.benignVariants, "(Likely) Benign"));
    }
  },
  methods: {
    parseVariants(vars) {
      const varList = vars
        .filter(e => e.isSnv && e.name && e.name.match(/p.\D*\d*/))
        .map(e => {
          if (e.name.match(/p.\D*\d*/)) {
            e.pos = parseInt(e.name.match(/p.\D*\d*/)[0].match(/\d+/)[0]);
            e.isNonsense = e.name.match(/p.\D*\d*=/) == true;
          }
          return e;
        });

      const misVarList = varList.filter(e => !e.isNonsense);
      const nonVarList = varList.filter(e => e.isNonsense);

      return {
        missense:
          misVarList.length > 0
            ? this.summarizeVariants(misVarList)
            : undefined,
        stop:
          nonVarList.length > 0 ? this.summarizeVariants(nonVarList) : undefined
      };
    },
    formatDistriData(vars, type) {
      let series = [];
      if (vars.missense) {
        series.push({
          name: type + " Missense",
          data: Object.entries(vars.missense).map(e => {
            return [parseInt(e[0]), e[1].count];
          })
        });
      }

      if (vars.stop) {
        series.push({
          name: type + "Stop",
          data: Object.entries(vars.stop).map(e => {
            return [parseInt(e[0]), e[1].count];
          })
        });
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
      });

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
    selectDatapoints(chartContext, { xaxis }) {
      // If zoomed out completely
      if (!xaxis.min || !xaxis.max) {
        this.hasZoomedIn = false;
        return;
      }

      this.hasZoomedIn = true;
    }
  }
};
</script>

<style scoped>
.clinvar-stats {
  overflow: hidden;
  margin-top: -30px;
  margin-bottom: -50px;
  z-index: 1;
}
.pathogenic-stats {
  overflow: hidden;
  margin-top: -10px;
  margin-left: -25px;
  z-index: 1;
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
