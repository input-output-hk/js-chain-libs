import { expect } from 'chai';

const rust = import('../pkg/js_chain_libs');

const binaryBlock =
  '02b6000200000098000000d900002ce400001d9612b541b99e5e748050744ef8810505cd099d408f50c41db24bd1f300107fb4b7c8d4e10f9adb12c9010dc6059cc8f3860855dc89031ac05f670f8935355eca85da2d5f25f4d538b7a2c99ef41d2127444428de19be327282473db763442ad61ddc805d7975ae4b2e726c3be024a68b53a9b78c41df70caf318f7ba5a96174d19c4731e898e2e8a6492c0883fc77b3b9bb80c340fea9e4d817c287b88cf2b120935aaf807b819c5494631102ec9467b520789891b6f303375d7dbcb49f0ce030f00000000728edf17265ee3f786834873385a236229bb7f55c0ed3aaecd922f2ce0f8d10bca1d319ac343f3af45eef3dea9333b32da72c58df71e935512134091f375740663259f4fc0a3d893f023b79c0dde20822ea821aff217f50fa0d1b955fc2ede1c2a7324df3397888f73844a06ee2a2e9fcfb070efbde8b6592326653e0dcd39f6729c13227cfe8a2252d48ab86570be1279ca8fde09ec1e03293304e466e363893626e5090a36e1a2a1418c2c5171cc6e5f61bdaf0bc652265710f41793eb8c19c2e6cd096588f2b73f813ce2816a5dc9a25d29f8b1343f545f5998fea2184052fed8d2594bdcc6dfe26e7d2af02410c96e9c2229f6ec9a892754b01b83ae8f84e1b56fcc59e040dc9b931a967cc233cd72a1149684ed416233a39d5624027508279520b5f46f5498fc9e26a876528e8600ef63ee6a986cf234365a595c8986114c3b76d4e24e773a8736c7aba5fa4adc0cf6d250e28bec26213a1443656ad902d2818ab129793c1c10aa1f7939651d2c883749992dc57d69b3afd79166db2b77ada12881d6eccafddcf86a555d04f9ca04d262ec0d38796d6e675d3a5b859bcf49d2ac8832f778ad73f3d3ea9e5c63c6d4234f57286c9053f5f8f97fa112261c86427a2847a0c5bae85f2969e6f5a8c99dda3891275cacf957c1606395bdc67e0096020101ff0000003a3529484ca251a5c84c7f536a3a1f9e2f6e6e3a3cc35b36c5e6797ebed34dea32a152da00858d5344770d819d53dd8dc5ee62e64a3acd325c05bd1a3c50c0b953f6f311d5380000003a3529440002b87743842c19a52bf93519b929251cb1c131c49ae09604951bdea6c44b49b7985d47d1afb451be5ac04083802b31db43d07de9850385eefa815278a92f99b408';
const id = '2a75779788fbf81b08b24f46cea7858256eaa5ee1db51255d9a556926759469f';

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
  ).to.eql('a5eccca550ef6f04a3b82c9ce9496a952be41f5e013997aa5aab0e854b27c251');

  const transaction = block
    .fragments()
    .get(0)
    .get_transaction()
    .transaction();

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
  ).to.eql('addr1sk39rfwgf3l4x636r70z7mnw8g7vxkekchn8jl476dx75v4p2tdqq30rhxj');

  expect(input.value().to_str()).to.eql('250000001100');

  const output = outputs.get(0);

  expect(output.address().to_string('addr')).to.eql(
    'addr1skx4x3rhpkqe657a3hz7uchxfgav6vjuqk7350zsczu48ahnz82nspnkqkc'
  );
  expect(output.value().to_str()).to.equal('250000000000');
});

function hexStringToBytes(string) {
  const bytes = [];
  for (let c = 0; c < string.length; c += 2)
    bytes.push(parseInt(string.substr(c, 2), 16));
  return Uint8Array.from(bytes);
}
