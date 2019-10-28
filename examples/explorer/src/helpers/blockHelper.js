import fetchQuery from '../graphql/fetchQuery';
import { LastBlockQuery } from '../graphql/queries';

// For now, if the value consists of numbers we consider it a possible blockNumber
// as the probability of a hash being formed only by numbers is pretty low
export const isBlockNumber = searchValue => {
  return /^\d+$/.test(searchValue);
};

// This function will only return the chainLengths
// not the full block objects
export const getNextPrev = async block => {
  const prev = havePrevious(block) ? Number(block.chainLength) - 1 : null;
  const next = (await haveNext(block)) ? Number(block.chainLength) + 1 : null;

  return { prev, next };
};

// FIXME: should have some logic to really know if
// there are next epoch or not.
export const haveNext = async block => {
  const { status } = await fetchQuery(LastBlockQuery, {});
  const lastBlock = status.latestBlock;

  return !(lastBlock.chainLength === block.chainLength);
};

export const havePrevious = block => {
  return block.chainLength !== '0';
};
