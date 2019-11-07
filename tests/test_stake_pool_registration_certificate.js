import { expect } from 'chai';

const rust = import('../pkg/js_chain_libs');

it('generates certificate', async () => {
  const {
    PoolRegistration,
    U128,
    Certificate,
    PrivateKey,
    PublicKey,
    KesPublicKey,
    VrfPublicKey,
    PublicKeys,
    TimeOffsetSeconds
  } = await rust;
  const serial = U128.from_str('1010101010');
  const owners = new PublicKeys();
  owners.add(
    PublicKey.from_bech32(
      'ed25519_pk1m2mmtf6320yl3z9h2x23hhxtawwcudkpgzngp25wh2rpffdj8gmqws8lgr'
    )
  );
  const kesPublicKey = KesPublicKey.from_bech32(
    'kes25519-12-pk1s6pr56t6uzkmgdqs2krrh0tw9yyvdwfkzk7e90nsfxg08wqxg6qs9nuu5s'
  );
  const vrfPublicKey = VrfPublicKey.from_bech32(
    'vrf_pk1fz79zuzm2k8agqs7a5fgdpzprgpnzh58jhz35wjftd0km8dagfdqs8e08k'
  );
  const managementThreshold = 1;
  const startValidity = TimeOffsetSeconds.from_string('0');

  const poolRegistration = new PoolRegistration(
    serial,
    owners,
    managementThreshold,
    startValidity,
    kesPublicKey,
    vrfPublicKey
  );

  expect(poolRegistration.id().to_string()).to.eql(
    '6d7afbf4a8e0574a5dbbf35a71a42da86ebf679d864a03153446a4e671b26edc'
  );
});
