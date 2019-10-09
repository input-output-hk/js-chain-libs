import React from 'react';

import { QueryRenderer } from 'react-relay';
import environment from '../../graphql/environment';
import Loading from '../Commons/Loading/Loading';
import ErrorResult from '../Commons/ErrorResult/ErrorResult';

const QueryWrapper = (WrappedComponent, query, propsConverter) => variables => {
  // Using no conversion if propsConverter is not defined
  const transform = propsConverter || (props => props);

  return (
    <QueryRenderer
      environment={environment}
      {...{ environment, query, variables }}
      render={response => {
        const { error, props } = response;
        if (error) {
          return <ErrorResult />;
        }
        if (!props) {
          return <Loading />;
        }
        const finalProps = transform(props);
        return <WrappedComponent {...finalProps} />;
      }}
    />
  );
};

export default QueryWrapper;
