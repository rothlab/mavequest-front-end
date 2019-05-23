<template>
  <div class="card has-table-padding in-paragraph in-list">
    <b-table :data="genomeCRISPRData" paginated per-page="10" pagination-simple hoverable narrowed>
      <template slot="bottom-left">
        <!-- Only show this panel if it has screens with a lot of hits -->
        <div class="margin-bottom" 
          v-if="genomeCRISPRData.filter(e => screenWithHighHits.includes(e.source)).length > 0">
          <b-icon
            type="is-danger"
            pack="fas"
            size="is-small"
            icon="exclamation-triangle"
            class="margin-right"
          ></b-icon>
          <span>Screen reported a large number of hits</span>
        </div>

        <a
          href="http://tko.ccbr.utoronto.ca/"
          target="_blank"
          v-if="genomeCRISPRData.filter(e => tkoPubmed.includes(e.source)).length > 0"
        >
          <b-tag type="is-warning" class="margin-left-large margin-right">TKO</b-tag>
          <span>Toronto Knockout Library</span>
        </a>
      </template>

      <template slot-scope="props">
        <b-table-column field="source" label="Pubmed Source" width="200">
          <b-tooltip
            type="is-light"
            multilined
            size="is-small"
            label="Screen reported a large number of hits"
          >
            <b-icon
              type="is-danger"
              pack="fas"
              size="is-small"
              icon="exclamation-triangle"
              class="margin-right"
              @click.native="showHitsDistroModal(props.row.source)"
              v-show="screenWithHighHits.includes(props.row.source)"
            ></b-icon>
          </b-tooltip>

          <a
            :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + 
                              props.row.source"
            target="_blank"
          >
            <span>{{props.row.source}}</span>
          </a>

          <b-tag
            class="margin-right margin-left"
            type="is-warning"
            v-show="tkoPubmed.includes(props.row.source)"
          >TKO</b-tag>
        </b-table-column>

        <b-table-column field="condition" label="Condition" width="300">{{props.row.condition}}</b-table-column>

        <b-table-column field="screen" label="Screen" width="150">{{props.row.screen}}</b-table-column>

        <b-table-column field="cellline" label="Cell Lines">
          <ExpandableRow :elements="props.row.cellline" preview_items="5"></ExpandableRow>
        </b-table-column>
      </template>
    </b-table>

    <b-modal :active.sync="isModalShown">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Distribution of hits for Genome CRISPR screens</p>
        </header>

        <div class="card-content">
          <div class="content">
            <apexchart :series="statsData" :options="modalPlotOptions"></apexchart>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ExpandableRow from "@/components/ExpandableRow.vue";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "genome-crispr-view",
  components: {
    ExpandableRow,
    apexchart: VueApexCharts
  },
  props: {
    genomeCRISPRData: Array,
    genomeCRISPRStats: Object
  },
  data() {
    return {
      tkoPubmed: ["26627737", "24987113", "28655737"],
      percentCutoff: 0.7,
      isModalShown: false,
      modalScreenId: "",
      modalPlotOptions: {
        chart: {
          type: "area",
          height: 300,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        stroke: {
            curve: 'smooth'
          },
        tooltip: {
          x: { show: false }
        },
        theme: { palette: "palette1" },
        xaxis: {
          type: "numeric",
          title: { 
            text: "Percentile",
            style: { fontSize: "20px" }
            },
          min: 0,
          max: 100,
          tickAmount: 10,
          labels: {
            style: { fontSize: "16px"}
          }
        },
        yaxis: {
          min: 0,
          title: { 
            text: "Number of Hits",
            style: { fontSize: "20px" }
            },
          labels: {
            style: { fontSize: "16px"}
          }
        },
        annotations: {
          xaxis: [{ 
            x: 70,
            x2: 100,
            strokeDashArray: 0,
            label: { 
              text: "High hit count",
              orientation: 'horizontal',
              borderWidth: 0,
              position: "top",
              textAnchor: 'right',
              style: { fontSize: "20px" },
              offsetY: -5
              },
            }]
        }
      }
    };
  },
  computed: {
    screenWithHighHits: function() {
      // Get screens that passed the percentile cut off
      const screens = Object.entries(this.genomeCRISPRStats)
        .filter(e => {
          // Get the percentile of each screen's hit count
          const rank = this.percentRank(
            Object.values(this.genomeCRISPRStats),
            e[1]
          );
          return rank >= this.percentCutoff;
        })
        .map(e => e[0]);

      return screens;
    },
    statsData: function() {
      const array = Object.values(this.genomeCRISPRStats).map(Number);
      const percentile = Array.from({length: 100}, (v, k) => k + 1)
        .map(e => this.getPercentile(array, e));

      return [
        {
          name: "Hits",
          data: percentile
        }
      ];
    }
  },
  methods: {
    // Credit: @scottyli on Github
    // Found on gist: https://gist.github.com/IceCreamYou/6ffa1b18c4c8f6aeaad2
    percentRank(array, n) {
      var L = 0;
      var S = 0;
      var N = array.length;

      for (var i = 0; i < array.length; i++) {
        if (array[i] < n) {
          L += 1;
        } else if (array[i] === n) {
          S += 1;
        }
      }

      var pct = (L + 0.5 * S) / N;
      return pct;
    },
    getPercentile(array, percentile) {
      if (percentile < 1 || percentile > 100) return undefined;

      array.sort((a, b) => a - b);
      const len = array.length;
      const index = Math.floor(len * percentile / 100);

      return array[index === len ? index - 1: index];
    },
    showHitsDistroModal(id) {
      this.isModalShown = true;
      this.modalScreenId = id;
      // Add annotation
      const hits = this.genomeCRISPRStats[id];
      const rank = Math.round(this.percentRank(Object.values(this.genomeCRISPRStats), hits) * 100);
      this.modalPlotOptions.annotations['points'] = [{
        x: rank,
        y: hits,
        marker: {
          size: 6,
          fillColor: '#fff',
          strokeColor: 'red',
          radius: 2,
        },
        label: { text: undefined }
      }];
    }
  }
};
</script>

<style scoped>
.margin-right {
  margin-right: 5px;
}
.margin-left {
  margin-left: 5px;
}
@media all and (min-width: 769px) {
  .margin-left-large {
    margin-left: 20px;
  }
}
@media all and (max-width: 769px) {
  .margin-bottom {
    margin-bottom: 5px;
  }
}
</style>
