import fetchQuery from '../graphql/fetchQuery';
import { LastEpochQuery } from '../graphql/queries';

// This function will only return the chainLengths
// not the full block objects
export const getNextPrev = async epoch => {
  const prev = havePrevious(epoch) && Number(epoch.id) - 1;
  const next = (await haveNext(epoch)) && Number(epoch.id) + 1;

  return { prev, next };
};

// FIXME: should have some logic to really know if
// there are next epoch or not.
export const haveNext = async epoch => {
  const { status } = await fetchQuery(LastEpochQuery, {});
  const lastEpoch = status.latestBlock.date.epoch;

  return !(lastEpoch.id === epoch.id);
};

export const havePrevious = epoch => {
  return epoch.id !== '0';
};
