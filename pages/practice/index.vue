<template>
  <view class="container">
    <uni-nav-bar
      dark
      :fixed="true"
      :shadow="false"
      :border="false"
      background-color="transparent"
      status-bar
      left-icon="left"
      left-text="返回"
      title="练习模式"
      @clickLeft="back"
    />
    <img src="/static/bg1.png" class="bg" />
    <harmonica :currentPitch="currentPitch" />
    <scroll-view
      v-if="mode === 0"
      scroll-y="true"
      :scroll-into-view="`bar-${currentBarIndex ? currentBarIndex - 1 : 0}`"
      scroll-with-animation
      enhanced
      show-scrollbar
      class="song-note-wrp"
    >
      <view class="parag">
        <view
          class="bar"
          :class="{ active: j === currentBarIndex }"
          :key="j"
          :id="`bar-${j}`"
          v-for="(bar, j) in songPitch"
        >
          <text
            class="pitch"
            :class="{
              active: _pitch.split('-')[1] == pitchIndex,
            }"
            :key="k"
            v-for="(_pitch, k) in bar"
            >{{ _pitch.split("-")[0] }}</text
          >
        </view>
      </view>
    </scroll-view>
    <scroll-view
      v-else
      id="parag-scroll-view"
      scroll-y="true"
      :scroll-into-view="`parag-${currentParagIndex}-bar-${
        currentBarIndex ? currentBarIndex - 1 : 0
      }`"
      scroll-with-animation
      enhanced
      show-scrollbar
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      class="song-note-wrp"
    >
      <view
        class="parag"
        :class="{ active: activeParagIndex === i }"
        :key="i"
        v-for="(para, i) in songPitch"
        @click="handleClickParag(i)"
      >
        <view
          v-if="activeParagIndex === i"
          @click="playParag(i)"
          class="play-parag-btn"
        >
          <img src="/static/play-sm.png"
        /></view>

        <view
          class="bar"
          :id="`parag-${i}-bar-${j}`"
          :class="{ active: currentParagIndex === i && currentBarIndex === j }"
          :key="j"
          v-for="(bar, j) in para"
        >
          <text
            class="pitch"
            :class="{
              active:
                _pitch.split('-')[1] == pitchIndex && currentParagIndex === i,
            }"
            :key="k"
            v-for="(_pitch, k) in bar"
            >{{ _pitch.split("-")[0] }}</text
          >
        </view>
      </view>
    </scroll-view>
    <controls
      :isPlaying="isPlaying"
      :mode="mode"
      @play="play"
      @pause="pause"
      @clickSetting="handleClickSetting()"
      @toggleMode="toggleMode()"
    />
    <uni-popup ref="popup" type="bottom" background-color="#fff">
      <view class="setting-list">
        <view class="setting-item">
          <text class="setting-item-title">播放速度</text>
          <view class="setting-item-value">
            <uni-number-box v-model="bpm" :min="20" :max="200" />
            <text class="des">bpm</text>
          </view>
        </view>
        <view class="setting-item">
          <text class="setting-item-title">升降调性</text>
          <view class="setting-item-value">
            <uni-number-box v-model="toneDiff" :min="-12" :max="12" />
            <text class="des">{{ toneName }}</text>
          </view>
        </view>
        <view class="setting-item">
          <text class="setting-item-title">替代音</text>
          <view class="setting-item-value">
            <uni-data-checkbox
              multiple
              v-model="replaceNoteValue"
              :localdata="replaceNotes"
            ></uni-data-checkbox>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {
  processParagPitchWithIndex,
  flatten,
  getBarIndexInParagByPitchIndex,
} from "../../utils";
import { NOTE_MAP, PITCH_ARR, TONE } from "../../utils/constants";

let queue = [];
const player = new global.WebAudioFontPlayer();
const ticker = new global.WebAudioFontTicker();
const instr = global._tone_0220_Aspirin_sf2_file;

export default {
  data() {
    return {
      audioContext: wx.createWebAudioContext(),
      bpm: 75,
      pieceLen: 0,
      currentPitch: "",
      pitchIndex: 0,
      toneBase: 6,
      toneDiff: 0,
      tone: 6,
      mode: 0,
      currentParagIndex: 0,
      activeParagIndex: -1,
      backScrollTimer: null,
      isPlaying: false,
      isAfterToggleMode: false,
      replaceNoteValue: [],
      replaceNotes: [
        { value: 0, text: "用#3代替4" },
        { value: 1, text: "用#7代替1" },
      ],
      songNotes: [
        [
          "2(3/16)1(1/16)2(3/16)1(1/16)2(1/8)3(1/8)5(1/8)3(1/8)",
          "2(3/16)1(1/16)2(3/16)1(1/16)2(1/16)3(1/16)2(1/16)1(1/16)(5)(1/4)",
          "2(3/16)1(1/16)2(3/16)1(1/16)2(1/8)3(1/8)5(1/8)3(1/8)",
          "2(3/16)3(1/16)2(1/8)1(1/16)2(1/16)2(1/4)0(1/4)",
          "2(3/16)1(1/16)2(3/16)1(1/16)2(1/8)3(1/8)5(1/8)3(1/8)",
          "2(3/16)3(1/16)2(1/8)1(1/16)(6)(1/16)(6)(1/8)0(1/8)",
          "3(1/16)2(1/16)1(1/16)2(1/16)1(1/8)0(1/8)",
          "3(1/16)2(1/16)1(1/16)2(1/16)1(3/16)",
          "(5)(1/16)3(1/16)2(1/16)1(1/16)2(1/16)1(1/4)0(1/4)",
        ],
        [
          "0(1/8)1(1/8)2(1/8)3(1/8)1(1/8)",
          "6(1/8)5(1/16)6(3/16)0(1/16)1(1/16)7(1/8)6(1/16)7(3/16)",
          "0(1/8)7(1/8)6(1/16)7(3/16)3(1/8)[1](1/16)[2](1/16)[1](1/16)7(1/16)6(1/8)",
          "5(1/8)6(1/8)[3](1/16)[3](3/16)5(1/8)6(1/8)[3](1/16)[3](3/16)5(1/16)6(1/16)6(13/16)",
        ],
        [
          "[1](1/8)[2](1/8)[3](1/8)[6](1/16)[5](3/16)[6](1/16)[5](3/16)[6](1/16)[5](3/16)[2](1/16)",
          "[3](3/16)[6](1/16)[5](3/16)[6](1/16)[5](3/16)[6](1/16)[5](3/16)[2](1/16)[3](1/16)",
          "[2](1/8)[1](1/16)6(3/16)[1](1/16)[1](1/16)[2](1/8)[1](1/16)6(3/16)[1](3/16)[3](5/16)[4](1/16)[3](1/16)[2](1/16)[3](1/16)[2](3/16)",
          "[1](1/8)[2](1/8)[3](1/8)[6](1/16)[5](3/16)[6](1/16)[5](3/16)[6](1/16)[5](3/16)[2](1/16)",
          "[3](3/16)[6](1/16)[5](3/16)[6](1/16)[5](3/16)[6](1/16)[5](3/16)[3](3/16)",
          "[2](1/8)[1](1/16)6(1/8)[3](3/16)[2](1/8)[1](1/16)6(1/8)[1](3/16)[1](3/4)",
          "6(1/16)[3](3/16)[2](1/8)[1](1/16)6(1/8)[3](3/16)[2](1/8)[1](1/16)6(1/8)[1](3/16)[1](16/16)",
        ],
      ],
    };
  },
  computed: {
    N() {
      return (4 * 60) / this.bpm;
    },
    beatLen() {
      return (1 / 16) * this.N;
    },
    toneName() {
      return TONE[this.tone + 12];
    },
    numberNote() {
      if (this.mode === 0) {
        return flatten(this.songNotes).join("");
      } else if (this.mode === 1) {
        return this.songNotes[this.currentParagIndex].join("");
      } else {
        return flatten(this.songNotes)[this.currentParagIndex];
      }
    },
    currentBarIndex() {
      if (this.mode === 0) {
        return getBarIndexInParagByPitchIndex(this.songPitch, this.pitchIndex);
      } else if (this.mode === 1) {
        return getBarIndexInParagByPitchIndex(
          this.songPitch[this.currentParagIndex],
          this.pitchIndex
        );
      } else {
        return 0;
      }
    },
    isReplaceFa() {
      return this.replaceNoteValue.includes(0);
    },
    isReplaceDo() {
      return this.replaceNoteValue.includes(1);
    },
    songPitch() {
      if (this.mode === 0) {
        return processParagPitchWithIndex(
          flatten(this.songNotes).map((bar) =>
            bar
              .replace(/0/g, "")
              .split(/\(\d+\/\d+\)/)
              .filter(Boolean)
              .map((pitch) =>
                this.genReplaceNote(
                  PITCH_ARR[
                    PITCH_ARR.indexOf(this.normalizeReplaceNote(pitch)) +
                      this.tone -
                      12
                  ]
                )
              )
          )
        );
      } else if (this.mode === 1) {
        return this.songNotes.map((para) =>
          processParagPitchWithIndex(
            para.map((bar) =>
              bar
                .replace(/0/g, "")
                .split(/\(\d+\/\d+\)/)
                .filter(Boolean)
                .map((pitch) =>
                  this.genReplaceNote(
                    PITCH_ARR[
                      PITCH_ARR.indexOf(this.normalizeReplaceNote(pitch)) +
                        this.tone -
                        12
                    ]
                  )
                )
            )
          )
        );
      } else {
        return flatten(this.songNotes)
          .map((bar) => [bar])
          .map((para) =>
            processParagPitchWithIndex(
              para.map((bar) =>
                bar
                  .replace(/0/g, "")
                  .split(/\(\d+\/\d+\)/)
                  .filter(Boolean)
                  .map((pitch) =>
                    this.genReplaceNote(
                      PITCH_ARR[
                        PITCH_ARR.indexOf(this.normalizeReplaceNote(pitch)) +
                          this.tone -
                          12
                      ]
                    )
                  )
              )
            )
          );
      }
    },
  },
  onLoad() {
    this.gainMaster = this.audioContext.createGain();
    this.gainMaster.connect(this.audioContext.destination);
    this.gainMaster.gain.value = 0.7;

    player.adjustPreset(this.audioContext, instr);

    this.processNumberNote(this.numberNote);
  },
  watch: {
    bpm() {
      this.pause();
      this.processNumberNote(this.numberNote);
    },
    toneDiff(newValue) {
      this.tone = newValue + this.toneBase;
    },
    tone() {
      this.pause();
      this.processNumberNote(this.numberNote);
    },
    mode() {
      clearTimeout(this.backScrollTimer);
      this.pause();
      this.currentParagIndex = 0;
      this.pitchIndex = 0;
      this.processNumberNote(this.numberNote);
    },
  },
  methods: {
    back() {},
    master(pitch, duration) {
      if (pitch === 0) return null;
      return {
        gain: this.gainMaster,
        preset: instr,
        pitch: pitch + this.tone,
        duration: duration * this.N,
      };
    },
    pause() {
      this.isPlaying = false;
      ticker.cancel();
    },
    onPlayNote(pitch, index) {
      this.pitchIndex = index;
      this.currentPitch = this.genReplaceNote(PITCH_ARR[pitch - 60]);
    },
    handleClickParag(i) {
      this.activeParagIndex = i;
    },
    playParag(paragIndex) {
      this.pause();
      this.currentParagIndex = paragIndex;
      setTimeout(() => {
        this.processNumberNote(this.numberNote);
        this.start();
      }, 100);
    },
    play() {
      if (this.isAfterToggleMode) {
        this.start();
        this.isAfterToggleMode = false;
      } else {
        this.resume();
      }
    },
    resume() {
      this.isPlaying = true;
      ticker.playLoop(
        player,
        this.audioContext,
        0,
        ticker.lastPosition,
        this.pieceLen,
        queue,
        this.onPlayNote
      );
    },
    start() {
      this.isPlaying = true;
      ticker.playLoop(
        player,
        this.audioContext,
        0,
        0,
        this.pieceLen,
        queue,
        this.onPlayNote
      );
    },
    handleClickSetting() {
      this.$refs.popup.open();
    },
    toggleMode() {
      this.isAfterToggleMode = true;
      if (this.mode === 2) {
        this.mode = 0;
      } else {
        this.mode++;
      }
    },
    onDragStart() {
      clearTimeout(this.backScrollTimer);
    },
    onDragEnd() {
      clearTimeout(this.backScrollTimer);
      this.backScrollTimer = setTimeout(() => {
        wx.createSelectorQuery()
          .select("#parag-scroll-view")
          .node()
          .exec((res) => {
            const scrollView = res[0].node;
            scrollView.scrollIntoView(
              `#parag-${this.currentParagIndex}-bar-${
                this.currentBarIndex ? this.currentBarIndex - 1 : 0
              }`
            );
          });
      }, 4000);
    },
    normalizeReplaceNote(note) {
      return note.replace(/#3/g, "4").replace(/#7/g, "1");
    },
    genReplaceNote(note) {
      let newNote = note;
      if (this.isReplaceFa) {
        if (["(4)", "4", "[4]"].includes(newNote)) {
          newNote = newNote.replace(/4/g, "#3");
        }
      }
      if (this.isReplaceDo) {
        if (newNote === "(1)") {
          newNote = "((#7))";
        } else if (newNote === "1") {
          newNote = "(#7)";
        } else if (newNote === "[1]") {
          newNote = "#7";
        }
      }
      return newNote;
    },
    processNumberNote(numberNotes) {
      queue = [];
      const notes = [];
      const re =
        /([[1-7]|#[1-7]|\([1-7]\)|\(#[1-7]\)|\[[1-7]\]|\[#[1-7]\]|0|-1])\((.*?)\)/gm;
      let m;
      while ((m = re.exec(numberNotes)) !== null) {
        const duration = m[2].split("/")[0] / m[2].split("/")[1];
        notes.push([this.master(NOTE_MAP[m[1]], duration)]);
        const emptyHolderLength = duration / (1 / 16) - 1;
        for (let i = 0; i < emptyHolderLength; i++) {
          notes.push([]);
        }
      }
      this.pieceLen = notes.length * this.beatLen;
      for (let n = 0; n < notes.length; n++) {
        const beat = notes[n];
        for (let i = 0; i < beat.length; i++) {
          if (beat[i]) {
            queue.push({
              destination: beat[i].gain,
              preset: beat[i].preset,
              when: n * this.beatLen,
              pitch: beat[i].pitch,
              duration: beat[i].duration,
              volume: 0.75,
              slides: [],
            });
          }
        }
      }
    },
  },
};
</script>

<style lang="scss">
.container {
  font-size: 14px;
  line-height: 24px;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(30px);
    z-index: -1;
  }
  .setting-list {
    padding: 10px 0;
    .setting-item {
      display: flex;
      align-items: center;
      padding: 10px;
      .setting-item-title {
        font-size: 14px;
        width: 100px;
      }
      .setting-item-value {
        display: flex;
        align-items: center;
        .des {
          margin-left: 5px;
        }
      }
    }
  }
}

.song-note-wrp {
  height: 50vh;
  margin-top: 20px;
  color: rgba(245, 235, 235, 0.896);
  .parag {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 0 15px;
    &.active {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .play-parag-btn {
      position: absolute;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      padding: 6px 10px;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .bar {
    padding: 5px 0;
    text-align: center;
    &.active {
      color: #f8ec03;
    }
  }
  .pitch {
    font-size: 14px;
    margin: 0 3px;
    &.active {
      color: #191364;
    }
  }
}
</style>
