// LockUpTransferManager test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  LockUpTransferManagerContract,
  ISecurityTokenContract,
  PolyTokenEvents,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import LockUpTransferManagerWrapper from '../lock_up_transfer_manager_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import ModuleWrapper from '../../module_wrapper';
import {
  bytes32ArrayToStringArray,
  bytes32ToString,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  parsePermBytes32Value,
  stringArrayToBytes32Array,
  stringToBytes32,
  valueArrayToWeiArray,
  valueToWei,
  weiToValue,
} from '../../../../utils/convert';
import { Partition, Perm } from '../../../../types';

describe('LockUpTransferManagerWrapper', () => {
  let target: LockUpTransferManagerWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: LockUpTransferManagerContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(LockUpTransferManagerContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new LockUpTransferManagerWrapper(
      instance(mockedWrapper),
      myContractPromise,
      instance(mockedContractFactory),
    );
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
    reset(mockedSecurityTokenContract);
  });

  describe('Types', () => {
    test('should extend ModuleWrapper', async () => {
      expect(target instanceof ModuleWrapper).toBe(true);
    });
  });

  describe('paused', () => {
    test('should get Paused', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.paused();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.paused).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('pause/unpause', () => {
    test('should call to pause', async () => {
      // Pause Result expected
      const expectedPauseResult = false;
      // Mocked method
      const mockedPauseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPauseMethod));
      // Stub the request
      when(mockedPauseMethod.callAsync()).thenResolve(expectedPauseResult);

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';

      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);

      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.pause).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.pause(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.pause).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.paused).once();
      verify(mockedPauseMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
    });

    test('should call to unpause', async () => {
      // Pause Result expected
      const expectedPauseResult = true;
      // Mocked method
      const mockedPauseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPauseMethod));
      // Stub the request
      when(mockedPauseMethod.callAsync()).thenResolve(expectedPauseResult);

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';

      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);

      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.unpause).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.unpause(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.unpause).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.paused).once();
      verify(mockedPauseMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('lockups', () => {
    test.todo('should fail as lockup name is an empty string');

    test('should call to lockups', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = new BigNumber(1);
      const startTime = new Date(2030, 1);
      const expectedStartTime = dateToBigNumber(startTime);
      const expectedLockUpPeriodSeconds = new BigNumber(3600);
      const expectedReleaseFrequencySeconds = new BigNumber(60);
      const expectedResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
      ];
      const mockedParams = {
        lockupName: 'LockupDetails',
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.lockups).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.lockups(mockedParams);
      // Result expectation
      expect(result.lockupAmount).toEqual(weiToValue(expectedLockupAmount, expectedDecimalsResult));
      expect(result.startTime).toEqual(startTime);
      expect(result.lockUpPeriodSeconds).toBe(expectedResult[2]);
      expect(result.releaseFrequencySeconds).toBe(expectedResult[3]);

      // Verifications
      verify(mockedContract.lockups).once();
      verify(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('getLockUp', () => {
    test.todo('should fail as lockup name is an empty string');

    test('should call to getLockups', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(2), expectedDecimalsResult);
      const startTime = new Date(2030, 1);
      const expectedStartTime = dateToBigNumber(startTime);
      const expectedLockUpPeriodSeconds = new BigNumber(3600);
      const expectedReleaseFrequencySeconds = new BigNumber(60);
      const expectedUnlockedAmount = new BigNumber(1);
      const expectedResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedParams = {
        lockupName: 'LockupDetails',
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getLockUp(mockedParams);
      // Result expectation
      expect(result.lockupAmount).toEqual(weiToValue(expectedLockupAmount, expectedDecimalsResult));
      expect(result.startTime).toEqual(startTime);
      expect(result.lockUpPeriodSeconds).toBe(expectedResult[2]);
      expect(result.releaseFrequencySeconds).toBe(expectedResult[3]);
      expect(result.unlockedAmount).toEqual(weiToValue(expectedUnlockedAmount, expectedDecimalsResult));

      // Verifications
      verify(mockedContract.getLockUp).once();
      verify(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('getAllLockUpData', () => {
    test('should call to getAllLockupData', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      const expectedNames = stringArrayToBytes32Array(['Lockup1', 'Lockup2']);
      const expectedLockupAmount = valueToWei(new BigNumber(50), expectedDecimalsResult);
      const startTime = new Date(2030, 1);
      const expectedStartTime = dateToBigNumber(startTime);
      const expectedLockUpPeriodSeconds = new BigNumber(3600);
      const expectedReleaseFrequencySeconds = new BigNumber(60);
      const expectedUnlockedAmount = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const expectedResult = [
        expectedNames,
        [expectedLockupAmount, expectedLockupAmount],
        [expectedStartTime, expectedStartTime],
        [expectedLockUpPeriodSeconds, expectedLockUpPeriodSeconds],
        [expectedReleaseFrequencySeconds, expectedReleaseFrequencySeconds],
        [expectedUnlockedAmount, expectedUnlockedAmount],
      ];

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllLockupData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllLockupData();
      // Result expectation
      for (let i = 0; i < result.length; i += 1) {
        expect(result[i].lockupName).toEqual(bytes32ToString(expectedNames[i]));
        expect(result[i].lockupAmount).toEqual(weiToValue(expectedLockupAmount, expectedDecimalsResult));
        expect(result[i].startTime).toEqual(startTime);
        expect(result[i].lockUpPeriodSeconds).toBe(expectedResult[3][i]);
        expect(result[i].releaseFrequencySeconds).toBe(expectedResult[4][i]);
        expect(result[i].unlockedAmount).toEqual(weiToValue(expectedUnlockedAmount, expectedDecimalsResult));
      }

      // Verifications
      verify(mockedContract.getAllLockupData).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('getListOfAddresses', () => {
    test.todo('should fail as lockup name is an empty string');

    test('should call to getListOfAddresses', async () => {
      const expectedResult = [
        '0x8888888888888888888888888888888888888888',
        '0x9999999999999999999999999999999999999999',
      ];
      const mockedParams = {
        lockupName: 'LockupDetails',
      };

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getListOfAddresses).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getListOfAddresses(mockedParams);
      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.getListOfAddresses).once();
      verify(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).once();
    });
  });

  describe('getAllLockups', () => {
    test('should call to getAllLockups', async () => {
      const expectedResult = stringArrayToBytes32Array(['Lock1', 'Lock2']);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllLockups).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllLockups();
      // Result expectation
      expect(result).toEqual(bytes32ArrayToStringArray(expectedResult));

      // Verifications
      verify(mockedContract.getAllLockups).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getLockupsNamesToUser', () => {
    test('should call to getLockupsNamesToUser', async () => {
      const expectedResult = stringArrayToBytes32Array(['Lock1', 'Lock2']);
      const mockedParams = {
        user: '0x8888888888888888888888888888888888888888',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockupsNamesToUser).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.user)).thenResolve(expectedResult);

      // Real call
      const result = await target.getLockupsNamesToUser(mockedParams);
      // Result expectation
      expect(result).toEqual(bytes32ArrayToStringArray(expectedResult));

      // Verifications
      verify(mockedContract.getLockupsNamesToUser).once();
      verify(mockedMethod.callAsync(mockedParams.user)).once();
    });
  });

  describe('getLockedTokenToUser', () => {
    test('should call to getLockedTokenToUser', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      const expectedResult = new BigNumber(100);
      const mockedParams = {
        user: '0x8888888888888888888888888888888888888888',
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockedTokenToUser).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.user)).thenResolve(expectedResult);

      // Real call
      const result = await target.getLockedTokenToUser(mockedParams);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));

      // Verifications
      verify(mockedContract.getLockedTokenToUser).once();
      verify(mockedMethod.callAsync(mockedParams.user)).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('getTokensByPartition', () => {
    test('should call to getTokensByPartition', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      const expectedResult = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const mockedParams = {
        partition: Partition.Unlocked,
        tokenHolder: '0x8888888888888888888888888888888888888888',
        additionalBalance: new BigNumber(10),
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTokensByPartition).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          mockedParams.partition,
          mockedParams.tokenHolder,
          objectContaining(valueToWei(mockedParams.additionalBalance, expectedDecimalsResult)),
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.getTokensByPartition(mockedParams);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));

      // Verifications
      verify(mockedContract.getTokensByPartition).once();
      verify(
        mockedMethod.callAsync(
          mockedParams.partition,
          mockedParams.tokenHolder,
          objectContaining(valueToWei(mockedParams.additionalBalance, expectedDecimalsResult)),
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('getPermissions', () => {
    test('should call to getPermissions', async () => {
      const expectedResult = stringArrayToBytes32Array([Perm.Admin]);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getPermissions).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getPermissions();
      // Result expectation
      expect(result).toEqual(expectedResult.map(parsePermBytes32Value));
      // Verifications
      verify(mockedContract.getPermissions).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('addNewLockUpType', () => {
    test('should call addNewLockUpType', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const lockupName = 'Lockup1';
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(0), expectedDecimalsResult);
      const expectedStartTime = new BigNumber(0);
      const expectedLockUpPeriodSeconds = new BigNumber(0);
      const expectedReleaseFrequencySeconds = new BigNumber(0);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedGetLockupParams = {
        lockupName,
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));
      // Stub the request
      when(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).thenResolve(expectedGetLockupResult);

      const mockedParams = {
        lockupAmount: new BigNumber(100),
        startTime: new Date(2030, 1),
        lockUpPeriodSeconds: new BigNumber(3600),
        releaseFrequenciesSeconds: new BigNumber(60),
        lockupName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addNewLockUpType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.lockupAmount, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(mockedParams.lockUpPeriodSeconds),
          objectContaining(mockedParams.releaseFrequenciesSeconds),
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addNewLockUpType(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addNewLockUpType).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.lockupAmount, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(mockedParams.lockUpPeriodSeconds),
          objectContaining(mockedParams.releaseFrequenciesSeconds),
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).thrice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).thrice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thrice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).once();
      verify(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).once();
    });
  });

  describe('addNewLockUpTypeMulti', () => {
    test('should call addNewLockUpTypeMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const lockupNames = ['Lockup1', 'Lockup2'];
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(0), expectedDecimalsResult);
      const expectedStartTime = new BigNumber(0);
      const expectedLockUpPeriodSeconds = new BigNumber(0);
      const expectedReleaseFrequencySeconds = new BigNumber(0);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedGetLockupParams = {
        lockupNames,
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));
      // Stub the request
      for(let i=0; i<lockupNames.length; i+=1) {
        when(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).thenResolve(
          expectedGetLockupResult,
        );
      }

      const mockedParams = {
        lockupAmounts: [new BigNumber(100), new BigNumber(200)],
        startTimes: [new Date(2030, 1), new Date(2030, 1)],
        lockUpPeriodSeconds: [new BigNumber(3600), new BigNumber(3600)],
        releaseFrequenciesSeconds: [new BigNumber(60), new BigNumber(60)],
        lockupNames,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addNewLockUpTypeMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueArrayToWeiArray(mockedParams.lockupAmounts, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(mockedParams.lockUpPeriodSeconds),
          objectContaining(mockedParams.releaseFrequenciesSeconds),
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addNewLockUpTypeMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addNewLockUpTypeMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueArrayToWeiArray(mockedParams.lockupAmounts, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(mockedParams.lockUpPeriodSeconds),
          objectContaining(mockedParams.releaseFrequenciesSeconds),
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(4);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(4);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(4);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).times(mockedGetLockupParams.lockupNames.length);
      for(let i=0; i<lockupNames.length; i+=1) {
        verify(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).once();
      }
    });
  });

  describe('verifyTransfer', () => {
    test('should verify Transfer', async () => {
      const statusCode = new BigNumber(2);
      const expectedResult = [statusCode, '0x1111111111111111111111111111111111111111'];
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      const mockedParams = {
        from: '0x1111111111111111111111111111111111111111',
        to: '0x2222222222222222222222222222222222222222',
        amount: new BigNumber(10),
        data: 'Data',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.verifyTransfer).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.data,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.verifyTransfer(mockedParams);

      // Result expectation
      expect(result.transferResult).toBe(statusCode.toNumber());
      expect(result.address).toBe(expectedResult[1]);
      // Verifications
      verify(mockedContract.verifyTransfer).once();
      verify(
        mockedMethod.callAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.data,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to LockUpTransferManager', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: PolyTokenEvents.Transfer,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'AddLockUpToUser', 'RemoveLockUpFromUser', 'ModifyLockUpType', 'AddNewLockUpType', 'RemoveLockUpType', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});
