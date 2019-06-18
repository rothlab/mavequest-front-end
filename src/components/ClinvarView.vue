<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Clinvar Variant Summary</p>
    </header>
    <div class="card-content clinvar-stats clinvar-stats-adaptive">
      <apexchart type="bar" height="140px" :options="variantSumChartOptions" :series="variantStats"></apexchart>
      <div v-if="this.clinvarData.all_variants.others > 0" class="has-text-grey-light" style="position:relative; top:-2rem; float:right">
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
      <p class="card-header-title">(Likely) Pathogenic Variants</p>
    </header>
    <div class="card-content">
      <div v-if="pathoVariants.length > 0 || hasZoomedIn" class="pathogenic-stats pathogenic-stats-adaptive">
        <apexchart
          type="scatter"
          height="200px"
          :options="pathogenicDistriChartOptions"
          :series="pathogenicDistriData"
        ></apexchart>
        <span 
          class="has-text-grey-light" 
          style="position:relative; top:-2rem; float:right"
        >
          <b-icon pack="fas" icon="lightbulb" size="is-small"></b-icon>
          <span v-if="!hasZoomedIn"> Select a region to zoom in</span>
          <span v-else> Click 
            <b-icon pack="fas" icon="home" size="is-small"></b-icon>
            to reset zoom</span>
        </span>
      </div>

      <div v-if="pathoVariants.length > 0 || hasZoomedIn" class="clinvar-table">
        <b-table
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
        >
          <template slot="bottom-left">
            <b-tag size="is-medium" style="margin-right: 5px;"
              type="is-info" v-if="hasZoomedIn"
            >Limited to Selected SNVs</b-tag>
            Click&nbsp;
            <b-icon pack="fas" type="is-link" size="is-small" icon="chevron-right"></b-icon>&nbsp;to Show Phenotypes
          </template>

          <template slot-scope="props">
            <b-table-column field="id" label="Clinvar ID">
              <a
                :href="'https://www.ncbi.nlm.nih.gov/clinvar/variation/'+ props.row.id"
                target="_blank"
              >{{props.row.id}}</a>
            </b-table-column>

            <b-table-column class="is-capitalized" field="name" label="Name">
              <span style="word-break: break-all;">{{props.row.name}}</span>
            </b-table-column>

            <b-table-column field="review_star" label="Review Status" sortable>
              <b-tooltip
                class="is-capitalized"
                type="is-dark"
                :label="props.row.review_stats"
                multilined
                size="is-small"
                :position="isMobile ? 'is-left' : 'is-top'"
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

            <b-table-column field="count" label="Count">{{props.row.count}}</b-table-column>

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
                  v-for="p in splitInChunk(props.row.phenotype, 2, 1)"
                  v-bind:key="p"
                >{{p}}</p>
              </div>
              <div class="column">
                <p
                  class="is-marginless is-capitalized"
                  v-for="p in splitInChunk(props.row.phenotype, 2, 2)"
                  v-bind:key="p"
                >{{p}}</p>
              </div>
            </div>
          </template>
        </b-table>
      </div>
      <div v-else class="has-text-centered">No (Likely) pathogenic variants available.</div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import ExpandableRow from "@/components/ExpandableRow.vue";
import chunk from "lodash/chunk";

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
      isMobile: window.innerWidth < 768,
      hasZoomedIn: false,
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
        stroke: { curve: 'straight' },
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
                title: {offsetY: -10}
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
            text: "Nucleotide Position",
            style: { fontSize: "16px" }
          },
          tooltip: { enabled: false }
        },
        yaxis: {
          title: {
            text: "# SNVs",
            style: { fontSize: "16px" },
          },
        },
        tooltip: {
          x: {
            formatter: function(value) {
              return "Position " + value;
            }
          }
        }
      },
      pathoVariants: [],
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

        // Update tick Amount
        this.updateYTickAmount(Math.max(...Object.values(count)));

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
    },
  },
  mounted() {
    if (this.clinvarData.hasOwnProperty("pathogenic_variants")) {
      this.pathoVariants = this.clinvarData.pathogenic_variants;
    }
  },
  methods: {
    splitInChunk(list, total, index) {
      // Remove not provided unless there's nothing else
      let l = list.filter(e => e != "not provided");
      if (l.length < 1) l = ["not provided"];

      return chunk(l, total)[index - 1];
    },
    selectDatapoints(chartContext, { xaxis }) {
      // If zoomed out completely
      if (!xaxis.min || !xaxis.max) {
        this.pathoVariants = this.clinvarData.pathogenic_variants;
        this.hasZoomedIn = false;
        return;
      }

      // Filter variants
      this.pathoVariants = this.clinvarData.pathogenic_variants.filter(e => {
        if (!e.isSnv || !e.name) return false;
        const pos = parseInt(e.name.match(/c.\d*/)[0].substring(2));
        return pos >= xaxis.min && pos <= xaxis.max
      });
      this.hasZoomedIn = true;
    },
    updateYTickAmount(maxSnv) {
      this.pathogenicDistriChartOptions.yaxis['tickAmount'] = maxSnv;
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
    margin-top: -30px !important;
    margin-left: -30px !important;
    margin-right: -25px !important;
    margin-bottom: -20px !important;
  }
}
</style>
