<template>
  <div class="container">
    <tutorial v-if="PageCur === 'tutorial'"></tutorial>
    <score v-if="PageCur === 'score'"></score>
    <social v-if="PageCur === 'social'"></social>
    <practice-list v-if="PageCur === 'practice'"></practice-list>
    <mine v-if="PageCur === 'mine'"></mine>

    <div class="cu-bar tabbar bg-white shadow foot">
      <div
        v-if="!isReview"
        class="action"
        @click="NavChange"
        data-cur="tutorial"
      >
        <div class="cuIcon-cu-image">
          <image
            :src="
              '/static/img/tutorial-bar' +
              [PageCur == 'tutorial' ? '-active' : ''] +
              '.png'
            "
          />
        </div>
        <div :class="PageCur == 'basics' ? 'text-green' : 'text-gray'">
          教程
        </div>
      </div>
      <div v-if="!isReview" class="action" @click="NavChange" data-cur="score">
        <div class="cuIcon-cu-image">
          <image
            :src="
              '/static/img/score-bar' +
              [PageCur == 'score' ? '-active' : ''] +
              '.png'
            "
          />
        </div>
        <div :class="PageCur == 'component' ? 'text-green' : 'text-gray'">
          曲谱
        </div>
      </div>
      <div class="action" @click="NavChange" data-cur="practice">
        <div class="cuIcon-cu-image">
          <image
            :src="
              '/static/img/social-bar' +
              [PageCur == 'practice' ? '-active' : ''] +
              '.png'
            "
          />
        </div>
        <div :class="PageCur == 'plugin' ? 'text-green' : 'text-gray'">
          吹奏练习
        </div>
      </div>
      <!-- <div v-if="!isReview" class="action" @click="NavChange" data-cur="social">
        <div class="cuIcon-cu-image">
          <image
            :src="
              '/static/img/social-bar' +
              [PageCur == 'social' ? '-active' : ''] +
              '.png'
            "
          />
        </div>
        <div :class="PageCur == 'plugin' ? 'text-green' : 'text-gray'">
          口琴交流
        </div>
      </div> -->
      <div class="action" @click="NavChange" data-cur="mine">
        <div class="cuIcon-cu-image">
          <image
            :src="
              '/static/img/mine-bar' +
              [PageCur == 'mine' ? '-active' : ''] +
              '.png'
            "
          />
        </div>
        <div :class="PageCur == 'plugin' ? 'text-green' : 'text-gray'">
          我的
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

const TITLE = {
  tutorial: "教程",
  score: "曲谱",
  social: "口琴交流",
  mine: "我的",
  practice: "吹奏练习",
};
export default {
  mpType: "page",

  data() {
    return {
      PageCur: "practice",
    };
  },
  computed: {
    ...mapState(["nextPage", "isReview"]),
  },
  methods: {
    NavChange(e) {
      this.PageCur = e.currentTarget.dataset.cur;
      wx.setNavigationBarTitle({
        title: TITLE[this.PageCur],
      });
    },
  },

  async mounted() {
    const { current } = this.$root.$mp.query;
    if (current) {
      this.PageCur = current;
    }

    wx.setNavigationBarTitle({
      title: TITLE[this.PageCur],
    });

    if (this.nextPage) {
      wx.navigateTo({
        url: this.nextPage,
      });
      this.setNextPage("");
    }
  },
  onPullDownRefresh() {
    if (this.PageCur === "social") {
      this.$children[0].onPullDownRefresh();
    } else {
      wx.stopPullDownRefresh();
    }
  },
  onReachBottom() {
    if (this.PageCur === "social") {
      this.$children[0].onReachBottom();
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  padding-bottom: 50px;
}
.btn {
  font-size: initial;
  text-align: initial;
  color: initial;
  margin: 0;
  padding: 0;
  background: transparent;
  overflow: visible;
  border: none;
  line-height: initial;

  &::after {
    border: none;
  }
}
</style>
