<template>
    <v-container>
      <v-btn @click="dialog = true" icon outlined>
        <v-icon>{{ selectedIcon || 'mdi-water' }}</v-icon>
      </v-btn>
  
      <v-dialog v-model="dialog" max-width="400px" scrollable>
        <v-card>
          <v-card-title>
            <span class="headline">Selecionar ícone</span>
            <v-spacer />
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
  
          <v-card-text
            ref="scrollArea"
            style="height: 300px; overflow-y: auto"
            @scroll.passive="handleScroll"
          >
            <div style="position: sticky; top: 0; z-index: 1; background: white;">
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Procurar"
                    variant="plain"
                />
            </div>
  
            <v-container>
              <v-row>
                <v-col
                  v-for="icon in visibleIcons"
                  :key="icon"
                  cols="2"
                  class="text-center"
                >
                  <v-btn icon @click="selectIcon(icon)">
                    <v-icon :class="{ 'blue--text': selectedIcon === icon }">{{ icon }}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
  
            <v-row justify="center" v-if="loadingMore">
              <v-progress-circular indeterminate color="primary" />
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import * as mdiIcons from '@mdi/js';
  
  export default {
    data() {
      return {
        dialog: false,
        search: '',
        selectedIcon: '',
        allIcons: [],
        filteredIcons: [],
        visibleIcons: [],
        currentIndex: 0,
        pageSize: 30,
        loadingMore: false,
      };
    },
    watch: {
      search() {
        this.resetScroll();
      },
      dialog(val) {
        if (val) {
          this.resetScroll();
        }
      }
    },
    created() {
      this.allIcons = Object.keys(mdiIcons)
        .filter(key => key.startsWith('mdi'))
        .map(key => key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase());
    },
    methods: {
      resetScroll() {
        this.filteredIcons = this.allIcons.filter(icon =>
          icon.includes(this.search.toLowerCase())
        );
        this.currentIndex = 0;
        this.visibleIcons = [];
        this.loadMore();
      },
      loadMore() {
        if (this.loadingMore) return;
        this.loadingMore = true;
  
        const nextBatch = this.filteredIcons.slice(
          this.currentIndex,
          this.currentIndex + this.pageSize
        );
  
        this.visibleIcons = this.visibleIcons.concat(nextBatch);
        this.currentIndex += this.pageSize;
        this.loadingMore = false;
      },
      handleScroll() {
        const container = this.$refs.scrollArea;
        if (!container) return;
  
        const nearBottom =
          container.scrollTop + container.clientHeight >= container.scrollHeight - 10;
  
        if (nearBottom && this.currentIndex < this.filteredIcons.length) {
          this.loadMore();
        }
      },
      selectIcon(icon) {
        this.selectedIcon = icon;
        this.dialog = false;
      }
    }
  };
  </script>
  