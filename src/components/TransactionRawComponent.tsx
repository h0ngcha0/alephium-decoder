import React from 'react'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { binToHex, codec } from '@alephium/web3'
import { byteToString, encodeAssetModifier, encodeToString } from '../services/utils'

interface TransactionRawComponentProps {
  decoded: codec.Transaction
  breakDown: boolean
}

export const TransactionRawComponent: React.FunctionComponent<TransactionRawComponentProps> = (props) => {
  const { decoded, breakDown } = props
  const { script, inputCodec, ArrayCodec, assetOutput, contractOutput, signatureCodec, either, u256Codec, i32Codec } = codec
  const inputsCodes = new ArrayCodec(inputCodec)
  const { scriptCodec } = script
  const outputCodec = either('output', assetOutput.assetOutputCodec, contractOutput.contractOutputCodec)
  const outputsCodec = new ArrayCodec(outputCodec)
  const signaturesCodec = new ArrayCodec(signatureCodec)

  return breakDown === false ? (
    <div style={{ maxWidth: '600px', textAlign: 'left', marginTop: '20px', wordWrap: 'break-word' }}>
      <Typography variant="body2">
        <Tooltip title="Version" arrow>
          <span className="TxVersion">{byteToString(decoded.unsigned.version)}</span>
        </Tooltip>
        <Tooltip title="NetworkId" arrow>
          <span className="NetworkId">{byteToString(decoded.unsigned.networkId)}</span>
        </Tooltip>
        <Tooltip title="StatefulScriptOption" arrow>
          <span className="StatefulScriptOption">{byteToString(decoded.unsigned.statefulScript.kind === 'Some' ? 1 : 0)}</span>
        </Tooltip>
        {
          showScript(decoded, scriptCodec)
        }
        <Tooltip title="GasAmount" arrow>
          <span className="GasAmount">{encodeToString(u256Codec, BigInt(decoded.unsigned.gasAmount))}</span>
        </Tooltip>
        <Tooltip title="GasPrice" arrow>
          <span className="GasPrice">{encodeToString(u256Codec, decoded.unsigned.gasPrice)}</span>
        </Tooltip>
        <Tooltip title="Inputs" arrow>
          <span className="Inputs">{encodeToString(inputsCodes, decoded.unsigned.inputs)}</span>
        </Tooltip>
        <Tooltip title="FixedOutputs" arrow>
          <span className="FixedOutputs">{encodeToString(assetOutput.assetOutputsCodec, decoded.unsigned.fixedOutputs)}</span>
        </Tooltip>
        <Tooltip title="ScriptExecutionOk" arrow>
          <span className="ScriptExecutionOk">{byteToString(decoded.scriptExecutionOk)}</span>
        </Tooltip>
        <Tooltip title="ContractInputs" arrow>
          <span className="ContractInputs">{encodeToString(codec.contractOutputRefsCodec, decoded.contractInputs)}</span>
        </Tooltip>
        <Tooltip title="GeneratedOutput" arrow>
          <span className="GeneratedOutput">{encodeToString(outputsCodec, decoded.generatedOutputs)}</span>
        </Tooltip>
        <Tooltip title="InputSignatures" arrow>
          <span className="InputSignatures">{encodeToString(signaturesCodec, decoded.inputSignatures)}</span>
        </Tooltip>
        <Tooltip title="ScriptSignatures" arrow>
          <span className="ScriptSignatures">{encodeToString(signaturesCodec, decoded.scriptSignatures)}</span>
        </Tooltip>
      </Typography>
      <br />
    </div >
  ) : (
    <div style={{ maxWidth: '600px', textAlign: 'left', marginTop: '20px', wordWrap: 'break-word' }}>
      <Typography variant="body2">
        <b>Version Number</b>
        <br />
        <Tooltip title="Version" arrow>
          <span className="TxVersion">{byteToString(decoded.unsigned.version)}</span>
        </Tooltip>
        <br /><br />
        <b>Network ID</b>
        <br />
        <Tooltip title="NetworkId" arrow>
          <span className="NetworkId">{byteToString(decoded.unsigned.networkId)}</span>
        </Tooltip>
        <div> <u>00</u> means Mainnet, <u>01</u> means Testnet and <u>02</u> means Devnet </div>
        <br />
        <b>Tx Script Option</b>
        <br />
        <Tooltip title="StatefulScriptOption" arrow>
          <span className="StatefulScriptOption">{byteToString(decoded.unsigned.statefulScript.kind === 'Some' ? 1 : 0)}</span>
        </Tooltip>
        <div> <u>00</u> means without Tx Script, <u>01</u> means with Tx Script </div>
        <br />
        {
          decoded.unsigned.statefulScript.kind !== 'None' ? (
            <>
              <b>Tx Script</b>
              <br />
              {showScript(decoded, scriptCodec)}
              <div>
                Encoded TxScript, the initial bytes <span className="StatefulScriptValue">{encodeToString(i32Codec, decoded.unsigned.statefulScript.value!.methods.length)}</span> represent the number of method(s).
                Each of the method encoding is displayed below with more details (hover to see instructions):
                <br />
                {
                  showMethods(decoded.unsigned.statefulScript.value!)
                }
              </div>
            </>
          ) : undefined
        }
        <br />
        <b>Gas Amount</b>
        <br />
        <Tooltip title="GasAmount" arrow>
          <span className="GasAmount">{encodeToString(u256Codec, BigInt(decoded.unsigned.gasAmount))}</span>
        </Tooltip>
        <div> Encoded gas amount, which is <u>{decoded.unsigned.gasAmount}</u> in decimal</div>
        <br />
        <b>Gas Price</b>
        <br />
        <Tooltip title="GasPrice" arrow>
          <span className="GasPrice">{encodeToString(u256Codec, decoded.unsigned.gasPrice)}</span>
        </Tooltip>
        <div> Encoded gas price, which is <u>{decoded.unsigned.gasPrice.toString()}</u> in decimal</div>
        <br />
        <b>Inputs</b>
        <br />
        <Tooltip title="Inputs" arrow>
          <span className="Inputs">{encodeToString(inputsCodes, decoded.unsigned.inputs)}</span>
        </Tooltip>
        <div>
          Encoded inputs, the initial bytes <span className="Inputs">{encodeToString(i32Codec, decoded.unsigned.inputs.length)}</span> represent the number of input(s).
          Each of the input encoding is displayed below with more details:
        </div>
        {
          showInputs(decoded.unsigned.inputs)
        }
        <br />
        <b>FixedOutputs</b>
        <br />
        <Tooltip title="FixedOutputs" arrow>
          <span className="FixedOutputs">{encodeToString(assetOutput.assetOutputsCodec, decoded.unsigned.fixedOutputs)}</span>
        </Tooltip>
        <div>
          Encoded fixed outputs, the initial bytes <span className="FixedOutputs">{encodeToString(i32Codec, decoded.unsigned.fixedOutputs.length)}</span> represent the number of fixed output(s).
          Each of the fixed output encoding is displayed below with more details:
        </div>
        {
          showAssetOutputs(decoded.unsigned.fixedOutputs)
        }
        <br />
        <b>Script Execution Status</b>
        <br />
        <Tooltip title="ScriptExecutionOk" arrow>
          <span className="ScriptExecutionOk">{byteToString(decoded.scriptExecutionOk)}</span>
        </Tooltip>
        <div> <u>00</u> means Not Ok, <u>01</u> means Ok </div>
        <br />
        <b>Contract Inputs</b>
        <br />
        <Tooltip title="ContractInputs" arrow>
          <span className="ContractInputs">{encodeToString(codec.contractOutputRefsCodec, decoded.contractInputs)}</span>
        </Tooltip>
        <div>
          Encoded contract inputs, the initial bytes <span className="ContractInputs">{encodeToString(i32Codec, decoded.contractInputs.length)}</span> represent the number of contract input(s).
          {decoded.contractInputs.length > 0 && ' Each of the contract input encoding is displayed below with more details:'}
        </div>
        {
          showContractInputs(decoded.contractInputs)
        }
        <br /><br />
        <b>Generated Outputs</b>
        <br />
        <Tooltip title="GeneratedOutput" arrow>
          <span className="GeneratedOutput">{encodeToString(outputsCodec, decoded.generatedOutputs)}</span>
        </Tooltip>
        <div>
          Encoded generated outputs, the initial bytes <span className="GeneratedOutput">{encodeToString(i32Codec, decoded.generatedOutputs.length)}</span> represent the number of generated output(s).
          {decoded.generatedOutputs.length > 0 && ' Each of the generated output encoding is displayed below with more details:'}
        </div>
        {
          showGeneratedOutputs(decoded.generatedOutputs)
        }
        <br />
        <b>Input Signatures</b>
        <br />
        <Tooltip title="InputSignatures" arrow>
          <span className="InputSignatures">{encodeToString(signaturesCodec, decoded.inputSignatures)}</span>
        </Tooltip>
        <div>
          Encoded input signatures, the initial bytes <span className="InputSignatures">{encodeToString(i32Codec, decoded.inputSignatures.length)}</span> represent the number of input signature(s).
          {decoded.inputSignatures.length > 0 && ' Each of the input signature encoding is displayed below:'}
        </div>
        {
          showSignatures(decoded.inputSignatures)
        }
        <br /><br />
        <b>Script Signatures</b>
        <br />
        <Tooltip title="ScriptSignatures" arrow>
          <span className="ScriptSignatures">{encodeToString(signaturesCodec, decoded.scriptSignatures)}</span>
        </Tooltip>
        <div>
          Encoded script signatures, the initial bytes <span className="ScriptSignatures">{encodeToString(i32Codec, decoded.scriptSignatures.length)}</span> represent the number of script signature(s).
          {decoded.scriptSignatures.length > 0 && ' Each of the script signature encoding is displayed below:'}
        </div>
        {
          showSignatures(decoded.scriptSignatures)
        }
      </Typography>
    </div>
  )
}

