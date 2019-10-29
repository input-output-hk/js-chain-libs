// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './ChooseRestoreOrImport.scss';
import routes from '../constants/routes.json';
import BigSquareButton from '../components/BigSquareButton';
import restoreIcon from '../assets/images/restore-ic.inline.svg';
import importIcon from '../assets/images/import-ic.inline.svg';

export default () => {
  const history = useHistory();
  return (
    <div className={styles.component}>
      <div className={styles.buttonRow}>
        <BigSquareButton
          label="Restore wallet"
          description="restore the keys from a key string"
          icon={restoreIcon}
          onClick={() => history.push(routes.INPUT_KEYS)}
        />
        <BigSquareButton
          label="Generate a new wallet"
          description="not implemented yet"
          icon={importIcon}
          onClick={() => console.log('not implemented')}
        />
      </div>
    </div>
  );
};
