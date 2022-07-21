if (!wx.cloud) {
  console.error("请使用 2.2.3 或以上的基础库以使用云能力");
} else {
  wx.cloud.init({
    env: "production-emhx9",
    traceUser: true,
  });
}
const db = wx.cloud.database();
export const toast = (title, icon = "none") =>
  wx.showToast({
    icon,
    title,
  });
export const showLoading = (title = "", mask = true) =>
  wx.showLoading({
    mask,
    title,
  });
export const hideLoading = () => wx.hideLoading();
export const uuidv4 = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    // eslint-disable-next-line
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
export const _ = db.command;
export default db;

export const requestAnimationFrame = (callback) => {
  setTimeout(callback, 16.7);
};

export const processParagPitchWithIndex = (parag) => {
  const ret = [];
  let temp = [];
  let index = 0;
  for (let i = 0; i < parag.length; i++) {
    temp = [];
    for (let j = 0; j < parag[i].length; j++) {
      temp.push(`${parag[i][j]}-${index}`);
      index++;
    }
    ret.push(temp);
  }
  return ret;
};
// flatten arrays
export const flatten = (arr) => {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
};

export const getBarIndexInParagByPitchIndex = (parag, pitchIndex) => {
  let index = 0;
  for (let i = 0; i < parag.length; i++) {
    for (let j = 0; j < parag[i].length; j++) {
      if (+parag[i][j].split("-")[1] === pitchIndex) {
        return index;
      }
    }
    index++;
  }
  return -1;
};