function showScript(decoded: codec.Transaction, scriptCodec: codec.script.ScriptCodec) {
  return decoded.unsigned.statefulScript.kind !== 'None' ? (
    <Tooltip title="StatefulScriptValue" arrow>
      <span className="StatefulScriptValue">
        {encodeToString(scriptCodec, decoded.unsigned.statefulScript.value!)}
      </span>
    </Tooltip>
  ) : undefined
}

function showMethods(script: codec.script.Script) {
  return (
    <>
      {
        script.methods.map((method, index) => {
          return (
            <>
              <br />
              <u>Method {index}: </u>
              <br />
              <Tooltip title={"isPublic"} arrow>
                <span className={`isPublic`}>{binToHex(codec.boolCodec.encode(method.isPublic))}</span>
              </Tooltip>
              <Tooltip title={"assetModifier"} arrow>
                <span className={`assetModifier`}>{byteToString(encodeAssetModifier({
                  usePreapprovedAssets: method.usePreapprovedAssets,
                  useContractAssets: method.useContractAssets,
                  usePayToContractOnly: method.usePayToContractOnly
                }))}</span>
              </Tooltip>
              <Tooltip title={"argsLength"} arrow>
                <span className={`argsLength`}>{encodeToString(codec.i32Codec, method.argsLength)}</span>
              </Tooltip>
              <Tooltip title={"localsLength"} arrow>
                <span className={`localsLength`}>{encodeToString(codec.i32Codec, method.localsLength)}</span>
              </Tooltip>
              <Tooltip title={"returnsLength"} arrow>
                <span className={`returnsLength`}>{encodeToString(codec.i32Codec, method.returnLength)}</span>
              </Tooltip>
              <Tooltip title={"InstrsLength"} arrow>
                <span className={`InstrsLength`}>{encodeToString(codec.i32Codec, method.instrs.length)}</span>
              </Tooltip>
              {
                showInstrs(method.instrs)
              }
            </>
          )
        })
      }
    </>
  )
}

