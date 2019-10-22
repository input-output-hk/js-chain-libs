import React, { useState } from 'react';
import { Pagination } from 'antd';
import { TABLE_PAGE_SIZE } from '../../../helpers/constants';
import './cursorPagination.scss';

/**
 * This component is useful to emulate cursor-based pagination with Antd,
 * which is not meant to manage this type of pagination.
 * It maintains current page and can go forward and backward through pages.
 */
const CursorPagination = ({ onNextPage, onPreviousPage, total, startAtEnd = false }) => {
  const initialPage = startAtEnd ? Math.ceil(total / TABLE_PAGE_SIZE) : 1;
  const [current, setCurrent] = useState(initialPage);

  const onChange = page => {
    if (page < current) {
      setCurrent(page);
      onPreviousPage(page);
    } else {
      setCurrent(page);
      onNextPage(page);
    }
  };

  return (
    <div className="cursorPagination">
      <Pagination {...{ current, total, onChange, pageSize: TABLE_PAGE_SIZE }} />
    </div>
  );
};

export default CursorPagination;
