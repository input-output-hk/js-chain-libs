import React from 'react';

import './mainSection.scss';

const MainSection = props => {
  const { children } = props;
  return <div className="mainSection">{children}</div>;
};

export default MainSection;
