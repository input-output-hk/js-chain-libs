import React from 'react';
import Moment from 'react-moment';
import { relativeToAbsolute } from '../../../helpers/datetimeHelper';

/**
 * Shows a Timestamp as a date
 * @param relative Defines if the timestamp is relative to
 * genesis block or absolute.
 */
const DateTime = ({ timestamp, relative }) => {
  let finalTimestamp = timestamp;

  if (relative) {
    finalTimestamp = relativeToAbsolute(timestamp);
  }

  return (
    <Moment unix format="MMMM D, YYYY HH:mm:ss">
      {finalTimestamp}
    </Moment>
  );
};

export default DateTime;
