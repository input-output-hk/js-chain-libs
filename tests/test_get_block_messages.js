import { expect } from 'chai';

const rust = import('../pkg/js_chain_libs');

const binaryBlock =
  '02b6000200000099000000000000004300000001ced88d77dfb26551c9ea00a34c4abca03ca0ff8fa728134f3510b7c99002ba55e31f182243d4906e3ca8a6b0e3f4e361e9610d79baf5367672932f1d00cf0554e99b13904e99b0b4ad72c1f330c2ffaf00b554cbf6ef8c5f4d6406552d371cce7020ced4b032198d378369a5dc1d8d8f84a8287c6cbef4e3dc6679013113ac726d9c4c4d69ea617e4dc2590c77c8b190ba907b6884b50d885cd7382737dec800bae349261b442f4e36c7bdb3b60cb4ef173370d85ec40dad0ccefd8bc33ea409000000001a2359461e0df9d9b4129be41b8ac4e5eb72f2095039c192258d3773c45bfbeb3b0d9dda40ba31681b48b380b850038b2f3da308ae82e11d40949cf9a2bf61039743b7404bafb2a67770b16537c188f48720eba6f44aacd37815cdbe8ce0aae8ec41aca293c6390ab04de4ad292e0007d1f5fcf6c235da2cd800ee424d93631de86f985d7aad165545c0a9817aebcf8274c96daa0a4302419ef6748248d72a015e2798462e0521cbcfd14b825ce028ac135b60f0ec629855d01b4b1338ab1adda90984b9dcf0dd1d01df434c7f3c934e2466c5e1f9f121c10b3760360654f435b17efa34662e25880ff12520937685ad3700b251569ca2ddb6fe904e5ff7bda2116862f7c85d8024cfae12718d9a998ca257ad3c2497e030195d8ce637d02762fe3bdfd6159c7876257bb41042cda86d07c6d6cd2b851de783370e059424938e4508d6551f5dea86fad07231dcdd0cce6a35dc76834b8d0af20085f67f5d7b26622cea531128c1fb6b22a341e984d4ec731cbb791279111c1bec3df402308f3e0c0be65599e128cc5a0a2e413d4d040cea0dc59e309c1393247c7c233b24bb9901859ab20cde9040b2f682a72c28fe0f440be6e3e5fdc51c32553cd6b035e4b448603c3d3fd0eedda7a59ad569bdc359132246a0390ad0ede988e61f1afa421c009702000101ff00000000000003f2502238e65821d0b8341ea261b1756b8049cb3630eb3ebb0b54323b3cd010b8d285b7b0199dcc3b976ba44603685c707e56778efabf17617d7ab69a1465c4e8dccf00000000000003e802d1f4ecf972bb39a7217e46f2ca5f99213b3adc810dd859e223d2e14012954a5cccea45cdf48f908c39daaaa1d936c6ce842279a7ebbaea895e212a7fd3421802';
const id = 'abdfc4fa669ca076a97da7dfa4133102db255e577fff8ad5d3a2763cf8ef64d1';

it('get block messages', async () => {
  const {
    Block,
    Hash,
    // eslint-disable-next-line camelcase
    uint8array_to_hex,
    AddressDiscrimination
  } = await rust;

  const block = Block.from_bytes(hexStringToBytes(binaryBlock));

  expect(block.id().as_bytes()).to.eql(Hash.from_hex(id).as_bytes());
  expect(block.fragments().size()).to.eql(1);
  expect(
    block
      .fragments()
      .get(0)
      .is_transaction()
  ).to.eql(true);

  expect(
    uint8array_to_hex(
      block
        .fragments()
        .get(0)
        .id()
        .as_bytes()
    )
  ).to.eql('db4460c9b6fefad53574a56e20cda08e9664e2fa5b26133b9c20e9f18881d57b');

  const transaction = block
    .fragments()
    .get(0)
    .get_transaction();

  const inputs = transaction.inputs();
  const outputs = transaction.outputs();

  expect(inputs.size()).to.eql(1);
  expect(outputs.size()).to.eql(1);

  const input = inputs.get(0);
  expect(input.is_account()).to.eql(true);

  expect(
    input
      .get_account()
      .to_address(AddressDiscrimination.Test)
      .to_string('addr')
  ).to.eql('addr1s4gzyw8xtqsapwp5r63xrvt4dwqynjekxr4nawct2serk0xszzudyx327sp');

  expect(input.value().to_str()).to.eql('1010');

  const output = outputs.get(0);

  expect(output.address().to_string('addr')).to.eql(
    'addr1skmmqxvaesaew6aygcpkshrs0et80rh6hutkzlt6k6dpgewyarwv7kjsaw8'
  );
  expect(output.value().to_str()).to.equal('1000');
});

function hexStringToBytes(string) {
  const bytes = [];
  for (let c = 0; c < string.length; c += 2)
    bytes.push(parseInt(string.substr(c, 2), 16));
  return Uint8Array.from(bytes);
}
