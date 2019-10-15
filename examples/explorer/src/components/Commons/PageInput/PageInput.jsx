import React from 'react';
import Form from 'react-bootstrap/Form';

import './pageInput.scss';

// TODO: improve this component
const PageInput = ({ value, max, onPageChange }) => {
  const onChange = event => onPageChange(event.target.value);

  return (
    <div className="pageInput">
      <Form.Control type="number" {...{ value, max, onChange }} />
    </div>
  );
};

export default PageInput;
