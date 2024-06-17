import React from 'react'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { binToHex, codec } from '@alephium/web3'
import Button from '@mui/material/Button';
import Replay from '@mui/icons-material/Replay';
import { getInstrName, byteToString, encodeToString } from '../services/utils'

interface TransactionRawComponentProps {
  decoded: codec.Transaction
  breakDown: boolean
}

export const TransactionRawComponent: React.FunctionComponent<TransactionRawComponentProps> = (props) => {
  const { decoded, breakDown } = props
  const { script, compactSignedIntCodec, compactUnsignedIntCodec, inputCodec, ArrayCodec, assetOutput, contractOutputRefCodec, EitherCodec, contractOutput, signatureCodec } = codec
  const inputsCodes = new ArrayCodec(inputCodec)
  const assetOutputsCodec = new ArrayCodec(assetOutput.assetOutputCodec)
  const contractOutputRefsCodec = new ArrayCodec(contractOutputRefCodec)
  const { scriptCodec } = script
  const outputCodec = new EitherCodec(assetOutput.assetOutputCodec, contractOutput.contractOutputCodec)
  const outputsCodec = new ArrayCodec(outputCodec)
  const signaturesCodec = new ArrayCodec(signatureCodec)

  return breakDown === false ? (
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
          showScript(decoded, scriptCodec)
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
      <br />

      {
        decoded.unsigned.statefulScript.option !== 0 ? (
          <div className={"pull-center"}>
            <Button variant="contained" color="success" size="small" endIcon={<Replay />}> Replay Script</Button>
          </div>
        ) : null
      }
    </div >
  ) : (
    <div style={{ maxWidth: '480px', textAlign: 'left', marginTop: '20px', wordWrap: 'break-word' }}>
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
          <span className="StatefulScriptOption">{byteToString(decoded.unsigned.statefulScript.option)}</span>
        </Tooltip>
        <div> <u>00</u> means without Tx Script, <u>01</u> means with Tx Script </div>
        <br />
        {
          decoded.unsigned.statefulScript.option !== 0 ? (
            <>
              <b>Tx Script</b>
              <br />
              {showScript(decoded, scriptCodec)}
              <div>
                Encoded TxScript, the initial bytes <span className="StatefulScriptValue">{encodeToString(codec.compactSignedIntCodec, decoded.unsigned.statefulScript.value!.methods.length)}</span> represent the number of method(s).
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
          <span className="GasAmount">{encodeToString(compactSignedIntCodec, decoded.unsigned.gasAmount)}</span>
        </Tooltip>
        <div> Encoded gas amount, which is <u>{compactSignedIntCodec.toI32(decoded.unsigned.gasAmount)}</u> in decimal</div>
        <br />
        <b>Gas Price</b>
        <br />
        <Tooltip title="GasPrice" arrow>
          <span className="GasPrice">{encodeToString(compactSignedIntCodec, decoded.unsigned.gasPrice)}</span>
        </Tooltip>
        <div> Encoded gas price, which is <u>{compactUnsignedIntCodec.toU256(decoded.unsigned.gasPrice).toString()}</u> in decimal</div>
        <br />
        <b>Inputs</b>
        <br />
        <Tooltip title="Inputs" arrow>
          <span className="Inputs">{encodeToString(inputsCodes, decoded.unsigned.inputs.value)}</span>
        </Tooltip>
        <div>
          Encoded inputs, the initial bytes <span className="Inputs">{encodeToString(codec.compactSignedIntCodec, decoded.unsigned.inputs.length)}</span> represent the number of input(s).
          Each of the input encoding is displayed below with more details:
        </div>
        {
          showInputs(decoded.unsigned.inputs.value)
        }
        <br />
        <b>FixedOutputs</b>
        <br />
        <Tooltip title="FixedOutputs" arrow>
          <span className="FixedOutputs">{encodeToString(assetOutputsCodec, decoded.unsigned.fixedOutputs.value)}</span>
        </Tooltip>
        <div>
          Encoded fixed outputs, the initial bytes <span className="FixedOutputs">{encodeToString(codec.compactSignedIntCodec, decoded.unsigned.fixedOutputs.length)}</span> represent the number of fixed output(s).
          Each of the fixed output encoding is displayed below with more details:
        </div>
        {
          showAssetOutputs(decoded.unsigned.fixedOutputs.value)
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
          <span className="ContractInputs">{encodeToString(contractOutputRefsCodec, decoded.contractInputs.value)}</span>
        </Tooltip>
        <div>
          Encoded contract inputs, the initial bytes <span className="ContractInputs">{encodeToString(codec.compactSignedIntCodec, decoded.contractInputs.length)}</span> represent the number of contract input(s).
          {decoded.contractInputs.value.length > 0 && ' Each of the contract input encoding is displayed below with more details:'}
        </div>
        {
          showContractInputs(decoded.contractInputs.value)
        }
        <br /><br />
        <b>Generated Outputs</b>
        <br />
        <Tooltip title="GeneratedOutput" arrow>
          <span className="GeneratedOutput">{encodeToString(outputsCodec, decoded.generatedOutputs.value)}</span>
        </Tooltip>
        <div>
          Encoded generated outputs, the initial bytes <span className="GeneratedOutput">{encodeToString(codec.compactSignedIntCodec, decoded.generatedOutputs.length)}</span> represent the number of generated output(s).
          {decoded.generatedOutputs.value.length > 0 && ' Each of the generated output encoding is displayed below with more details:'}
        </div>
        {
          showGeneratedOutputs(decoded.generatedOutputs.value)
        }
        <br />
        <b>Input Signatures</b>
        <br />
        <Tooltip title="InputSignatures" arrow>
          <span className="InputSignatures">{encodeToString(signaturesCodec, decoded.inputSignatures.value)}</span>
        </Tooltip>
        <div>
          Encoded input signatures, the initial bytes <span className="InputSignatures">{encodeToString(codec.compactSignedIntCodec, decoded.inputSignatures.length)}</span> represent the number of input signature(s).
          {decoded.inputSignatures.value.length > 0 && ' Each of the input signature encoding is displayed below:'}
        </div>
        {
          showSignatures(decoded.inputSignatures.value)
        }
        <br /><br />
        <b>Script Signatures</b>
        <br />
        <Tooltip title="ScriptSignatures" arrow>
          <span className="ScriptSignatures">{encodeToString(signaturesCodec, decoded.scriptSignatures.value)}</span>
        </Tooltip>
        <div>
          Encoded script signatures, the initial bytes <span className="ScriptSignatures">{encodeToString(codec.compactSignedIntCodec, decoded.scriptSignatures.length)}</span> represent the number of script signature(s).
          {decoded.scriptSignatures.value.length > 0 && ' Each of the script signature encoding is displayed below:'}
        </div>
        {
          showSignatures(decoded.scriptSignatures.value)
        }
      </Typography>
    </div>
  )
}

function showScript(decoded: codec.Transaction, scriptCodec: codec.script.ScriptCodec) {
  return decoded.unsigned.statefulScript.option !== 0 ? (
    <Tooltip title="StatefulScriptValue" arrow>
      <span className="StatefulScriptValue">
        {encodeToString(scriptCodec, decoded.unsigned.statefulScript.value!)}
      </span>
    </Tooltip>
  ) : undefined
}

function showMethods(script: codec.script.DecodedScript) {
  return (
    <>
      {
        script.methods.value.map((method, index) => {
          return (
            <>
              <br />
              <u>Method {index}: </u>
              <br />
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
                <span className={"OutputRefHint"}>{encodeToString(codec.signedIntCodec, input.outputRef.hint)}</span>
              </Tooltip>
              <Tooltip title={"OutputRefKey"} arrow>
                <span className={"OutputRefKey"}>{binToHex(input.outputRef.key)}</span>
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
        <span className={"ScriptType"}>{byteToString(unlockScript.scriptType)}</span>
      </Tooltip>

      {
        unlockScript.scriptType === 0 ? (
          <>
            <Tooltip title={"PublicKey"} arrow>
              <span className={"PublicKey"}>{binToHex((unlockScript.script as codec.unlockScript.P2PKH).publicKey)}</span>
            </Tooltip>
            <br />
            This is a <u>P2PKH</u> input, the public key is <span className={"PublicKey"}>{binToHex((unlockScript.script as codec.unlockScript.P2PKH).publicKey)}</span>
          </>
        ) : unlockScript.scriptType === 1 ? (
          <>
            <Tooltip title={"PublicKeysLength"} arrow>
              <span className={"PublicKeysLength"}>{encodeToString(codec.compactSignedIntCodec, (unlockScript.script as codec.unlockScript.P2MPKH).publicKeys.length)}</span>
            </Tooltip>

            {
              (unlockScript.script as codec.unlockScript.P2MPKH).publicKeys.value.map((publicKey) => {
                return (
                  <>
                    <Tooltip title={"PublicKey"} arrow>
                      <span className={"PublicKey"}>{binToHex(publicKey.publicKey.publicKey)}</span>
                    </Tooltip>
                    <Tooltip title={"PublicKeyIndex"} arrow>
                      <span className={"PublicKeyIndex"}>{encodeToString(codec.compactUnsignedIntCodec, publicKey.index)}</span>
                    </Tooltip>
                  </>
                )
              })
            }
            <br />
            This is a <u>P2MPKH</u> input, the indexed public keys are:
            <br />
            {
              (unlockScript.script as codec.unlockScript.P2MPKH).publicKeys.value.map((publicKey, index) => {
                return (
                  <>
                    <span className={"PublicKey"}>{binToHex(publicKey.publicKey.publicKey)}</span><span className={"PublicKeyIndex"}>{encodeToString(codec.compactUnsignedIntCodec, publicKey.index)}</span>
                    <br />
                  </>
                )
              })
            }
          </>
        ) : unlockScript.scriptType === 2 ? (
          <>
            {showMethods((unlockScript.script as codec.unlockScript.P2SH).script)}
            {showP2SHParams((unlockScript.script as codec.unlockScript.P2SH).params)}
            <br />
            This is a <u>P2SH</u> input. Hover to see the script and params.
          </>
        ) : undefined
      }
    </>
  )
}

function showP2SHParams(decodedVals: codec.DecodedArray<codec.unlockScript.Val>) {
  return (
    <>
      <Tooltip title={"ValLength"} arrow>
        <span className={"ValLength"}>{encodeToString(codec.compactSignedIntCodec, (decodedVals.length))}</span>
      </Tooltip>
      {
        decodedVals.value.map((val, index) => {
          return (
            <>
              <Tooltip title={"ValType"} arrow>
                <span className={"ValType"}>{byteToString(val.type)}</span>
              </Tooltip>

              {
                val.type === 0 ? (
                  <Tooltip title={"BooleanValValue"} arrow>
                    <span className={"BooleanValValue"}>{byteToString(val.val as number)}</span>
                  </Tooltip>
                ) : val.type === 1 ? (
                  <Tooltip title={"I256ValValue"} arrow>
                    <span className={"I256ValValue"}>{encodeToString(codec.compactUnsignedIntCodec, val.val)}</span>
                  </Tooltip>
                ) : val.type === 2 ? (
                  <Tooltip title={"U256ValValue"} arrow>
                    <span className={"U256ValValue"}>{encodeToString(codec.compactUnsignedIntCodec, val.val)}</span>
                  </Tooltip>
                ) : val.type === 3 ? (
                  <Tooltip title={"ByteVecValValue"} arrow>
                    <span className={"ByteVecValValue"}>{encodeToString(codec.byteStringCodec, val.val)}</span>
                  </Tooltip>
                ) : val.type === 4 ? (
                  <Tooltip title={"AddressValValue"} arrow>
                    <span className={"AddressValValue"}>{encodeToString(codec.lockupScript.lockupScriptCodec, val.val)}</span>
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
  let lockScriptDescription: React.JSX.Element | undefined = undefined

  function showLockScript(lockScript: codec.lockupScript.LockupScript) {
    if (lockScript.scriptType === 0) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{byteToString(lockScript.scriptType)}</span>
          </Tooltip>
          <Tooltip title={"PublicKeyHash"} arrow>
            <span className={"PublicKeyHash"}>{binToHex((lockScript.script as codec.lockupScript.PublicKeyHash).publicKeyHash)}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2PKH</u> output, the public key hash is <span className={"PublicKeyHash"}>{binToHex((lockScript.script as codec.lockupScript.PublicKeyHash).publicKeyHash)}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 1) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{byteToString(lockScript.scriptType)}</span>
          </Tooltip>
          <Tooltip title={"MultiSigTotalKeys"} arrow>
            <span className={"MultiSigTotalKeys"}>{encodeToString(codec.compactSignedIntCodec, (lockScript.script as codec.lockupScript.MultiSig).publicKeyHashes.length)}</span>
          </Tooltip>
          {
            (lockScript.script as codec.lockupScript.MultiSig).publicKeyHashes.value.map((publicKey, index) => {
              const className = index % 2 === 0 ? "PublicKeyHash" : "PublicKeyHashInverse"
              return (
                <>
                  <Tooltip title={"PublicKeyHash"} arrow>
                    <span className={`${className}`}>{binToHex(publicKey.publicKeyHash)}</span>
                  </Tooltip>
                </>
              )
            })
          }
          <Tooltip title={"MultiSigRequiredKeys"} arrow>
            <span className={"MultiSigRequiredKeys"}>{encodeToString(codec.compactUnsignedIntCodec, (lockScript.script as codec.lockupScript.MultiSig).m)}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2MPKH</u> output, the <span className={"MultiSigTotalKeys"}>{encodeToString(codec.compactSignedIntCodec, (lockScript.script as codec.lockupScript.MultiSig).publicKeyHashes.length)}</span> public key hashes are:
          <br />
          {
            (lockScript.script as codec.lockupScript.MultiSig).publicKeyHashes.value.map((publicKey, index) => {
              const className = index % 2 === 0 ? "PublicKeyHash" : "PublicKeyHashInverse"
              return (
                <>
                  <span className={`${className}`}>{binToHex(publicKey.publicKeyHash)}</span>
                </>
              )
            })
          }
          <br />
          The required number of signatures is <span className={"MultiSigRequiredKeys"}>{encodeToString(codec.compactUnsignedIntCodec, (lockScript.script as codec.lockupScript.MultiSig).m)}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 2) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{byteToString(lockScript.scriptType)}</span>
          </Tooltip>
          <Tooltip title={"P2SHScriptHash"} arrow>
            <span className={"P2SHScriptHash"}>{binToHex((lockScript.script as codec.lockupScript.P2SH).scriptHash)}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2SH</u> output, the script hash is <span className={"P2SHScriptHash"}>{binToHex((lockScript.script as codec.lockupScript.P2SH).scriptHash)}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 3) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{byteToString(lockScript.scriptType)}</span>
          </Tooltip>
          <Tooltip title={"P2CContractId"} arrow>
            <span className={"P2CContractId"}>{binToHex((lockScript.script as codec.lockupScript.P2C).contractId)}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2C</u> output, the contract id is <span className={"P2CContractId"}>{binToHex((lockScript.script as codec.lockupScript.P2C).contractId)}</span>
        </>
      )
      return result
    } else {
      return undefined
    }
  }

  return (
    <>
      {
        fixedOutputs.map((output, index) => {
          return (
            <>
              <br />
              <u>Fixed Output {index}: </u>
              <br />
              <Tooltip title={"Amount"} arrow>
                <span className={"Amount"}>{encodeToString(codec.compactUnsignedIntCodec, output.amount)}</span>
              </Tooltip>
              {showLockScript(output.lockupScript)}
              <Tooltip title={"LockTime"} arrow>
                <span className={"LockTime"}>{binToHex(output.lockTime)}</span>
              </Tooltip>
              <Tooltip title={"Tokens"} arrow>
                <span className={"Tokens"}>{encodeToString(codec.token.tokensCodec, output.tokens.value)}</span>
              </Tooltip>
              <Tooltip title={"AdditionalData"} arrow>
                <span className={"AdditionalData"}>{encodeToString(codec.byteStringCodec, output.additionalData)}</span>
              </Tooltip>
              <br />
              {lockScriptDescription !== undefined && lockScriptDescription}
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
                <span className={"OutputRefHint"}>{encodeToString(codec.signedIntCodec, contractOutputRef.hint)}</span>
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
  let lockScriptDescription: React.JSX.Element | undefined = undefined

  function showLockScript(lockScript: codec.lockupScript.LockupScript) {
    if (lockScript.scriptType === 0) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{byteToString(lockScript.scriptType)}</span>
          </Tooltip>
          <Tooltip title={"PublicKeyHash"} arrow>
            <span className={"PublicKeyHash"}>{binToHex((lockScript.script as codec.lockupScript.PublicKeyHash).publicKeyHash)}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2PKH</u> output, the public key hash is <span className={"PublicKeyHash"}>{binToHex((lockScript.script as codec.lockupScript.PublicKeyHash).publicKeyHash)}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 1) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{byteToString(lockScript.scriptType)}</span>
          </Tooltip>
          <Tooltip title={"MultiSigTotalKeys"} arrow>
            <span className={"MultiSigTotalKeys"}>{encodeToString(codec.compactSignedIntCodec, (lockScript.script as codec.lockupScript.MultiSig).publicKeyHashes.length)}</span>
          </Tooltip>
          {
            (lockScript.script as codec.lockupScript.MultiSig).publicKeyHashes.value.map((publicKey, index) => {
              const className = index % 2 === 0 ? "PublicKeyHash" : "PublicKeyHashInverse"
              return (
                <>
                  <Tooltip title={"PublicKeyHash"} arrow>
                    <span className={`${className}`}>{binToHex(publicKey.publicKeyHash)}</span>
                  </Tooltip>
                </>
              )
            })
          }
          <Tooltip title={"MultiSigRequiredKeys"} arrow>
            <span className={"MultiSigRequiredKeys"}>{encodeToString(codec.compactUnsignedIntCodec, (lockScript.script as codec.lockupScript.MultiSig).m)}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2MPKH</u> output, the <span className={"MultiSigTotalKeys"}>{encodeToString(codec.compactSignedIntCodec, (lockScript.script as codec.lockupScript.MultiSig).publicKeyHashes.length)}</span> public key hashes are:
          <br />
          {
            (lockScript.script as codec.lockupScript.MultiSig).publicKeyHashes.value.map((publicKey, index) => {
              const className = index % 2 === 0 ? "PublicKeyHash" : "PublicKeyHashInverse"
              return (
                <>
                  <span className={`${className}`}>{binToHex(publicKey.publicKeyHash)}</span>
                </>
              )
            })
          }
          <br />
          The required number of signatures is <span className={"MultiSigRequiredKeys"}>{encodeToString(codec.compactUnsignedIntCodec, (lockScript.script as codec.lockupScript.MultiSig).m)}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 2) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{byteToString(lockScript.scriptType)}</span>
          </Tooltip>
          <Tooltip title={"P2SHScriptHash"} arrow>
            <span className={"P2SHScriptHash"}>{binToHex((lockScript.script as codec.lockupScript.P2SH).scriptHash)}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2SH</u> output, the script hash is <span className={"P2SHScriptHash"}>{binToHex((lockScript.script as codec.lockupScript.P2SH).scriptHash)}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 3) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{byteToString(lockScript.scriptType)}</span>
          </Tooltip>
          <Tooltip title={"P2CContractId"} arrow>
            <span className={"P2CContractId"}>{binToHex((lockScript.script as codec.lockupScript.P2C).contractId)}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2C</u> output, the contract id is <span className={"P2CContractId"}>{binToHex((lockScript.script as codec.lockupScript.P2C).contractId)}</span>
        </>
      )
      return result
    } else {
      return undefined
    }
  }

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
                <span className={"OutputType"}>{byteToString(output.either)}</span>
              </Tooltip>
              {
                output.either === 0 ? (
                  <>
                    <Tooltip title={"Amount"} arrow>
                      <span className={"Amount"}>{encodeToString(codec.compactUnsignedIntCodec, (output.value as codec.assetOutput.AssetOutput).amount)}</span>
                    </Tooltip>
                    {showLockScript((output.value as codec.assetOutput.AssetOutput).lockupScript)}
                    <Tooltip title={"LockTime"} arrow>
                      <span className={"LockTime"}>{binToHex((output.value as codec.assetOutput.AssetOutput).lockTime)}</span>
                    </Tooltip>
                    <Tooltip title={"Tokens"} arrow>
                      <span className={"Tokens"}>{encodeToString(codec.token.tokensCodec, (output.value as codec.assetOutput.AssetOutput).tokens.value)}</span>
                    </Tooltip>
                    <Tooltip title={"AdditionalData"} arrow>
                      <span className={"AdditionalData"}>{encodeToString(codec.byteStringCodec, (output.value as codec.assetOutput.AssetOutput).additionalData)}</span>
                    </Tooltip>
                    <br />
                    {lockScriptDescription !== undefined && lockScriptDescription}
                    <br />
                  </>
                ) : output.either === 1 ? (
                  <>
                    <Tooltip title={"Amount"} arrow>
                      <span className={"Amount"}>{encodeToString(codec.compactUnsignedIntCodec, (output.value as codec.contractOutput.ContractOutput).amount)}</span>
                    </Tooltip>
                    <Tooltip title={"ContractId"} arrow>
                      <span className={"ContractId"}>{binToHex((output.value as codec.contractOutput.ContractOutput).lockupScript.contractId)}</span>
                    </Tooltip>
                    <Tooltip title={"Tokens"} arrow>
                      <span className={"Tokens"}>{encodeToString(codec.token.tokensCodec, (output.value as codec.contractOutput.ContractOutput).tokens.value)}</span>
                    </Tooltip>
                    <br />
                    This is a <u>P2C Output</u>, contract id is <span className={"Amount"}>{binToHex((output.value as codec.contractOutput.ContractOutput).lockupScript.contractId)}</span>
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
                <span className={`${className}`}>{binToHex(signature.value)}</span>
              </Tooltip>
            </>
          )
        })
      }
    </>
  )
}

export default TransactionRawComponent
