import _ from 'lodash'
import React from 'react'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { codec } from '@alephium/web3'
import { Paper } from '@mui/material'

interface ContractBytecodeComponentProps {
  bytecode: string
  breakDown: boolean
}

export const ContractBytecodeComponent: React.FunctionComponent<ContractBytecodeComponentProps> = (props) => {
  const { bytecode, breakDown } = props
  const { compactSignedIntCodec, compactUnsignedIntCodec, ArrayCodec, contract } = codec
  const decodedContract = contract.contractCodec.decode(Buffer.from(bytecode, 'hex'))
  const compactUnsignedIntsCodec = new ArrayCodec(compactUnsignedIntCodec)
  const rawMethods = getRawMethods(decodedContract)

  return breakDown === false ? (
    <div style={{ maxWidth: '480px', textAlign: 'left', marginTop: '20px', wordWrap: 'break-word' }}>
      <Typography variant="body2">
        <Tooltip title="FieldLength" arrow>
          <span className="TxVersion">{encodeToString(compactSignedIntCodec, decodedContract.fieldLength)}</span>
        </Tooltip>
        <Tooltip title="MethodIndexes" arrow>
          <span className="NetworkId">{encodeToString(compactUnsignedIntsCodec, decodedContract.methodIndexes.value)}</span>
        </Tooltip>
        {
          showRawMethods(rawMethods)
        }
      </Typography>
      <br />
    </div>
  ) : (
    <div style={{ maxWidth: '480px', textAlign: 'left', marginTop: '20px', wordWrap: 'break-word' }}>
      <Typography variant="body2">
        <b>Field Length</b>
        <br />
        <Tooltip title="FieldLength" arrow>
          <span className="FieldLength">{encodeToString(compactSignedIntCodec, decodedContract.fieldLength)}</span>
        </Tooltip>
        <div>
          The number of fields in this contract, in this case <b>{compactUnsignedIntCodec.toU32(decodedContract.fieldLength)}</b>.
        </div>
        <br />
        <b>Method Indexes</b>
        <br />
        <Tooltip title="MethodIndexes" arrow>
          <span className="MethodIndexes">{encodeToString(compactUnsignedIntsCodec, decodedContract.methodIndexes.value)}</span>
        </Tooltip>
        <div>
          Encoded method indexes. For efficiency reasons, all methods are encoded in a single byte array. The method index <b>n</b> indicates the ending offset of method <b>n</b> in this byte array.
          The initial bytes <span className="NetworkId">{encodeToString(compactUnsignedIntCodec, decodedContract.methodIndexes.length)}</span> represent the number of method indexes (in this case <b>{compactUnsignedIntCodec.toU32(decodedContract.methodIndexes.length)}</b>). All method indexes are shown below:
        </div>
        <br />
        {
          showMethodIndexes(decodedContract.methodIndexes.value)
        }
        <br />
        <b>Methods</b>
        <br />
        {
          showMethodsDetails(decodedContract, rawMethods)
        }
      </Typography>
    </div>
  )
}

function showMethodIndexes(inputs: codec.DecodedCompactInt[]) {
  const { compactUnsignedIntCodec } = codec
  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead sx={{ bgcolor: 'grey.300' }}>
            <TableCell>Method</TableCell>
            <TableCell>Encoded Index</TableCell>
            <TableCell>Decoded Index</TableCell>
          </TableHead>
          {
            inputs.map((input, index) => {
              return (
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={index}>
                  <TableCell>
                    {index}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={"MethodIndex"} arrow>
                      <span className={"NetworkId"}>{encodeToString(compactUnsignedIntCodec, input)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {compactUnsignedIntCodec.toU32(input)}
                  </TableCell>
                </TableRow>
              )
            })
          }
        </Table>
      </TableContainer>
    </>
  )
}

