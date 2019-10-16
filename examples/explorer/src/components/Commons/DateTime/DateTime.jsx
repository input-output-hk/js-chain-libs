import React from 'react';
import Moment from 'react-moment';

const DateTime = ({ timestamp }) => {
  return (
    <Moment unix format="MMMM D, YYYY HH:mm:ss">
      {timestamp}
    </Moment>
  );
};

export default DateTime;
