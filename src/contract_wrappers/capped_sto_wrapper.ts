import { CappedSTOContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { CappedSTO } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { IFundRaiseTypes, IFundsRaised } from '../types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the CappedSTO contract.
 */
export class CappedSTOWrapper extends ContractWrapper {
  public abi: ContractAbi = CappedSTO.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private cappedSTOContract: Promise<CappedSTOContract>;
  /**
   * Instantiate CappedSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.cappedSTOContract = this._getCappedSTOContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.cappedSTOContract).address;
  }

  /**
   * Start time of the Capped STO
   */
  public getStartTime = async (): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).startTime.callAsync();
  }

  /**
   * End time of the Capped STO
   */
  public getEndTime = async (): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).endTime.callAsync();
  }

  /**
   * How many token units a buyer gets (multiplied by 10^18) per wei / base unit of POLY
   */
  public getRate = async (): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).rate.callAsync();
  }

  /**
   * How many token base units this STO will be allowed to sell to investors
   */
  public getCap = async (): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).cap.callAsync();
  }

  /**
   * Ethereum account address to hold the funds
   */
  public getWallet = async (): Promise<string> => {
    return await (await this.cappedSTOContract).wallet.callAsync();
  }

  /**
   * Type of currency used to collect the funds
   */
  public getFundRaiseTypes = async (params: IFundRaiseTypes): Promise<boolean> => {
    return await (await this.cappedSTOContract).fundRaiseTypes.callAsync(params.index);
  }

  /**
   * Returns funds raised by the STO
   */
  public getFundsRaised = async (pasams: IFundsRaised): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).fundsRaised.callAsync(pasams.index);
  }

  /**
   * Return the total no. of tokens sold
   */
  public getTotalTokensSold = async(): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).totalTokensSold.callAsync();
  }

  /**
   * Number of individual investors this STO have.
   */
  public getInvestorCount = async (): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).investorCount.callAsync();
  }

  private async _getCappedSTOContract(): Promise<CappedSTOContract> {
    return new CappedSTOContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'CappedSTO',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
  }
}
