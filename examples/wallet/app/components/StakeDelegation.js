// @flow
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import type { PoolId } from '../models';
import typeof { sendStakeDelegation as SendStakeDelegation } from '../actions/account';
import StakePoolList from '../containers/StakePoolList';

type Props = {
  sendStakeDelegation: SendStakeDelegation
};

export default ({ sendStakeDelegation }: Props) => {
  const [poolId, setPoolId] = useState<PoolId>('');

  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    sendStakeDelegation(poolId);
  };

  return (
    <Container>
      <Row>
        <StakePoolList onSelection={setPoolId} />
      </Row>
      <Row className="justify-content-between">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Pool id:</Form.Label>
            <Form.Control readOnly type="text" name="pool id" value={poolId} />
          </Form.Group>
          <Row className="justify-content-between">
            <Button variant="secondary" type="reset">
              Clear
            </Button>
            <Button variant="primary" type="submit">
              Delegate!
            </Button>
          </Row>
        </Form>
      </Row>
    </Container>
  );
};