function getRawMethods(halfDecoded: codec.contract.HalfDecodedContract) {
  const methodIndexes = halfDecoded.methodIndexes.value.map((v) => codec.compactUnsignedIntCodec.toU32(v))
  const methods: Buffer[] = []
  for (let i = 0, start = 0; i < methodIndexes.length; i++) {
    const end = methodIndexes[i]
    const method = halfDecoded.methods.slice(start, end)
    methods.push(method)
    start = end
  }

  return methods
}

function showRawMethods(rawMethods: Buffer[]) {
  return (
    <>
      {
        rawMethods.map((rawMethod, index) => {
          return (
            <Tooltip title={`Method ${index}`} key={index} arrow >
              <span className={`Method${index % 5}`}>{rawMethod.toString('hex')}</span>
            </Tooltip>
          )
        })
      }
    </>
  )
}

function showMethodsDetails(halfDecoded: codec.contract.HalfDecodedContract, rawMethods0?: Buffer[]) {
  const rawMethods = rawMethods0 ?? getRawMethods(halfDecoded)

  return (
    <>
      {
        showRawMethods(rawMethods)
      }
      <div>
        All methods in this contract are encoded in a single byte array, seperated by method indexes. This contract has <b>{codec.compactUnsignedIntCodec.toU32(halfDecoded.methodIndexes.length)}</b> methods. Each method consists a set of instructions, as shown below:
      </div>
      <br />

      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead sx={{ bgcolor: 'grey.300' }}>
            <TableCell>Method</TableCell>
            <TableCell>Instructions</TableCell>
          </TableHead>
          {
            rawMethods.map((rawMethod, index) => {
              const method = codec.methodCodec.decode(rawMethod)
              return (
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={index}>
                  <TableCell>
                    {index}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <Tooltip title={"isPublic"} arrow>
                      <span className={`isPublic`}>{byteToString(method.isPublic)}</span>
                    </Tooltip>
                    <Tooltip title={"assetModifier"} arrow>
                      <span className={`assetModifier`}>{byteToString(method.assetModifier)}</span>
                    </Tooltip>
                    <Tooltip title={"argsLength"} arrow>
                      <span className={`argsLength`}>{encodeToString(codec.compactSignedIntCodec, method.argsLength)}</span>
                    </Tooltip>
                    <Tooltip title={"localsLength"} arrow>
                      <span className={`localsLength`}>{encodeToString(codec.compactSignedIntCodec, method.localsLength)}</span>
                    </Tooltip>
                    <Tooltip title={"returnsLength"} arrow>
                      <span className={`returnsLength`}>{encodeToString(codec.compactSignedIntCodec, method.returnLength)}</span>
                    </Tooltip>
                    <Tooltip title={"InstrsLength"} arrow>
                      <span className={`InstrsLength`}>{encodeToString(codec.compactSignedIntCodec, method.instrs.length)}</span>
                    </Tooltip>
                    {
                      showInstrs(method.instrs.value)
                    }
                  </TableCell>
                </TableRow>
              )
            })
          }
        </Table>
      </TableContainer>
    </>
  )
}

function showInstrs(instrs: codec.Instr[]) {
  return (
    <>
      {
        instrs.map((instr, index) => {
          console.log("instr.code", instr.code)
          const instrName = getInstrName(instr.code)
          console.log("instrName", instrName)
          return (
            <>
              <Tooltip title={`${instrName}`} arrow>
                <span className={`${instrName}`}>{encodeToString(codec.instrCodec, instr)}</span>
              </Tooltip>
            </>
          )
        })
      }
    </>
  )
}

function byteToString(input: number): string {
  return Buffer.from([input]).toString('hex')
}

function encodeToString<T>(codec: codec.Codec<T>, input: T) {
  return codec.encode(input).toString('hex')
}

