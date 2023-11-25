import _ from 'lodash'

import React from 'react'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { codec } from '@h0ngcha0/web3'

interface TransactionRawComponentProps {
  txRaw: string
}

export const TransactionRawComponent: React.FunctionComponent<TransactionRawComponentProps> = (props) => {
  const { txRaw } = props
  const { script, compactSignedIntCodec, inputCodec, ArrayCodec, assetOutput, contractOutputRefCodec, EitherCodec, contractOutput, signatureCodec } = codec
  const inputsCodes = new ArrayCodec(inputCodec)
  const assetOutputsCodec = new ArrayCodec(assetOutput.assetOutputCodec)
  const contractOutputRefsCodec = new ArrayCodec(contractOutputRefCodec)
  const { scriptCodec } = script
  const decoded: codec.Transaction = codec.transactionCodec.decode(Buffer.from(txRaw, 'hex'))
  const outputCodec = new EitherCodec(assetOutput.assetOutputCodec, contractOutput.contractOutputCodec)
  const outputsCodec = new ArrayCodec(outputCodec)
  const signaturesCodec = new ArrayCodec(signatureCodec)

  return txRaw ? (
    <div style={{ maxWidth: '480px', textAlign: 'left', marginTop: '20px', wordWrap: 'break-word' }}>
      <Typography variant="body2">
        <Tooltip title="Version" arrow>
          <span className="TxVersion">{byteToString(decoded.unsigned.version)}</span>
        </Tooltip>
        <Tooltip title="NetworkId" arrow>
          <span className="NetworkId">{byteToString(decoded.unsigned.networkId)}</span>
        </Tooltip>
        <Tooltip title="StatefulScriptOption" arrow>
          <span className="StatefulScriptOption">{byteToString(decoded.unsigned.statefulScript.option)}</span>
        </Tooltip>
        {
          decoded.unsigned.statefulScript.option !== 0 ? (
            <Tooltip title="StatefulScriptValue" arrow>
              <span className="StatefulScriptValue">
                {encodeToString(scriptCodec, decoded.unsigned.statefulScript.value!)}
              </span>
            </Tooltip>
          ) : undefined
        }
        <Tooltip title="GasAmount" arrow>
          <span className="GasAmount">{encodeToString(compactSignedIntCodec, decoded.unsigned.gasAmount)}</span>
        </Tooltip>
        <Tooltip title="GasPrice" arrow>
          <span className="GasPrice">{encodeToString(compactSignedIntCodec, decoded.unsigned.gasPrice)}</span>
        </Tooltip>
        <Tooltip title="Inputs" arrow>
          <span className="Inputs">{encodeToString(inputsCodes, decoded.unsigned.inputs.value)}</span>
        </Tooltip>
        <Tooltip title="FixedOutputs" arrow>
          <span className="FixedOutputs">{encodeToString(assetOutputsCodec, decoded.unsigned.fixedOutputs.value)}</span>
        </Tooltip>
        <Tooltip title="ScriptExecutionOk" arrow>
          <span className="ScriptExecutionOk">{byteToString(decoded.scriptExecutionOk)}</span>
        </Tooltip>
        <Tooltip title="ContractInputs" arrow>
          <span className="ContractInputs">{encodeToString(contractOutputRefsCodec, decoded.contractInputs.value)}</span>
        </Tooltip>
        <Tooltip title="GeneratedOutput" arrow>
          <span className="GeneratedOutput">{encodeToString(outputsCodec, decoded.generatedOutputs.value)}</span>
        </Tooltip>
        <Tooltip title="InputSignatures" arrow>
          <span className="InputSignatures">{encodeToString(signaturesCodec, decoded.inputSignatures.value)}</span>
        </Tooltip>
        <Tooltip title="ScriptSignatures" arrow>
          <span className="ScriptSignatures">{encodeToString(signaturesCodec, decoded.scriptSignatures.value)}</span>
        </Tooltip>
      </Typography>
      {/*
      <Typography variant="body2">
        <Tooltip title="Version" arrow>
          <span className="TxVersion">{txRaw.version}</span>
        </Tooltip>
        {txRaw.flag ? (
          <Tooltip title="Flag" arrow>
            <span className="TxFlag">{txRaw.flag}</span>
          </Tooltip>
        ) : undefined}
        {
          <Tooltip title="Number of transaction inputs" arrow>
            <span className="TxListCount">{txRaw.txIns.count}</span>
          </Tooltip>
        }
        {_.map(txRaw.txIns.txIns, (txIn, index) => {
          return (
            <span>
              <Tooltip title={`Spent transaction id for input ${index}`} arrow>
                <span className="TxInputPreviousTxId">{txIn.previousOutput.hash}</span>
              </Tooltip>
              <Tooltip title={`Spent transaction output index for input ${index}`} arrow>
                <span className="TxInputPreviousTxOutput">{txIn.previousOutput.index}</span>
              </Tooltip>
              <Tooltip title={`Unlocking script for input ${index}`} arrow>
                <span className="TxInputUnLockingScript">{txIn.sigScript}</span>
              </Tooltip>
              <Tooltip title={`Sequence number for input ${index}`} arrow>
                <span className="TxInputSequence">{txIn.sequence}</span>
              </Tooltip>
            </span>
          )
        })}
        {
          <Tooltip title="Number of transaction outputs" arrow>
            <span className="TxListCount">{txRaw.txOuts.count}</span>
          </Tooltip>
        }
        {_.map(txRaw.txOuts.txOuts, (txOut, index) => {
          return (
            <span>
              <Tooltip title={`Value of output ${index}`} arrow>
                <span className="TxOutputValue">{txOut.value}</span>
              </Tooltip>
              <Tooltip title={`Locking script for output ${index}`} arrow>
                <span className="TxOutputLockingScript">{txOut.pkScript}</span>
              </Tooltip>
            </span>
          )
        })}
        {_.map(txRaw.txWitnesses, (txWitnesses, inputIndex) => {
          return (
            <span>
              <Tooltip title={`Number of witnesses for input ${inputIndex}`} arrow>
                <span className="TxListCount">{txWitnesses.count}</span>
              </Tooltip>
              {_.flatMap(txWitnesses.txWitnesses, (txWitness, witnessIndex) => {
                return (
                  <Tooltip title={`Witness ${witnessIndex} for input ${inputIndex}`} arrow>
                    <span className={`TxWitness${witnessIndex % 2}`}>{txWitness.witness}</span>
                  </Tooltip>
                )
              })}
            </span>
          )
        })}
        {
          <Tooltip title="Locking time" arrow>
            <span className="TxLockTime">{txRaw.lockTime}</span>
          </Tooltip>
        }
      </Typography>
      */}
    </div>
  ) : (
    <div> Transaction raw data not available </div>
  )
}

function byteToString(input: number) {
  return Buffer.from([input]).toString('hex')
}

function encodeToString<T>(codec: codec.Codec<T>, input: T) {
  return codec.encode(input).toString('hex')
}

export default TransactionRawComponent
