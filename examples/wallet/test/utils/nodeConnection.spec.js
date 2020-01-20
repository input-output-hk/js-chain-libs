// @flow
import { stub } from 'sinon';
import nodeConnectionBuilder from '../../app/utils/nodeConnection';

describe('nodeConnection', () => {
  describe('getStakePools', () => {
    const setup = edges =>
      nodeConnectionBuilder({
        injectedAxios: {
          post: stub().resolves({
            data: {
              data: {
                allStakePools: {
                  edges
                }
              }
            }
          })
        }
      });
    describe('failed call to the node', () => {
      describe('GIVEN a failed call to the node', () => {
        let getStakePools;
        beforeAll(() => {
          ({ getStakePools } = nodeConnectionBuilder({
            injectedAxios: { post: stub().rejects(new Error('mocked error')) }
          }));
        });
        test('THEN the error bubbles up', () => {
          return expect(getStakePools()).rejects.toThrow('mocked error');
        });
      });
    });

    describe('successful calls to the node', () => {
      describe('GIVEN a single stakepool with several owners and operators', () => {
        let getStakePools;
        beforeAll(() => {
          ({ getStakePools } = setup([
            {
              node: {
                id:
                  '567f86e80cd75ba2d07de0b64a1cedad34ba5f1f913dfdab3bcf6de755429178',
                registration: {
                  operators: [
                    'ed25519_pk1zpjeyt4nygspm9cnlpk2lagxgkup9xajfq54fm3wfcurdyaxzgpq2eua6q',
                    'ed25519_pk1mnrutv8jzecsznacp58y94vnpnfr27qyurew08x40vsfhmxkchnqxc7qs5'
                  ],
                  owners: [
                    'ed25519_pk12w52eexz2rhyneu8lwfjuk3agc2huxzenw59qaflgwfch350kj8shllq2r',
                    'ed25519_pk1lxxa4c57gyghg9vsejv3dpx7t5k4j0d7jd59c3v3m8eltgdyxrrsxetffg',
                    'ed25519_pk1n4gpkajpslufejj9qtudl9glay3uqh6ph7mqws9unglegz7yndeqzglupd'
                  ]
                }
              }
            }
          ]));
        });
        test('THEN the response is transformed', async () => {
          const response = await getStakePools();
          expect(response).toBeInstanceOf(Array);
          expect(response[0]).toHaveProperty(
            'id',
            '567f86e80cd75ba2d07de0b64a1cedad34ba5f1f913dfdab3bcf6de755429178'
          );
          expect(response[0]).toHaveProperty('owners', [
            'ed25519_pk12w52eexz2rhyneu8lwfjuk3agc2huxzenw59qaflgwfch350kj8shllq2r',
            'ed25519_pk1lxxa4c57gyghg9vsejv3dpx7t5k4j0d7jd59c3v3m8eltgdyxrrsxetffg',
            'ed25519_pk1n4gpkajpslufejj9qtudl9glay3uqh6ph7mqws9unglegz7yndeqzglupd'
          ]);
          expect(response[0]).toHaveProperty('operators', [
            'ed25519_pk1zpjeyt4nygspm9cnlpk2lagxgkup9xajfq54fm3wfcurdyaxzgpq2eua6q',
            'ed25519_pk1mnrutv8jzecsznacp58y94vnpnfr27qyurew08x40vsfhmxkchnqxc7qs5'
          ]);
          expect(Object.keys(response[0])).toHaveLength(3);
        });
      });

      describe('GIVEN zero stakepools', () => {
        let getStakePools;
        beforeAll(() => {
          ({ getStakePools } = setup([]));
        });
        test('THEN the response is transformed', async () => {
          const response = await getStakePools();
          expect(response).toBeInstanceOf(Array);
          expect(response).toHaveLength(0);
        });
      });
    });
  });
});
