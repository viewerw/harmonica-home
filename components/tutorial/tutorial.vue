<template>
  <div class="container">
    <uni-segmented-control
      :current="active"
      :values="navs"
      @clickItem="onChange"
      styleType="text"
      activeColor="#0081ff"
    ></uni-segmented-control>

    <div
      v-show="active === 0"
      class="article solid-bottom text-lg padding-sm"
      v-for="(article, idx) in basicArticles"
      :key="article.id"
      @click="navArticle(article.id)"
    >
      {{ num[idx] }}. {{ article.title }}
    </div>

    <div
      v-show="active === 1"
      class="article solid-bottom text-lg padding-sm"
      v-for="(article, idx) in doubleArticles"
      :key="article.id"
      @click="navArticle(article.id)"
    >
      {{ num[idx] }}. {{ article.title }}
    </div>

    <div
      v-show="active === 2"
      class="article solid-bottom text-lg padding-sm"
      v-for="(article, idx) in halfArticles"
      :key="article.id"
      @click="navArticle(article.id)"
    >
      {{ num[idx] }}. {{ article.title }}
    </div>

    <div
      v-show="active === 3"
      class="article solid-bottom text-lg padding-sm"
      v-for="(article, idx) in blueArticles"
      :key="article.id"
      @click="navArticle(article.id)"
    >
      {{ num[idx] }}. {{ article.title }}
    </div>
  </div>
</template>

<script>
import db from "@/utils";

export default {
  data() {
    return {
      num: [
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
        "十三",
        "十四",
        "十五",
        "十六",
        "十七",
        "十八",
        "十九",
        "二十",
      ],
      tutorials: [],
      basicArticles: [],
      doubleArticles: [],
      halfArticles: [],
      blueArticles: [],
      active: 0,
      navs: ["基本乐理", "复音", "半音阶", "十孔"],
    };
  },

  methods: {
    async onChange(e) {
      const tabIndex = e.currentIndex;
      this.active = tabIndex;
      if (tabIndex === 1 && this.doubleArticles.length === 0) {
        const {
          data: { articles },
        } = await db
          .collection("tutorials")
          .doc("106c5c86-40e6-44ab-bed5-208d3ea7b8d0")
          .get();
        this.doubleArticles = articles;
      } else if (tabIndex === 2 && this.halfArticles.length === 0) {
        const {
          data: { articles },
        } = await db
          .collection("tutorials")
          .doc("e3bfbcd2-4fb3-4fff-81c7-4689c7d8e509")
          .get();
        this.halfArticles = articles;
      } else if (tabIndex === 3 && this.blueArticles.length === 0) {
        const {
          data: { articles },
        } = await db
          .collection("tutorials")
          .doc("29afb9a7-bc4f-4b44-b796-8b767dac1241")
          .get();
        this.blueArticles = articles;
      }
    },
    navArticle(id) {
      wx.navigateTo({
        url: `/pages/article/index?id=${id}`,
      });
    },
  },

  created() {},
  async mounted() {
    try {
      const { data } = await db
        .collection("tutorials")
        .doc("990e2b05-3804-44ba-ac25-812f5b877a68")
        .get();
      this.basicArticles = data.articles;
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  .article {
    color: #666;
  }
}
</style>
