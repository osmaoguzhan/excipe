export const exclude = (obj, keys) => {
  keys.forEach((key) => {
    delete obj[key];
  });
  return obj;
};
