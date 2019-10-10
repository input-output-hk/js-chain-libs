// This function will only return the chainLengths
// not the full block objects
export const getNextPrev = epoch => {
  const prev = havePrevious(epoch) && Number(epoch.id) - 1;
  const next = haveNext(epoch) && Number(epoch.id) + 1;

  return { prev, next };
};

// FIXME: should have some logic to really know if
// there are next epoch or not.
export const haveNext = epoch => {
  return true;
};

export const havePrevious = epoch => {
  return epoch.id !== '0';
};
