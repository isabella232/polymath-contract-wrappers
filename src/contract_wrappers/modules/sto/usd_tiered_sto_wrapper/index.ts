/* istanbul ignore file */
import { USDTieredSTO_3_0_0, isUSDTieredSTO_3_0_0 } from './3.0.0';
import { USDTieredSTO_3_1_0, isUSDTieredSTO_3_1_0 } from './3.1.0';
import Common, { isUSDTieredSTO } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type USDTieredSTO = USDTieredSTO_3_0_0 | USDTieredSTO_3_1_0;

export {
  isUSDTieredSTO,
  USDTieredSTO_3_0_0,
  isUSDTieredSTO_3_0_0,
  USDTieredSTO_3_1_0,
  isUSDTieredSTO_3_1_0
};

// for internal use
export class USDTieredSTOCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
