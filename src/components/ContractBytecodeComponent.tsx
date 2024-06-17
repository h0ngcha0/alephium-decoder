import React from 'react'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { binToHex, codec, hexToBinUnsafe } from '@alephium/web3'
import { Paper } from '@mui/material'
import { getInstrName, byteToString, encodeToString } from '../services/utils'

interface ContractBytecodeComponentProps {
  bytecode: string
  breakDown: boolean
}

export const ContractBytecodeComponent: React.FunctionComponent<ContractBytecodeComponentProps> = (props) => {
  const { bytecode, breakDown } = props
  const { compactSignedIntCodec, compactUnsignedIntCodec, ArrayCodec, contract } = codec
  const decodedContract = contract.contractCodec.decode(hexToBinUnsafe(bytecode))
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
          The number of fields in this contract, in this case <b>{compactSignedIntCodec.toI32(decodedContract.fieldLength)}</b>.
        </div>
        <br />
        <b>Method Indexes</b>
        <br />
        <Tooltip title="MethodIndexes" arrow>
          <span className="MethodIndexes">{encodeToString(compactUnsignedIntsCodec, decodedContract.methodIndexes.value)}</span>
        </Tooltip>
        <div>
          Encoded method indexes. For efficiency reasons, all methods are encoded in a single byte array. The method index <b>n</b> indicates the ending offset of method <b>n</b> in this byte array.
          The initial bytes <span className="NetworkId">{encodeToString(compactUnsignedIntCodec, decodedContract.methodIndexes.length)}</span> represent the number of method indexes (in this case <b>{compactSignedIntCodec.toI32(decodedContract.methodIndexes.length)}</b>). All method indexes are shown below:
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
  const { compactSignedIntCodec } = codec
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
                      <span className={"NetworkId"}>{encodeToString(compactSignedIntCodec, input)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {compactSignedIntCodec.toI32(input)}
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
  const methodIndexes = halfDecoded.methodIndexes.value.map((v) => codec.compactSignedIntCodec.toI32(v))
  const methods: Uint8Array[] = []
  for (let i = 0, start = 0; i < methodIndexes.length; i++) {
    const end = methodIndexes[i]
    const method = halfDecoded.methods.slice(start, end)
    methods.push(method)
    start = end
  }

  return methods
}

function showRawMethods(rawMethods: Uint8Array[]) {
  return (
    <>
      {
        rawMethods.map((rawMethod, index) => {
          return (
            <Tooltip title={`Method ${index}`} key={index} arrow >
              <span className={`Method${index % 5}`}>{binToHex(rawMethod)}</span>
            </Tooltip>
          )
        })
      }
    </>
  )
}

function showMethodsDetails(halfDecoded: codec.contract.HalfDecodedContract, rawMethods0?: Uint8Array[]) {
  const rawMethods = rawMethods0 ?? getRawMethods(halfDecoded)

  return (
    <>
      {
        showRawMethods(rawMethods)
      }
      <div>
        All methods in this contract are encoded in a single byte array, seperated by method indexes. This contract has <b>{codec.compactSignedIntCodec.toI32(halfDecoded.methodIndexes.length)}</b> methods. Each method consists a set of instructions, as shown below:
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
        instrs.map((instr) => {
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

export default ContractBytecodeComponent
