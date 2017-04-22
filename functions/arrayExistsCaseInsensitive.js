module.exports = (array, string) => {
  const hasRole = array.some((role) => {
    if (role.name.toLowerCase() === string.toLowerCase()) return true;
    return false;
  });
  return hasRole;
};
