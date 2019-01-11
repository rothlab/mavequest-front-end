<template>
  <div id="holder">
    <cytoscape :key="'cyKey()'" :config="config" :preConfig="preConfig" :afterCreated="afterCreated"/>
  </div>
</template>

<script>
import config from '@/assets/dummy-cytoscape-config'
import CyObj from '@/assets/cy-object'
// import jquery from 'jquery'
// import contextMenus from 'cytoscape-context-menus'
import cxtmenu from 'cytoscape-cxtmenu'

export default {
  name: 'CytoscopeView',
  data () {
    return {
      config: config,
      i: 0
    }
  },
  methods: {
    preConfig (cytoscape) {
      // contextMenus(cytoscape, jquery)
      // cytoscape.use(cxtmenu)
    },
    afterCreated (cy) {
    //   let menu = cy.cxtmenu({
    //     selector: 'core',
    //     commands: [
    //       {
    //         content: 'bg1',
    //         select () {
    //         }
    //       },
    //       {
    //         content: 'bg2',
    //         select () {
    //         }
    //       }
    //     ]
    //   })
      // demo your core ext
      /* cy.contextMenus({
        menuItems: [
          {
            id: 'remove',
            content: 'remove',
            tooltipText: 'remove',
            image: {src: 'remove.svg', width: 12, height: 12, x: 6, y: 4},
            selector: 'node, edge',
            onClickFunction: function (event) {
              var target = event.target || event.cyTarget
              target.remove()
            },
            hasTrailingDivider: true
          },
          {
            id: 'hide',
            content: 'hide',
            tooltipText: 'hide',
            selector: '*',
            onClickFunction: function (event) {
              var target = event.target || event.cyTarget
              target.hide()
            },
            disabled: false
          }
        ]
      }) */
    },
    cyKey () {
      const that = this
      CyObj.reset()
      CyObj.instance.then(cy => {
        cy.on('tap', event => {
          that.i++
        })
      })
      return 'cy' + this.i
    }
  }
}
</script>

<style>
#holder {
  width: 80%;
  height: 400px;
}
</style>