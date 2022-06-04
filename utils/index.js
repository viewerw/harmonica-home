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
