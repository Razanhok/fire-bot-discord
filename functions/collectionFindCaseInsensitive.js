module.exports = (collection, string) => {
  return collection.find((item) => {
    if (item.name.toLowerCase() === string.toLowerCase()) {
      return true;
    }
    return false;
  });
};
