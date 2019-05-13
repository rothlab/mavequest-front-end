<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Clinvar Variant Summary</p>
    </header>
    <div class="card-content clinvar-stats clinvar-stats-adaptive">
      <apexchart type="bar" height="140px" :options="variantSumChartOptions" :series="variantStats"></apexchart>
      <span v-if="this.clinvarData.all_variants.others > 0" class="has-text-grey-light" style="position:relative; top:-2rem; float:right">
        <b-tooltip
          type="is-light"
          position="is-left"
          multilined
          size="is-small"
          label="Variants don't fit in other categories."
        >What are Others?</b-tooltip>
      </span>
    </div>

    <header class="card-header">
      <p class="card-header-title">Pathogenic Variants</p>
    </header>
    <div class="card-content has-table-padding">
      <apexchart
        type="area"
        height="200px"
        :options="pathogenicDistriChartOptions"
        :series="pathogenicDistriData"
      ></apexchart>

      <b-table
        v-if="pathoVariants"
        :data="pathoVariants"
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
          <b-icon pack="fas" type="is-link" size="is-small" icon="chevron-right"></b-icon>&nbsp;to Show Phenotypes
        </template>

        <template slot-scope="props">
          <b-table-column field="id" label="Clinvar ID" width="100">
            <a
              :href="'https://www.ncbi.nlm.nih.gov/clinvar/variation/'+ props.row.id"
              target="_blank"
            >{{props.row.id}}</a>
          </b-table-column>

          <b-table-column class="is-capitalized" field="name" label="Name">{{props.row.name}}</b-table-column>

          <b-table-column field="review_star" label="Review Status" sortable>
            <b-tooltip
              class="is-capitalized"
              type="is-dark"
              :label="props.row.review_stats"
              multilined
            >
              <b-icon
                pack="fas"
                icon="star"
                type="is-warning"
                v-for="n in props.row.review_star"
                v-bind:key="n"
              ></b-icon>
              <b-icon pack="far" icon="star" type="is-warning" v-if="props.row.review_star < 1"></b-icon>
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
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import ExpandableRow from "@/components/ExpandableRow.vue";

export default {
  name: "clinvar-view",
  components: {
    apexchart: VueApexCharts,
    ExpandableRow
  },
  props: {
    clinvarData: Object
  },
  data() {
    return {
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
      pathogenicDistriChartOptions: {
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
            tools: { download: false }
          },
          events: { 
            zoomed: this.selectDatapoints
          }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'straight' },
        markers: { size: 0 },
        grid: {
          padding: { right: 40 }
        },
        xaxis: {
          tickAmount: 10,
          labels: {
            formatter: function(val) {
              return parseFloat(val).toFixed(0);
            }
          },
          title: {
            text: "Nucleotide Position",
            style: { fontSize: "16px" }
          },
          tooltip: { enabled: false }
        },
        yaxis: {
          title: {
            text: "# SNVs",
            style: { fontSize: "16px" }
          }
        },
        tooltip: {
          x: {
            formatter: function(value) {
              return "Position " + value;
            }
          }
        }
      },
      pathoVariants: []
    }
  },
  computed: {
    variantStats: function() { // Compute variant summary
      if (this.clinvarData.hasOwnProperty('all_variants') 
        && this.clinvarData.hasOwnProperty('missense_variants')) {
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
    pathoVariantStats: function() {
      if (this.clinvarData.pathogenic_variants) {
        const pos = this.clinvarData.pathogenic_variants
          .filter(e => e.isMissense && e.isSnv && e.name)
          .map(e => parseInt(e.name.match(/c.\d*/)[0].substring(2)));
        const count = pos.reduce((acc, val) => {
          acc[val] = acc[val] == undefined ? 1 : (acc[val] += 1);
          return acc;
        }, {});
        return Object.entries(count).map(([key, value]) => [
          parseInt(key),
          value
        ]);
      }
      return [];
    },
    pathogenicDistriData: function() {
      return [
        {
          name: "SNVs",
          data: this.pathoVariantStats
        }
      ];
    }
  },
  mounted() {
    if (this.clinvarData.hasOwnProperty("pathogenic_variants")) {
      return this.pathoVariants = this.clinvarData.pathogenic_variants;
    }
  },
  methods: {
    toggleDisplayAll() {
      this.pathoVariants = this.clinvarData.pathogenic_variants
      this.showDisplayAll = false;
    },
    selectDatapoints(chartContext, { xaxis }) {
      // If zoomed out completely
      if (!xaxis.min || !xaxis.max) {
        this.pathoVariants = this.clinvarData.pathogenic_variants;
        chartContext.updateOptions({
          markers: { size: 0 }
        });
        return;
      }

      // Filter variants
      this.pathoVariants = this.clinvarData.pathogenic_variants.filter(e => {
        if (!e.isSnv || !e.name) return false;
        const pos = parseInt(e.name.match(/c.\d*/)[0].substring(2));
        return pos >= xaxis.min && pos <= xaxis.max
      });

      // If zoomed in enough, add dots
      if (!chartContext.options.markers) {
        chartContext.updateOptions({
          markers: {
            size: 5,
            hover: {
              size: 9
            }
          }
        });
      }
    }
  }
}
</script>

<style scoped>
.clinvar-stats {
  overflow: hidden;
  margin-top: -30px;
  margin-bottom: -50px;
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
}
</style>
