// @flow
import type { Pool } from '../../app/models';
import type { AppState } from '../../app/reducers/types';
import { getOnlyOwnStakepools } from '../../app/containers/OwnStakepoolsList';

describe('OwnStakePoolsContainer getOnlyOwnStakepools', () => {
  const publicKey = 'publicKey';
  const createState = (pools: Array<Pool>): AppState => ({
    stakePools: { availablePools: pools },
    account: { publicKey }
  });

  describe('GIVEN a state without any stakepools', () => {
    let state;
    beforeAll(() => {
      state = createState([]);
    });
    describe('WHEN getting the users own stakepools', () => {
      let stakePools;
      beforeAll(() => {
        ({ stakePools } = getOnlyOwnStakepools(state));
      });
      test('THEN the user has no stakepools', () => {
        expect(stakePools).toBeInstanceOf(Array);
        expect(stakePools).toHaveLength(0);
      });
    });
  });

  describe('GIVEN a state with many stakepools, but none administered by the user', () => {
    let state;
    beforeAll(() => {
      state = createState([
        { id: '1', owners: ['someoneelse'], operators: ['anotheruser'] },
        { id: '2', owners: [], operators: ['anotheruser', 'someoneelse'] },
        { id: '3', owners: ['someoneelse', 'anotheruser'], operators: [] }
      ]);
    });
    describe('WHEN getting the users own stakepools', () => {
      let stakePools;
      beforeAll(() => {
        ({ stakePools } = getOnlyOwnStakepools(state));
      });
      test('THEN the user has no stakepools', () => {
        expect(stakePools).toBeInstanceOf(Array);
        expect(stakePools).toHaveLength(0);
      });
    });
  });

  describe('GIVEN a state with many stakepools, but none administered by the user', () => {
    let state;
    beforeAll(() => {
      state = createState([
        { id: '1', owners: ['someoneelse'], operators: ['anotheruser'] },
        { id: '2', owners: [], operators: ['anotheruser', 'someoneelse'] },
        { id: '3', owners: ['someoneelse', 'anotheruser'], operators: [] }
      ]);
    });
    describe('WHEN getting the users own stakepools', () => {
      let stakePools;
      beforeAll(() => {
        ({ stakePools } = getOnlyOwnStakepools(state));
      });
      test('THEN the user has no stakepools', () => {
        expect(stakePools).toBeInstanceOf(Array);
        expect(stakePools).toHaveLength(0);
      });
    });
  });

  describe('GIVEN a state with one stakepool, owned by only the user', () => {
    let state;
    beforeAll(() => {
      state = createState([{ id: '1', owners: [publicKey], operators: [] }]);
    });
    describe('WHEN getting the users own stakepools', () => {
      let stakePools;
      beforeAll(() => {
        ({ stakePools } = getOnlyOwnStakepools(state));
      });
      test('THEN the user has only one stakepool', () => {
        expect(stakePools).toBeInstanceOf(Array);
        expect(stakePools).toHaveLength(1);
        expect(stakePools[0]).toBe('1');
      });
    });
  });

  describe('GIVEN a state with one stakepool, administered and owned by the user', () => {
    let state;
    beforeAll(() => {
      state = createState([
        { id: '1', owners: [publicKey], operators: [publicKey] }
      ]);
    });
    describe('WHEN getting the users own stakepools', () => {
      let stakePools;
      beforeAll(() => {
        ({ stakePools } = getOnlyOwnStakepools(state));
      });
      test('THEN the user has only one stakepool', () => {
        expect(stakePools).toBeInstanceOf(Array);
        expect(stakePools).toHaveLength(1);
        expect(stakePools[0]).toBe('1');
      });
    });
  });

  describe('GIVEN a state with one stakepool, administered by the user and owned by someone else', () => {
    let state;
    beforeAll(() => {
      state = createState([
        { id: '1', owners: ['someoneelse'], operators: [publicKey] }
      ]);
    });
    describe('WHEN getting the users own stakepools', () => {
      let stakePools;
      beforeAll(() => {
        ({ stakePools } = getOnlyOwnStakepools(state));
      });
      test('THEN the user has only one stakepool', () => {
        expect(stakePools).toBeInstanceOf(Array);
        expect(stakePools).toHaveLength(1);
        expect(stakePools[0]).toBe('1');
      });
    });
  });
});
