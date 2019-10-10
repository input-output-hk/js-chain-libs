import React from 'react';
import { navigate } from '@reach/router';
import Button from 'react-bootstrap/Button';

import './nextPrev.scss';

const NextPrev = ({ baseUrl, prev, next }) => {
  const previousUrl = baseUrl + prev;
  const nextUrl = baseUrl + next;

  return (
    <div className="nextPrevContainer">
      <Button variant="outline-primary" disabled={!prev} onClick={() => navigate(previousUrl)}>
        Previous
      </Button>
      <Button variant="outline-primary" disabled={!next} onClick={() => navigate(nextUrl)}>
        Next
      </Button>
    </div>
  );
};

export default NextPrev;
