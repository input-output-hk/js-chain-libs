import React, { useState } from 'react';
import { Pagination } from 'antd';
import { TABLE_PAGE_SIZE } from '../../../helpers/constants';
import './cursorPagination.scss';

// Workaround to make Cursor based pagination work with Ant Table
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
