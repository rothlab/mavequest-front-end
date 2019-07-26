<template>
  <div class="privacy">
    <!-- Header -->
    <Header title="Privacy Policy"></Header>

    <UnderConstruction></UnderConstruction>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"
import UnderConstruction from "@/components/UnderConstructionView.vue"

export default {
  name: "privacy",
  components: {
    Header,
    UnderConstruction
  },
  mounted() {
    // Update highlighted navbar item
    this.$emit("updateNav", "privacy");
  }
};
</script>