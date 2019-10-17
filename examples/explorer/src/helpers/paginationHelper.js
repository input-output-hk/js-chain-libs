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

export const getNextPageQueryParam = connection => {
  return { after: connection.pageInfo.endCursor, first: TABLE_PAGE_SIZE };
};

export const getPreviousPageQueryParam = connection => {
  return { before: connection.pageInfo.startCursor, last: TABLE_PAGE_SIZE };
};

export const pageNumberDesc = (connection, pageSize = TABLE_PAGE_SIZE) => {
  const pageEnd = connection.pageInfo.endCursor;

  return Math.floor(Number.parseInt(pageEnd, 10) / pageSize) + 1;
};

export const pageNumberAsc = (connection, pageSize = TABLE_PAGE_SIZE) => {
  const pageStart = connection.pageInfo.startCursor;

  return Math.floor(Number.parseInt(pageStart, 10) / pageSize) + 1;
};

export const getAscPageQuery = (pageNum, totalCount, pageSize = TABLE_PAGE_SIZE) => {
  return {
    after: ((pageNum - 1) * pageSize).toString(),
    first: pageSize
  };
};

export const getDescPageQuery = (pageNum, totalCount, pageSize = TABLE_PAGE_SIZE) => {
  const offset = pageOffset(totalCount, pageSize);
  const pageEnd = pageNum * pageSize + 1;

  return {
    before: (pageEnd - offset).toString(),
    last: pageSize
  };
};
