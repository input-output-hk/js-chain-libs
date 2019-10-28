import React from 'react';

import './emptyResult.scss';

// TODO: improve this component
const EmptyResult = ({ entityName, id }) => (
  <div className="emptyResult">
    <h4>
      We couldn&apos;t find the {entityName} {id} you are looking for :(
    </h4>
  </div>
);

export default EmptyResult;
