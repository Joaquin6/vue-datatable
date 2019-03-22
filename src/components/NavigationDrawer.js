<template>
    <v-list>
        <v-list-tile :value="true" v-for="(item) in items" :key="item.title">
            <v-list-tile-action>
                <v-icon light v-html="item.icon"></v-icon>
            </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
</template>
<script>
export default {
  name: 'NavigationDrawer',

  data () {
    return {
      items: [
        { icon: 'bubble_chart', title: 'Inspire' },
      ],
    };
  },
}
</script>