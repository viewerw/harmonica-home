<template>
  <view class="controls">
    <view class="setting" @click="clickSetting()">
      <img src="/static/setting.png" />
      <text>设置</text>
    </view>
    <view class="play-status">
      <img v-if="isPlaying" @click="pause()" src="/static/pause.png" />
      <img v-else @click="play()" src="/static/play.png" />
    </view>
    <view class="toggle-mode" @click="toggleMode">
      <view v-if="mode === 0" class="song mode">
        <img src="/static/song.png" />
        <text>整首</text>
      </view>
      <view v-else-if="mode === 1" class="paragraph mode">
        <img src="/static/paragraph.png" />
        <text>段落</text>
      </view>
      <view v-else class="sentence mode">
        <img src="/static/sentence.png" />
        <text>单句</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  emits: ["play", "pause", "clickSetting", "toggleMode"],
  props: {
    mode: {
      type: Number,
      default: 0,
    },
    isPlaying: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    play() {
      this.$emit("play");
    },
    pause() {
      this.$emit("pause");
    },
    clickSetting() {
      this.$emit("clickSetting");
    },
    toggleMode() {
      this.$emit("toggleMode");
    },
  },
};
</script>

<style lang="scss">
.controls {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px 30px;
  height: 100px;
  background: transparent;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  .setting {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 20px;
      height: 20px;
      margin-bottom: 5px;
    }
    text {
      font-size: 14px;
      color: #fff;
    }
  }
  .play-status {
    width: 50px;
    height: 50px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .mode {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
      width: 20px;
      height: 20px;
      margin-bottom: 3px;
    }
    text {
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
