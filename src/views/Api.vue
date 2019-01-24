<template>
  <div class="api">
    <!-- Header -->
    <Header title="MaveQuest API"></Header>

    <!-- Main -->
    <UnderConstructionView />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import UnderConstructionView from "@/components/UnderConstructionView.vue";

export default {
  name: "api",
  components: {
    Header,
    UnderConstructionView
  },
  mounted() {
    // Update highlighted navbar item
    this.$emit('updateNav', 'api');
  }
};
</script>
