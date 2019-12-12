// @flow
import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import RestoreWalletFromPrivateKey from '../components/RestoreWalletFromPrivateKey';
import RestoreWalletFromMnemonic from '../components/RestoreWalletFromMnemonic';

import typeof {
  setAccountFromMnemonic as SetAccountFromMnemonic,
  setAccount as SetAccount
} from '../actions/account';
import { isValidMnemonic } from '../utils/mnemonic';

type Props = {
  setAccountFromMnemonic: SetAccountFromMnemonic,
  setAccount: SetAccount
};

// FIXME: this has no error handling, neither while parsing the address
// nor when fetching the balance.
export default ({ setAccountFromMnemonic, setAccount }: Props) => {
  const checkIsValidMnemonicPhrase = function checkIsValidMnemonicPhrase() {
    setIsMnemonicValid(isValidMnemonic(newMnemonicPhrase));
  };

  const handleSubmitMnemonic = function handleSubmitMnemonic(event) {
    event.preventDefault();
    if (isValidMnemonic(newMnemonicPhrase)) {
      setAccountFromMnemonic(newMnemonicPhrase, newMnemonicPassword);
    }
    setIsMnemonicValid(false);
  };

  const [isMnemonicValid, setIsMnemonicValid] = useState(true);

  const [newMnemonicPhrase, setNewMnemonicPhrase] = useState('');

  const [newMnemonicPassword, setNewMnemonicPassword] = useState('');

  return (
    <Tabs fill defaultActiveKey="keyString" className="justify-content-center">
      <Tab eventKey="keyString" title="Use key string">
        <RestoreWalletFromPrivateKey setAccount={setAccount} />
      </Tab>
      <Tab eventKey="mnemonic" title="Use mnemonic phrase">
        <RestoreWalletFromMnemonic
          setAccountFromMnemonic={setAccountFromMnemonic}
        />
      </Tab>
    </Tabs>
  );
};
