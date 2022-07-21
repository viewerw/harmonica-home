<template>
  <div class="container">
    <div class="cu-list menu card-menu margin-top flex-center">
      <div
        class="cu-item solid-bottom arrow text-df"
        v-for="song in list"
        :key="song._id"
        @click="navPractice(song._id)"
      >
        {{ song.title }}
      </div>
    </div>
  </div>
</template>

<script>
import db from "@/utils";

export default {
  data() {
    return {
      list: [],
    };
  },

  methods: {
    navPractice(id) {
      wx.navigateTo({
        url: `/pages/practice/index?id=${id}`,
      });
    },
  },

  async mounted() {
    const { data } = await db.collection("practice-song").get();
    this.list = data;
  },
};
</script>

<style lang="scss" scoped></style>
