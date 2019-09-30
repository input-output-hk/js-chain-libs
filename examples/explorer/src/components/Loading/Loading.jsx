import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

import './loading.scss';

const Loading = () => (
  <div className="Loading">
    <Spinner animation="border" variant="dark" />
  </div>
);

export default Loading;
