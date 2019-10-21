import React, { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
import Button from 'react-bootstrap/Button';

import './nextPrev.scss';

const NextPrev = ({ baseUrl, element, getNextPrev }) => {
  const [{ next, prev }, setNextPrev] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await getNextPrev(element);
      setNextPrev(result);
    };
    fetchData();
  });

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
