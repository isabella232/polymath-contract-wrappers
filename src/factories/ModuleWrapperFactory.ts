import { Web3Wrapper } from "@0x/web3-wrapper";
import { CappedSTOWrapper } from "../contract_wrappers/modules/sto/capped_sto_wrapper";
import { USDTieredSTOWrapper } from "../contract_wrappers/modules/sto/usd_tiered_sto_wrapper";
import { GeneralTransferManagerWrapper } from "../contract_wrappers/modules/transfer_manager/general_transfer_manager_wrapper";
import { GeneralPermissionManagerWrapper } from "../contract_wrappers/modules/permission_manager/general_permission_manager_wrapper";
import {ContractFactory} from './contractFactory';

interface IGetModuleParams {
  address: string,
  name: string
}

interface IGetGeneralPermissionManager extends IGetModuleParams {
  name: 'GeneralPermissionManager'
}

interface IGetGeneralTransferManager extends IGetModuleParams {
  name: 'GeneralTransferManager'
}

interface IGetCappedSTO extends IGetModuleParams {
  name: 'CappedSTO'
}

interface IGetUSDTieredSTO extends IGetModuleParams {
  name: 'USDTieredSTO'
}

interface IGetModuleInstance {
  (params: IGetGeneralPermissionManager): Promise<GeneralPermissionManagerWrapper>;
  (params: IGetGeneralTransferManager): Promise<GeneralTransferManagerWrapper>;
  (params: IGetCappedSTO): Promise<CappedSTOWrapper>;
  (params: IGetUSDTieredSTO): Promise<USDTieredSTOWrapper>;
}

/**
 * The ModuleWrapperFactory class is a factory to get instances from modules attached to a SecurityToken.
 */
export class ModuleWrapperFactory {

  private readonly _web3Wrapper: Web3Wrapper;
  private _contractFactory;

  constructor(web3Wrapper: Web3Wrapper, contractFactory: ContractFactory) {
    this._web3Wrapper = web3Wrapper;
    this._contractFactory = contractFactory;
  }

  public getModuleInstance: IGetModuleInstance = async (params: IGetModuleParams): Promise<any> => {
    switch (params.name) {
      // Permission
      case 'GeneralPermissionManager':
        return new GeneralPermissionManagerWrapper(this._web3Wrapper,
            this._contractFactory._getGeneralPermissionManagerContract(params.address));
      // TMs
      case 'GeneralTransferManager':
        return new GeneralTransferManagerWrapper(this._web3Wrapper,
            this._contractFactory._getGeneralTransferManagerContract(params.address));
      // STOs
      case 'CappedSTO':
        return new CappedSTOWrapper(this._web3Wrapper,
            this._contractFactory._getCappedSTOContract(params.address));
      case 'USDTieredSTO':
        return new USDTieredSTOWrapper(this._web3Wrapper,
            this._contractFactory._getUSDTieredSTOContract(params.address));
      // Checkpoint
      // Burn
    }
  }
}