function getInstrName(code: number): string | undefined {
  const instrsToName: { [code: string]: string } = {
    '0x00': 'CallLocal',
    '0x01': 'CallExternal',
    '0x02': 'Return',
    '0x03': 'ConstTrue',
    '0x04': 'ConstFalse',
    '0x05': 'I256Const0',
    '0x06': 'I256Const1',
    '0x07': 'I256Const2',
    '0x08': 'I256Const3',
    '0x09': 'I256Const4',
    '0x0a': 'I256Const5',
    '0x0b': 'I256ConstN1',
    '0x0c': 'U256Const0',
    '0x0d': 'U256Const1',
    '0x0e': 'U256Const2',
    '0x0f': 'U256Const3',
    '0x10': 'U256Const4',
    '0x11': 'U256Const5',
    '0x12': 'I256Const',
    '0x13': 'U256Const',
    '0x14': 'ByteConst',
    '0x15': 'AddressConst',
    '0x16': 'LoadLocal',
    '0x17': 'StoreLocal',
    '0x18': 'Pop',
    '0x19': 'BoolNot',
    '0x1a': 'BoolAnd',
    '0x1b': 'BoolOr',
    '0x1c': 'BoolEq',
    '0x1d': 'BoolNeq',
    '0x1e': 'BoolToByteVec',
    '0x1f': 'I256Add',
    '0x20': 'I256Sub',
    '0x21': 'I256Mul',
    '0x22': 'I256Div',
    '0x23': 'I256Mod',
    '0x24': 'I256Eq',
    '0x25': 'I256Neq',
    '0x26': 'I256Lt',
    '0x27': 'I256Le',
    '0x28': 'I256Gt',
    '0x29': 'I256Ge',
    '0x2a': 'U256Add',
    '0x2b': 'U256Sub',
    '0x2c': 'U256Mul',
    '0x2d': 'U256Div',
    '0x2e': 'U256Mod',
    '0x2f': 'U256Eq',
    '0x30': 'U256Neq',
    '0x31': 'U256Lt',
    '0x32': 'U256Le',
    '0x33': 'U256Gt',
    '0x34': 'U256Ge',
    '0x35': 'U256ModAdd',
    '0x36': 'U256ModSub',
    '0x37': 'U256ModMul',
    '0x38': 'U256BitAnd',
    '0x39': 'U256BitOr',
    '0x3a': 'U256Xor',
    '0x3b': 'U256SHL',
    '0x3c': 'U256SHR',
    '0x3d': 'I256ToU256',
    '0x3e': 'I256ToByteVec',
    '0x3f': 'U256ToI256',
    '0x40': 'U256ToByteVec',
    '0x41': 'ByteVecEq',
    '0x42': 'ByteVecNeq',
    '0x43': 'ByteVecSize',
    '0x44': 'ByteVecConcat',
    '0x45': 'AddressEq',
    '0x46': 'AddressNeq',
    '0x47': 'AddressToByteVec',
    '0x48': 'IsAssetAddress',
    '0x49': 'IsContractAddress',
    '0x4a': 'Jump',
    '0x4b': 'IfTrue',
    '0x4c': 'IfFalse',
    '0x4d': 'Assert',
    '0x4e': 'Blake2b',
    '0x4f': 'Keccak256',
    '0x50': 'Sha256',
    '0x51': 'Sha3',
    '0x52': 'VerifyTxSignature',
    '0x53': 'VerifySecP256K1',
    '0x54': 'VerifyED25519',
    '0x55': 'NetworkId',
    '0x56': 'BlockTimeStamp',
    '0x57': 'BlockTarget',
    '0x58': 'TxId',
    '0x59': 'TxInputAddressAt',
    '0x5a': 'TxInputsSize',
    '0x5b': 'VerifyAbsoluteLocktime',
    '0x5c': 'VerifyRelativeLocktime',
    '0x5d': 'Log1',
    '0x5e': 'Log2',
    '0x5f': 'Log3',
    '0x60': 'Log4',
    '0x61': 'Log5',
    '0x62': 'ByteVecSlice',
    '0x63': 'ByteVecToAddress',
    '0x64': 'Encode',
    '0x65': 'Zeros',
    '0x66': 'U256To1Byte',
    '0x67': 'U256To2Byte',
    '0x68': 'U256To4Byte',
    '0x69': 'U256To8Byte',
    '0x6a': 'U256To16Byte',
    '0x6b': 'U256To32Byte',
    '0x6c': 'U256From1Byte',
    '0x6d': 'U256From2Byte',
    '0x6e': 'U256From4Byte',
    '0x6f': 'U256From8Byte',
    '0x70': 'U256From16Byte',
    '0x71': 'U256From32Byte',
    '0x72': 'EthEcRecover',
    '0x73': 'Log6',
    '0x74': 'Log7',
    '0x75': 'Log8',
    '0x76': 'Log9',
    '0x77': 'ContractIdToAddress',
    '0x78': 'LoadLocalByIndex',
    '0x79': 'StoreLocalByIndex',
    '0x7a': 'Dup',
    '0x7b': 'AssertWithErrorCode',
    '0x7c': 'Swap',
    '0x7d': 'BlockHash',
    '0x7e': 'DEBUG',
    '0x7f': 'TxGasPrice',
    '0x80': 'TxGasAmount',
    '0x81': 'TxGasFee',
    '0x82': 'I256Exp',
    '0x83': 'U256Exp',
    '0x84': 'U256ModExp',
    '0x85': 'VerifyBIP340Schnorr',
    '0x86': 'GetSegragatedSignature',
    '0x87': 'MulModN',
    '0x88': 'AddModN',
    '0x89': 'U256ToString',
    '0x8a': 'I256ToString',
    '0x8b': 'BoolToString',
    '0x8c': 'BoolToString',
    '0xa0': 'LoadMutField',
    '0xa1': 'StoreMutField',
    '0xa2': 'ApproveAlph',
    '0xa3': 'ApproveToken',
    '0xa4': 'AlphRemaining',
    '0xa5': 'TokenRemaining',
    '0xa6': 'IsPaying',
    '0xa7': 'TransferAlph',
    '0xa8': 'TransferAlphFromSelf',
    '0xa9': 'TransferAlphToSelf',
    '0xaa': 'TransferToken',
    '0xab': 'TransferTokenFromSelf',
    '0xac': 'TransferTokenToSelf',
    '0xad': 'CreateContract',
    '0xae': 'CreateContractWithToken',
    '0xaf': 'CopyCreateContract',
    '0xb0': 'DestroySelf',
    '0xb1': 'SelfContractId',
    '0xb2': 'SelfAddress',
    '0xb3': 'CallerContractId',
    '0xb4': 'CallerAddress',
    '0xb5': 'IsCallerFromTxScript',
    '0xb6': 'CallerInitialStateHash',
    '0xb7': 'CallerCodeHash',
    '0xb8': 'ContractInitialStateHash',
    '0xb9': 'ContractInitialCodeHash',
    '0xba': 'MigrateSimple',
    '0xbb': 'MigrateWithFields',
    '0xbc': 'CopyCreateContractWithToken',
    '0xbd': 'BurnToken',
    '0xbe': 'LockApprovedAssets',
    '0xbf': 'CreateSubContract',
    '0xc0': 'CreateSubContractWithToken',
    '0xc1': 'CopyCreateSubContract',
    '0xc2': 'CopyCreateSubContractWithToken',
    '0xc3': 'LoadMutFieldByIndex',
    '0xc4': 'StoreMutFieldByIndex',
    '0xc5': 'ContractExists',
    '0xc6': 'CreateContractAndTransferToken',
    '0xc7': 'CopyCreateContractAndTransferToken',
    '0xc8': 'CreateSubContractAndTransferToken',
    '0xc9': 'CopyCreateSubContractAndTransferToken',
    '0xca': 'NullContractAddress',
    '0xcb': 'SubContractId',
    '0xcc': 'SubContractIdOf',
    '0xcd': 'AlphTokenId',
    '0xce': 'LoadImmField',
    '0xcf': 'LoadImmFieldByIndex'
  }

  const instrKey = byteToString(code)
  return instrsToName[`0x${instrKey}`]
}

export default ContractBytecodeComponent
