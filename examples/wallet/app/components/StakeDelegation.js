// @flow
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import PieChart from 'react-minimal-pie-chart';
import type { PoolId } from '../models';
import typeof { sendStakeDelegation as SendStakeDelegation } from '../actions/account';
import StakePoolList from '../containers/StakePoolList';
import styles from './StakeDelegation.scss';

type Props = {
  sendStakeDelegation: SendStakeDelegation
};

type DelegationInfo = { parts: number, selectionOrder: number };

type PieChartEntry = {
  value: number,
  title: string,
  color: Color
};

export default ({ sendStakeDelegation }: Props) => {
  const [delegation, setDelegation] = useState<{
    [key: PoolId]: DelegationInfo
  }>({});
  const [selectionCount, setSelectionCount] = useState<number>(0);

  const poolSelectionHandler = (poolId: PoolId) => {
    const currentDelegation = delegation[poolId] && delegation[poolId].parts;
    setDelegation(
      Object.assign({}, delegation, {
        [poolId]: Object.assign(
          { selectionOrder: selectionCount, parts: 0 },
          delegation[poolId] || {},
          { parts: (currentDelegation || 0) + 1 }
        )
      })
    );
    if (!currentDelegation) {
      setSelectionCount(selectionCount + 1);
    }
  };

  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    sendStakeDelegation(delegation);
  };
  const pieChartData: Array<PieChartEntry> = Object.keys(delegation).map(
    pool => ({
      value: delegation[pool].parts,
      title: pool,
      color: colors[delegation[pool].selectionOrder % colors.length]
    })
  );

  return (
    <Container>
      <Row>
        <h3>Available pools</h3>
      </Row>
      <Row>
        <StakePoolList onSelection={poolSelectionHandler} />
      </Row>
      <Row>
        <h3>New delegation</h3>
      </Row>
      {Object.keys(delegation).length ? (
        <div>
          <Row className="justify-content-center">
            <PieChart data={pieChartData} labels />
          </Row>
          <Row className="justify-content-between">
            <Button
              variant="secondary"
              type="reset"
              onClick={() => {
                setDelegation({});
                setSelectionCount(0);
              }}
            >
              Clear
            </Button>
            <Button variant="primary" type="button" onClick={handleSubmit}>
              Delegate!
            </Button>
          </Row>
        </div>
      ) : (
        <Row>
          <p className={`text-muted ${styles.delegationPlaceholder}`}>
            Choose at least one stake pool to begin a new delegation
          </p>
        </Row>
      )}
    </Container>
  );
};

const colors = [
  '#f2777a',
  '#99cc99',
  '#ffcc66',
  '#6699cc',
  '#cc99cc',
  '#66cccc',
  '#d3d0c8',
  '#747369'
];
// there must be a better way to do this 😢
type Color =
  | '#f2777a'
  | '#99cc99'
  | '#ffcc66'
  | '#6699cc'
  | '#cc99cc'
  | '#66cccc'
  | '#d3d0c8'
  | '#747369';
