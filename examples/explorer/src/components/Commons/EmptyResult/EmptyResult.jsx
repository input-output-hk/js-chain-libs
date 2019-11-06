import React from 'react';

import './emptyResult.scss';

// TODO: improve this component
const EmptyResult = ({ entityName }) => (
  <div className="emptyResult">
    <h4>We couldn&apos;t find the {entityName} you are looking for :(</h4>
  </div>
);

export default EmptyResult;
