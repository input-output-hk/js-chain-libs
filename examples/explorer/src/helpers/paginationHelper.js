import { TABLE_PAGE_SIZE } from './constants';

const pageRemainder = (totalCount, pageSize) => {
  return totalCount % pageSize;
};

const pageOffset = (totalCount, pageSize) => {
  return pageSize - pageRemainder(totalCount, pageSize);
};

export const getNodeList = connection => {
  return connection.edges.map(edge => edge.node);
};

// Given a connection object, returns the query params for the next page
export const getNextPageQueryParam = connection => {
  return { after: connection.pageInfo.endCursor, first: TABLE_PAGE_SIZE };
};

// Given a connection object, returns the query params for the previous page
export const getPreviousPageQueryParam = connection => {
  return { before: connection.pageInfo.startCursor, last: TABLE_PAGE_SIZE };
};

/* FIXME: This function calculates the page number based on the endCursor of the
 * Graphql Connection object. We should not rely on the cursor for pagination
 * calculations.
 */
export const pageNumberDesc = (connection, pageSize = TABLE_PAGE_SIZE) => {
  const pageEnd = connection.pageInfo.endCursor;

  return Math.floor(Number.parseInt(pageEnd, 10) / pageSize) + 1;
};

/* FIXME: This function calculates the page the query params
 * to use in order to get an specific page. This only works
 * because the cursor is starting in zero, incremental and continous.
 * Should not be necessary when Jormungandr supports Offset-based pagination
 */
export const getDescPageQuery = (pageNum, totalCount, pageSize = TABLE_PAGE_SIZE) => {
  const offset = pageOffset(totalCount, pageSize);
  const pageEnd = pageNum * pageSize + 1;

  return {
    before: (pageEnd - offset).toString(),
    last: pageSize
  };
};
