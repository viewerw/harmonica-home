<template>
  <view class="harmonica-model">
    <view class="hole-number">
      <text :key="i" v-for="i in holesNumber" class="number">{{ i }}</text>
    </view>
    <view class="breath-type">
      <view>吹</view>
      <view>吸</view>
    </view>
    <view class="hole-grid">
      <view class="blow-holes">
        <view
          :key="i"
          class="hole"
          :class="{ active: activeHoleValue === blow }"
          v-for="(blow, i) in holes[0]"
        >
        </view>
      </view>
      <view class="draw-holes">
        <view
          :key="i"
          class="hole"
          :class="{ active: activeHoleValue === draw }"
          v-for="(draw, i) in holes[1]"
        >
        </view>
      </view>
    </view>
    <img class="model" src="/static/model.png" />
    <img
      class="switch"
      mode="heightFix"
      :src="isSwitchTap ? '/static/switch-active.png' : '/static/switch.png'"
    />
  </view>
</template>

<script>
export default {
  name: "Harmonica",
  emits: ["click"],
  props: {
    currentPitch: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      holesNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      holes: [
        [
          "(1)",
          "(3)",
          "(5)",
          "1",
          "1",
          "3",
          "5",
          "[1]",
          "[1]",
          "[3]",
          "[5]",
          "[[1]]",
        ],
        [
          "(2)",
          "(4)",
          "(6)",
          "(7)",
          "2",
          "4",
          "6",
          "7",
          "[2]",
          "[4]",
          "[6]",
          "[7]",
        ],
      ],
    };
  },
  computed: {
    activeHoleValue() {
      return this.currentPitch.replace("#", "");
    },
    isSwitchTap() {
      return this.currentPitch.match(/#/);
    },
  },
  watch: {},
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>
<style lang="scss">
.harmonica-model {
  position: relative;
  height: 60px;
  width: 300px;
  margin: 15px auto;
  .breath-type {
    position: absolute;
    top: 25px;
    left: 15px;
    font-size: 13px;
    color: #f8ec03;
    line-height: 1.5;
  }
  .hole-grid {
    position: absolute;
    top: 25px;
    left: 30px;
    width: 240px;
    height: 40px;
    .blow-holes,
    .draw-holes {
      height: 20px;
      padding: 0 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hole {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      &.active {
        background-color: #191364;
      }
    }
  }
  .hole-number {
    display: flex;
    padding: 0 32px;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #f8ec03;
    .number {
      text-align: center;
      width: 20px;
      font-weight: bold;
    }
  }
  .model {
    position: absolute;
    top: 25px;
    left: 30px;
    width: 240px;
    height: 40px;
  }
  .switch {
    position: absolute;
    top: 40px;
    left: 270px;
    height: 11px;
  }
}
</style>