function showInstrs(instrs: codec.Instr[]) {
  return (
    <>
      {
        instrs.map((instr, index) => {
          console.log("instr.code", instr.code)
          const instrName = instr.name
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

function showInputs(inputs: codec.Input[]) {
  return (
    <>
      {
        inputs.map((input, index) => {
          return (
            <>
              <br />
              <u>Input {index}: </u>
              <br />

              <Tooltip title={"OutputRefHint"} arrow>
                <span className={"OutputRefHint"}>{encodeToString(codec.intAs4BytesCodec, input.hint)}</span>
              </Tooltip>
              <Tooltip title={"OutputRefKey"} arrow>
                <span className={"OutputRefKey"}>{binToHex(input.key)}</span>
              </Tooltip>
              {
                showUnlockScript(input.unlockScript)
              }
              <br />
            </>
          )
        })
      }
    </>
  )
}

function showUnlockScript(unlockScript: codec.unlockScript.UnlockScript) {
  return (
    <>
      <Tooltip title={"ScriptType"} arrow>
        <span className={"ScriptType"}>{binToHex(codec.unlockScript.unlockScriptCodec.encode(unlockScript))}</span>
      </Tooltip>

      {
        unlockScript.kind === 'P2PKH' ? (
          <>
            <Tooltip title={"PublicKey"} arrow>
              <span className={"PublicKey"}>{binToHex(unlockScript.value)}</span>
            </Tooltip>
            <br />
            This is a <u>P2PKH</u> input, the public key is <span className={"PublicKey"}>{binToHex(unlockScript.value)}</span>
          </>
        ) : unlockScript.kind === 'P2MPKH' ? (
          <>
            <Tooltip title={"PublicKeysLength"} arrow>
              <span className={"PublicKeysLength"}>{encodeToString(codec.i32Codec, unlockScript.value.length)}</span>
            </Tooltip>

            {
              unlockScript.value.map((publicKeyWithIndex) => {
                return (
                  <>
                    <Tooltip title={"PublicKey"} arrow>
                      <span className={"PublicKey"}>{binToHex(publicKeyWithIndex.publicKey)}</span>
                    </Tooltip>
                    <Tooltip title={"PublicKeyIndex"} arrow>
                      <span className={"PublicKeyIndex"}>{encodeToString(codec.i32Codec, publicKeyWithIndex.index)}</span>
                    </Tooltip>
                  </>
                )
              })
            }
            <br />
            This is a <u>P2MPKH</u> input, the indexed public keys are:
            <br />
            {
              (unlockScript.value.map((publicKeyWithIndex) => {
                return (
                  <>
                    <span className={"PublicKey"}>{binToHex(publicKeyWithIndex.publicKey)}</span><span className={"PublicKeyIndex"}>{encodeToString(codec.i32Codec, publicKeyWithIndex.index)}</span>
                    <br />
                  </>
                )
              }))
            }
          </>
        ) : unlockScript.kind === 'P2SH' ? (
          <>
            {showMethods(unlockScript.value.script)}
            {showP2SHParams(unlockScript.value.params)}
            <br />
            This is a <u>P2SH</u> input. Hover to see the script and params.
          </>
        ) : undefined
      }
    </>
  )
}

function showP2SHParams(decodedVals: codec.val.Val[]) {
  return (
    <>
      <Tooltip title={"ValLength"} arrow>
        <span className={"ValLength"}>{encodeToString(codec.i32Codec, decodedVals.length)}</span>
      </Tooltip>
      {
        decodedVals.map((val, index) => {
          return (
            <>
              <Tooltip title={"ValType"} arrow>
                <span className={"ValType"}>{binToHex(codec.val.valCodec.encode(val).subarray(0, 1))}</span>
              </Tooltip>

              {
                val.kind === 'Bool' ? (
                  <Tooltip title={"BooleanValValue"} arrow>
                    <span className={"BooleanValValue"}>{binToHex(codec.boolCodec.encode(val.value))}</span>
                  </Tooltip>
                ) : val.kind === 'I256' ? (
                  <Tooltip title={"I256ValValue"} arrow>
                    <span className={"I256ValValue"}>{encodeToString(codec.i256Codec, val.value)}</span>
                  </Tooltip>
                ) : val.kind === 'U256' ? (
                  <Tooltip title={"U256ValValue"} arrow>
                    <span className={"U256ValValue"}>{encodeToString(codec.u256Codec, val.value)}</span>
                  </Tooltip>
                ) : val.kind === 'ByteVec' ? (
                  <Tooltip title={"ByteVecValValue"} arrow>
                    <span className={"ByteVecValValue"}>{encodeToString(codec.byteStringCodec, val.value)}</span>
                  </Tooltip>
                ) : val.kind === 'Address' ? (
                  <Tooltip title={"AddressValValue"} arrow>
                    <span className={"AddressValValue"}>{encodeToString(codec.lockupScript.lockupScriptCodec, val.value)}</span>
                  </Tooltip>
                ) : undefined
              }
            </>
          )
        })
      }
    </>
  )
}

function showAssetOutputs(fixedOutputs: codec.assetOutput.AssetOutput[]) {
  return (
    <>
      {
        fixedOutputs.map((output, index) => {
          const [lockupScriptElement, lockScriptDescriptionElement] = showLockupScript(output.lockupScript);
          return (
            <>
              <br />
              <u>Fixed Output {index}: </u>
              <br />
              <Tooltip title={"Amount"} arrow>
                <span className={"Amount"}>{encodeToString(codec.u256Codec, output.amount)}</span>
              </Tooltip>
              {lockupScriptElement}
              <Tooltip title={"LockTime"} arrow>
                <span className={"LockTime"}>{binToHex(codec.timestampCodec.encode(output.lockTime))}</span>
              </Tooltip>
              <Tooltip title={"Tokens"} arrow>
                <span className={"Tokens"}>{encodeToString(codec.token.tokensCodec, output.tokens)}</span>
              </Tooltip>
              <Tooltip title={"AdditionalData"} arrow>
                <span className={"AdditionalData"}>{encodeToString(codec.byteStringCodec, output.additionalData)}</span>
              </Tooltip>
              <br />
              {lockScriptDescriptionElement}
              <br />
            </>
          )
        })
      }
    </>
  )
}

function showContractInputs(contractOutputRefs: codec.ContractOutputRef[]) {
  return (
    <>
      {
        contractOutputRefs.map((contractOutputRef, index) => {
          return (
            <>
              <br />
              <u>Contract Input {index}: </u>
              <br />
              <Tooltip title={"OutputRefHint"} arrow>
                <span className={"OutputRefHint"}>{encodeToString(codec.intAs4BytesCodec, contractOutputRef.hint)}</span>
              </Tooltip>
              <Tooltip title={"OutputRefKey"} arrow>
                <span className={"OutputRefKey"}>{binToHex(contractOutputRef.key)}</span>
              </Tooltip>
            </>
          )
        })
      }
    </>
  )
}

type Output = codec.Either<codec.assetOutput.AssetOutput, codec.contractOutput.ContractOutput>
function showGeneratedOutputs(outputs: Output[]) {
  return (
    <>
      {
        outputs.map((output, index) => {
          return (
            <>
              <br />
              <u>Generated Output {index}: </u>
              <br />
              <Tooltip title={"OutputType"} arrow>
                <span className={"OutputType"}>{byteToString(output.kind === 'Left' ? 0 : 1)}</span>
              </Tooltip>
              {
                output.kind === 'Left' ? (
                  <>
                    {(() => {
                      const [lockupScriptElement, lockScriptDescription] = showLockupScript((output.value as codec.assetOutput.AssetOutput).lockupScript);
                      return (
                        <>
                          <Tooltip title={"Amount"} arrow>
                            <span className={"Amount"}>{encodeToString(codec.u256Codec, output.value.amount)}</span>
                          </Tooltip>
                          {lockupScriptElement}
                          <Tooltip title={"LockTime"} arrow>
                            <span className={"LockTime"}>{binToHex(codec.timestampCodec.encode(output.value.lockTime))}</span>
                          </Tooltip>
                          <Tooltip title={"Tokens"} arrow>
                            <span className={"Tokens"}>{encodeToString(codec.token.tokensCodec, output.value.tokens)}</span>
                          </Tooltip>
                          <Tooltip title={"AdditionalData"} arrow>
                            <span className={"AdditionalData"}>{encodeToString(codec.byteStringCodec, (output.value as codec.assetOutput.AssetOutput).additionalData)}</span>
                          </Tooltip>
                          <br />
                          {lockScriptDescription}
                          <br />
                        </>
                      );
                    })()}
                  </>
                ) : output.kind === 'Right' ? (
                  <>
                    <Tooltip title={"Amount"} arrow>
                      <span className={"Amount"}>{encodeToString(codec.u256Codec, output.value.amount)}</span>
                    </Tooltip>
                    <Tooltip title={"ContractId"} arrow>
                      <span className={"ContractId"}>{binToHex(output.value.lockupScript)}</span>
                    </Tooltip>
                    <Tooltip title={"Tokens"} arrow>
                      <span className={"Tokens"}>{encodeToString(codec.token.tokensCodec, output.value.tokens)}</span>
                    </Tooltip>
                    <br />
                    This is a <u>P2C Output</u>, contract id is <span className={"Amount"}>{binToHex(output.value.lockupScript)}</span>
                    <br />
                  </>
                ) : undefined
              }
            </>
          )
        })
      }
    </>
  )
}

function showSignatures(signatures: codec.Signature[]) {
  return (
    <>
      {
        signatures.map((signature, index) => {
          const className = index % 2 === 0 ? "Signature" : "SignatureInverse"
          return (
            <>
              <br />
              <u>Input Signature {index}: </u>
              <br />
              <Tooltip title={"Signature"} arrow>
                <span className={`${className}`}>{binToHex(signature)}</span>
              </Tooltip>
            </>
          )
        })
      }
    </>
  )
}

function showLockupScript(lockScript: codec.lockupScript.LockupScript): [React.JSX.Element | undefined, React.JSX.Element | undefined] {
  if (lockScript.kind === 'P2PKH') {
    const result = (
      <>
        <Tooltip title={"ScriptType"} arrow>
          <span className={"ScriptType"}>{binToHex(codec.lockupScript.lockupScriptCodec.encode(lockScript).subarray(0, 1))}</span>
        </Tooltip>
        <Tooltip title={"PublicKeyHash"} arrow>
          <span className={"PublicKeyHash"}>{binToHex(lockScript.value)}</span>
        </Tooltip>
      </>
    )

    const lockScriptDescription = (
      <>
        This is a <u>P2PKH</u> output, the public key hash is <span className={"PublicKeyHash"}>{binToHex(lockScript.value)}</span>
      </>
    )
    return [result, lockScriptDescription]
  } else if (lockScript.kind === 'P2MPKH') {
    const result = (
      <>
        <Tooltip title={"ScriptType"} arrow>
          <span className={"ScriptType"}>{binToHex(codec.lockupScript.lockupScriptCodec.encode(lockScript).subarray(0, 1))}</span>
        </Tooltip>
        <Tooltip title={"MultiSigTotalKeys"} arrow>
          <span className={"MultiSigTotalKeys"}>{encodeToString(codec.i32Codec, lockScript.value.publicKeyHashes.length)}</span>
        </Tooltip>
        {
          lockScript.value.publicKeyHashes.map((publicKeyHash, index) => {
            const className = index % 2 === 0 ? "PublicKeyHash" : "PublicKeyHashInverse"
            return (
              <>
                <Tooltip title={"PublicKeyHash"} arrow>
                  <span className={`${className}`}>{binToHex(publicKeyHash)}</span>
                </Tooltip>
              </>
            )
          })
        }
        <Tooltip title={"MultiSigRequiredKeys"} arrow>
          <span className={"MultiSigRequiredKeys"}>{encodeToString(codec.i32Codec, lockScript.value.m)}</span>
        </Tooltip>
      </>
    )

    const lockScriptDescription = (
      <>
        This is a <u>P2MPKH</u> output, the <span className={"MultiSigTotalKeys"}>{encodeToString(codec.i32Codec, lockScript.value.publicKeyHashes.length)}</span> public key hashes are:
        <br />
        {
          lockScript.value.publicKeyHashes.map((publicKeyHash, index) => {
            const className = index % 2 === 0 ? "PublicKeyHash" : "PublicKeyHashInverse"
            return (
              <>
                <span className={`${className}`}>{binToHex(publicKeyHash)}</span>
              </>
            )
          })
        }
        <br />
        The required number of signatures is <span className={"MultiSigRequiredKeys"}>{encodeToString(codec.i32Codec, lockScript.value.m)}</span>
      </>
    )
    return [result, lockScriptDescription]
  } else if (lockScript.kind === 'P2SH') {
    const result = (
      <>
        <Tooltip title={"ScriptType"} arrow>
          <span className={"ScriptType"}>{binToHex(codec.lockupScript.lockupScriptCodec.encode(lockScript).subarray(0, 1))}</span>
        </Tooltip>
        <Tooltip title={"P2SHScriptHash"} arrow>
          <span className={"P2SHScriptHash"}>{binToHex(lockScript.value)}</span>
        </Tooltip>
      </>
    )

    const lockScriptDescription = (
      <>
        This is a <u>P2SH</u> output, the script hash is <span className={"P2SHScriptHash"}>{binToHex(lockScript.value)}</span>
      </>
    )
    return [result, lockScriptDescription]
  } else if (lockScript.kind === 'P2C') {
    const result = (
      <>
        <Tooltip title={"ScriptType"} arrow>
          <span className={"ScriptType"}>{binToHex(codec.lockupScript.lockupScriptCodec.encode(lockScript).subarray(0, 1))}</span>
        </Tooltip>
        <Tooltip title={"P2CContractId"} arrow>
          <span className={"P2CContractId"}>{binToHex(lockScript.value)}</span>
        </Tooltip>
      </>
    )

    const lockScriptDescription = (
      <>
        This is a <u>P2C</u> output, the contract id is <span className={"P2CContractId"}>{binToHex(lockScript.value)}</span>
      </>
    )
    return [result, lockScriptDescription]
  } else {
    return [undefined, undefined]
  }
}

export default TransactionRawComponent
