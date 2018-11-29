<template>
    <div class="search-bar">
        <b-field>
            <b-taginput
              size="is-medium"
              icon="search"
              placeholder="Search with Gene Symbol, Entrez ID or Ensembl ID">
            </b-taginput>
        </b-field>
    </div>
</template>

<script>
export default {
  name: 'SearchBar',
//   props: {
//     msg: String
//   }
}
</script>