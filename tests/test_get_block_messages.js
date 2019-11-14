import { expect } from 'chai';

const rust = import('../pkg/js_chain_libs');

const binaryBlock =
  '02b6000200000099000000000000000300000001ceb579548cdbfebca14ba55a6d68447f94f0d2e784a1425cd07e848bd311178d0a8195c1876d5f5e80a25412c1c7d47e06048553dbbb47d89f9451f3799e54b238502fef71ee8bdebabcd61f57ad91b02e3fde1c686911fa05a4f0a501d97ebdd6f8cf1b5eaf07d1bf489baf7b9a5c765c1e94524e2c76728112dc41df5fc80add667dcb347c8a8e52fb27cfa22203a0c2f93e3074ee058f2da0b9b27bbf49067b00395beca49a944d273f2f20dd3b97456568697a3c1f6e06af2d82e03fb10c000000004206b845fcfb722382c01139040c7c5c336b93263f37023bf07ac32dd8de121d35f3e6552b4694154daea0a5a52fb58249f34ccbcae10af5a42450338a42150346e198c21bae0aec3822adc011d5b0390650b60e55b6fb5662f89ec2cbda746c202c6ab2f633a962f4fdecff78e1f8cc6b0279fc6537aa042bb9842536c9b690e750719750afe8a06008d5a4b87d15612efea059764d0b172057d99404bbb24d41b88488ae2900e8d0b1fc5ad85f20e685a203c39fc890076774768ccc7a31f0a337b4deb1a30bb4e275e4af3fa8e91cd6be07077f3b19cd5a12292ae77c1d9a1ae88f057baece8ca01c9acd637dc022458d067dc5b832126b1a0527f56b20576a699d3423636d0ad46fd7ad2e0b7450a4eb6aaaf4ffaefa480f2da028fc93e56d327218f01d169834dfc87e352f07bb3c136a57a1bc7c46a3ecf9fad8b52254b0c5fc6107c0dc4813b608cac8fb562b91db3fe75e235a33fe86aabd157f2202ab7d964ce3b8849bc4c2fa53261abce219fd67086a490a562813f0b6eec3dbb4cd698ff11b1163995b6de6c99624557dc552be395d8d8ac618e8b5a8c565e553fcc52689cac7e5ff19d9a508dfa1037119f77d5fc3780e2ec9bbe1bbfaa257f69fa56031c7f77862d384576fc46e522e2596715475e9b421f92045be26b3350d009700020101ff000000000000271a5ca751423e00439b7389dbbad1a346a3ef8438d73a15528c44677160e60d2b8f85b7b0199dcc3b976ba44603685c707e56778efabf17617d7ab69a1465c4e8dccf0000000000002710025e7ee0802332cb51c1e527bd8db6800a38d2c4b91a4c4671399a73b763534e0ec928de0d4b27faba3c1f82f9fbb1e67dc901a42eed47862e80d6c0a96aaa4e07';
const id = '939d61a8fe89293efdfdce6efeab1999ab1deb0f0bd4b8852b27580fbcc15bc5';

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
  ).to.eql('55206f11d5ef48e70dbc6d21f3fc84045a7135a97acca0f5ef3adebc64812886');

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
  ).to.eql('addr1s4w2w52z8cqy8xmn38dm45drg637lppc6uap255vg3nhzc8xp54c7zycnlu');

  expect(input.value().to_str()).to.eql('10010');

  const output = outputs.get(0);

  expect(output.address().to_string('addr')).to.eql(
    'addr1skmmqxvaesaew6aygcpkshrs0et80rh6hutkzlt6k6dpgewyarwv7kjsaw8'
  );
  expect(output.value().to_str()).to.equal('10000');
});

function hexStringToBytes(string) {
  const bytes = [];
  for (let c = 0; c < string.length; c += 2)
    bytes.push(parseInt(string.substr(c, 2), 16));
  return Uint8Array.from(bytes);
}
