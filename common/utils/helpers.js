export const exclude = (obj, keys) => {
  keys.forEach((key) => {
    delete obj[key];
  });
  return obj;
};

export const absoluteUrl = (url) => {
  if (url.startsWith("https://") || url.startsWith("http://")) {
    return url;
  }
  return `${process.env.NEXTAUTH_URL}${url}`;
};
