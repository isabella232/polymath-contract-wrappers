import { Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import SecurityTokenRegistryWrapper from '../contract_wrappers/registries/security_token_registry_wrapper';
import SecurityTokenWrapper from '../contract_wrappers/tokens/security_token_wrapper';
import ERC20TokenWrapper from '../contract_wrappers/tokens/erc20_wrapper';
import ERC20DetailedTokenWrapper from '../contract_wrappers/tokens/erc20_detailed_wrapper';
import ContractFactory from './contractFactory';
import assert from '../utils/assert';

/**
 * The SecurityTokenFactory class is a factory to generate new SecurityTokenWrappers.
 */
export default class TokenWrapperFactory {
  private readonly web3Wrapper: Web3Wrapper;

  /**
   * An instance of the ContractFactory class containing methods
   * to create instances for each contract.
   */
  private contractFactory: ContractFactory;

  /**
   * An instance of the SecurityTokenRegistryWrapper class containing methods
   * for interacting with SecurityTokenRegistry smart contract.
   */
  private securityTokenRegistry: SecurityTokenRegistryWrapper;

  public constructor(
    web3Wrapper: Web3Wrapper,
    securityTokenRegistry: SecurityTokenRegistryWrapper,
    contractFactory: ContractFactory,
  ) {
    this.web3Wrapper = web3Wrapper;
    this.securityTokenRegistry = securityTokenRegistry;
    this.contractFactory = contractFactory;
  }

  /**
   * @param address Security Token contract address
   *
   * @memberof SecurityTokenWrapperFactory
   */
  public getERC20TokenInstanceFromAddress = async (address: string): Promise<ERC20TokenWrapper> => {
    assert.isETHAddressHex('address', address);
    const token = new ERC20DetailedTokenWrapper(
      this.web3Wrapper,
      this.contractFactory.getERC20DetailedContract(address),
    );
    if (await token.isValidContract()) {
      return token;
    }

    // TODO: Replace this for a typed Error
    throw new Error();
  };

  /**
   * @param address Security Token contract address
   *
   * @memberof SecurityTokenWrapperFactory
   */
  public getSecurityTokenInstanceFromAddress = async (address: string): Promise<SecurityTokenWrapper> => {
    assert.isETHAddressHex('address', address);
    if (await this.securityTokenRegistry.isSecurityToken({ securityTokenAddress: address })) {
      return new SecurityTokenWrapper(
        this.web3Wrapper,
        this.contractFactory.getSecurityTokenContract(address),
        this.contractFactory,
      );
    }
    // TODO: Replace this for a typed Error
    throw new Error();
  };

  /**
   * @param ticker Security Token token symbol
   *
   * @memberof SecurityTokenWrapperFactory
   */
  public getSecurityTokenInstanceFromTicker = async (ticker: string): Promise<SecurityTokenWrapper> => {
    const address = await this.securityTokenRegistry.getSecurityTokenAddress(ticker);
    assert.isNonZeroETHAddressHex('address', address);
    return new SecurityTokenWrapper(
      this.web3Wrapper,
      this.contractFactory.getSecurityTokenContract(address),
      this.contractFactory,
    );
  };
}
