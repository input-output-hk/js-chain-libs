import React from 'react';
import { navigate } from '@reach/router';
import Button from 'react-bootstrap/Button';

import './nextPrev.scss';

class NextPrev extends React.Component {
  constructor() {
    super();
    this.state = { next: undefined, prev: undefined };
  }

  async componentDidMount() {
    const { getNextPrev, element } = this.props;
    const { next, prev } = await getNextPrev(element);
    this.setState({ next, prev });
  }

  render() {
    const { next, prev } = this.state;
    const { baseUrl } = this.props;

    const previousUrl = baseUrl + prev;
    const nextUrl = baseUrl + next;
    const isFirst = prev === null;

    return (
      <div className="nextPrevContainer">
        <Button variant="outline-primary" disabled={isFirst} onClick={() => navigate(previousUrl)}>
          Previous
        </Button>
        <Button variant="outline-primary" disabled={!next} onClick={() => navigate(nextUrl)}>
          Next
        </Button>
      </div>
    );
  }
}

export default NextPrev;
