// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import typeof { setAccountFromMnemonic as SetAccountFromMnemonic } from '../actions/account';

type Props = {
  setAccountFromMnemonic: SetAccountFromMnemonic
};

export default ({ setAccountFromMnemonic }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    return Promise.all([setAccountFromMnemonic(newMnemonicPhrase, '', '')]);
  };

  const [newMnemonicPhrase] = useState(
    'harsh slam survey upon leisure endorse earn become above old tiny fabric paper wrist path'
  );
  return (
    <Container>
      <Form onSubmit={handleSubmit} className="mt-5">
        <Form.Label>
          <p>
            This is your new secret mnemonic phrase! Your secret phrase makes it
            easy to back up and restore your account.
          </p>
        </Form.Label>
        <Form.Label>
          <p>
            Please write it and save on a secure place. You should not share it
            with anyone.
          </p>
        </Form.Label>

        <Form.Control
          disabled
          as="textarea"
          rows="3"
          readOnly
          value={newMnemonicPhrase}
        />
        <Row className="justify-content-center mt-3">
          <Button variant="primary" type="submit">
            Got It!
          </Button>
        </Row>
      </Form>
    </Container>
  );
};
