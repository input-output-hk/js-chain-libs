import { networkSettings } from '../config.json';

const { genesisTimestamp, slotsPerEpoch, slotDuration } = networkSettings;

/**
 * This functions gets a BlockDate and returns the amount of
 * seconds past since genesis block
 * @param blockDate Formed by an epoch object and a slot number
 */
const secondsSinceGenesis = ({ epoch, slot }) => {
  // Epoch id is the Epoch number starting at zero.
  const epochCount = Number.parseInt(epoch.id, 10);
  const slotCount = Number.parseInt(slot, 10);
  const slotsSinceGenesis = slotsPerEpoch * epochCount + slotCount;

  return slotsSinceGenesis * slotDuration;
};

/**
 * This functions get an epoch and a slot of block and returns
 *  the timestamp of the date it should have been produced
 * @param blockDate Formed by an epoch object and a slot number
 */
export const timestampFromBlockDate = blockDate => {
  const secsSinceGenesis = secondsSinceGenesis(blockDate);

  return genesisTimestamp + secsSinceGenesis;
};

/**
 * This functions get an epoch and returns the date it
 * started
 * @param epoch Object that contains only an id
 */
export const timestampFromEpoch = epoch => timestampFromBlockDate({ epoch, slot: 0 });

/**
 * This functions receives a timestamp relative to genesis block
 * and returns an absolute timestamp
 * @param relative Timestamp relative to genesis Block
 */
export const relativeToAbsolute = relative => {
  const offset = Number.parseInt(relative, 10);

  return genesisTimestamp + offset;
};
