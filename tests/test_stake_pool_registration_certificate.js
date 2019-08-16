import { expect } from 'chai';

const rust = import('../pkg/js_chain_libs');

it('generates certificate', async () => {
  const {
    StakePoolInfo,
    U128,
    Certificate,
    PrivateKey,
    PublicKey,
    KesPublicKey,
    VrfPublicKey,
    PublicKeys
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
  const stakePoolInfo = new StakePoolInfo(
    serial,
    owners,
    kesPublicKey,
    vrfPublicKey
  );
  expect(stakePoolInfo.id().to_string()).to.eql(
    'b86471bd72599a45a90fe2cdf4bdc0cc8a8c9af9e87521b64e821ca7d99c2993'
  );
  const certificate = Certificate.stake_pool_registration(stakePoolInfo);
  certificate.sign(
    PrivateKey.from_bech32(
      'ed25519_sk1mr52spjelqhs5hegxuymh8la04gkrxh5543cf4c7hx8x3mz3sadqdfdx5y'
    )
  );
  expect(certificate.to_bech32()).to.eql(
    'cert1qgqqqqqqqqqqqqqqqqqqq0p5avfqrk4hkkn4z57flzytw5v4r0wvh6ua3cmvzs9xsz4gaw5xzjjmyw3ks6pr56t6uzkmgdqs2krrh0tw9yyvdwfkzk7e90nsfxg08wqxg6q530z3wpd4tr75qg0w6y5xs3q35qe3t6ret3g68fy4khmdnk75ykspqpqfc2knaxwmgkzenlvmewe77y04uzlvlemqqvtd7xceftqwvkx8483vmaz2086fvrhs5wddj6s5ptpdx7dfljwyw94fm4m20e9wkqk3pg3d2n39'
  );
});
