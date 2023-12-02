import _ from 'lodash'
import React from 'react'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { codec } from '@h0ngcha0/web3'
import { ScriptCodec } from '@h0ngcha0/web3/dist/src/codec/script-codec'
import { List, ListItem } from '@mui/material'

interface TransactionRawComponentProps {
  txRaw: string
  breakDown: boolean
}

export const TransactionRawComponent: React.FunctionComponent<TransactionRawComponentProps> = (props) => {
  const { txRaw, breakDown } = props
  const { script, compactSignedIntCodec, compactUnsignedIntCodec, inputCodec, ArrayCodec, assetOutput, contractOutputRefCodec, EitherCodec, contractOutput, signatureCodec } = codec
  const inputsCodes = new ArrayCodec(inputCodec)
  const assetOutputsCodec = new ArrayCodec(assetOutput.assetOutputCodec)
  const contractOutputRefsCodec = new ArrayCodec(contractOutputRefCodec)
  const { scriptCodec } = script
  const decoded: codec.Transaction = codec.transactionCodec.decode(Buffer.from(txRaw, 'hex'))
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
      <br/>
    </div>
    ) : (
    <div style={{ maxWidth: '480px', textAlign: 'left', marginTop: '20px', wordWrap: 'break-word' }}>
      <Typography variant="body2">
            <b>Version Number</b>
            <br/>
            <Tooltip title="Version" arrow>
              <span className="TxVersion">{byteToString(decoded.unsigned.version)}</span>
            </Tooltip>
            <br/><br/>
            <b>Network ID</b>
            <br/>
            <Tooltip title="NetworkId" arrow>
              <span className="NetworkId">{byteToString(decoded.unsigned.networkId)}</span>
            </Tooltip>
            <div> <u>00</u> means Mainnet, <u>01</u> means Testnet and <u>02</u> means Devnet </div>
            <br/>
            <b>Tx Script Option</b>
            <br/>
            <Tooltip title="StatefulScriptOption" arrow>
              <span className="StatefulScriptOption">{byteToString(decoded.unsigned.statefulScript.option)}</span>
            </Tooltip>
            <div> <u>00</u> means without Tx Script, <u>01</u> means with Tx Script </div>
            <br/>
            {
              decoded.unsigned.statefulScript.option !== 0 ? (
                <>
                  <b>Tx Script</b>
                  <br/>
                  { showScript(decoded, scriptCodec) }
                  <div>
                    Encoded TxScript, the initial bytes <span className="StatefulScriptValue">{encodeToString(codec.compactSignedIntCodec, decoded.unsigned.statefulScript.value!.methods.length)}</span> represent the number of method(s).
                    Each of the method encoding is displayed below with more details (hover to see instructions):
                    <br/>
                    {
                      showMethods(decoded.unsigned.statefulScript.value!)
                    }
                  </div>
                </>
              ) : undefined
            }
            <br/>
            <b>Gas Amount</b>
            <br/>
            <Tooltip title="GasAmount" arrow>
              <span className="GasAmount">{encodeToString(compactSignedIntCodec, decoded.unsigned.gasAmount)}</span>
            </Tooltip>
            <div> Encoded gas amount, which is <u>{compactSignedIntCodec.toI32(decoded.unsigned.gasAmount)}</u> in decimal</div>
            <br/>
            <b>Gas Price</b>
            <br/>
            <Tooltip title="GasPrice" arrow>
              <span className="GasPrice">{encodeToString(compactSignedIntCodec, decoded.unsigned.gasPrice)}</span>
            </Tooltip>
            <div> Encoded gas price, which is <u>{compactUnsignedIntCodec.toU256(decoded.unsigned.gasPrice).toString()}</u> in decimal</div>
            <br/>
            <b>Inputs</b>
            <br/>
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
            <br/>
            <b>FixedOutputs</b>
            <br/>
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
            <br/>
            <b>Script Execution Status</b>
            <br/>
            <Tooltip title="ScriptExecutionOk" arrow>
              <span className="ScriptExecutionOk">{byteToString(decoded.scriptExecutionOk)}</span>
            </Tooltip>
            <div> <u>00</u> means Not Ok, <u>01</u> means Ok </div>
            <br/>
            <b>Contract Inputs</b>
            <br/>
            <Tooltip title="ContractInputs" arrow>
              <span className="ContractInputs">{encodeToString(contractOutputRefsCodec, decoded.contractInputs.value)}</span>
            </Tooltip>
            <div>
              Encoded contract inputs, the initial bytes <span className="ContractInputs">{encodeToString(codec.compactSignedIntCodec, decoded.contractInputs.length)}</span> represent the number of contract input(s).
              { decoded.contractInputs.value.length > 0 && ' Each of the contract input encoding is displayed below with more details:'}
            </div>
            {
              showContractInputs(decoded.contractInputs.value)
            }
            <br/><br/>
            <b>Generated Outputs</b>
            <br/>
            <Tooltip title="GeneratedOutput" arrow>
              <span className="GeneratedOutput">{encodeToString(outputsCodec, decoded.generatedOutputs.value)}</span>
            </Tooltip>
            <div>
              Encoded generated outputs, the initial bytes <span className="GeneratedOutput">{encodeToString(codec.compactSignedIntCodec, decoded.generatedOutputs.length)}</span> represent the number of generated output(s).
              { decoded.generatedOutputs.value.length > 0 && ' Each of the generated output encoding is displayed below with more details:'}
            </div>
            {
              showGeneratedOutputs(decoded.generatedOutputs.value)
            }
            <br/>
            <b>Input Signatures</b>
            <br/>
            <Tooltip title="InputSignatures" arrow>
              <span className="InputSignatures">{encodeToString(signaturesCodec, decoded.inputSignatures.value)}</span>
            </Tooltip>
            <div>
              Encoded input signatures, the initial bytes <span className="InputSignatures">{encodeToString(codec.compactSignedIntCodec, decoded.inputSignatures.length)}</span> represent the number of input signature(s).
              { decoded.inputSignatures.value.length > 0 && ' Each of the input signature encoding is displayed below:'}
            </div>
            {
              showSignatures(decoded.inputSignatures.value)
            }
            <br/><br/>
            <b>Script Signatures</b>
            <br/>
            <Tooltip title="ScriptSignatures" arrow>
              <span className="ScriptSignatures">{encodeToString(signaturesCodec, decoded.scriptSignatures.value)}</span>
            </Tooltip>
            <div>
              Encoded script signatures, the initial bytes <span className="ScriptSignatures">{encodeToString(codec.compactSignedIntCodec, decoded.scriptSignatures.length)}</span> represent the number of script signature(s).
              { decoded.scriptSignatures.value.length > 0 && ' Each of the script signature encoding is displayed below:'}
            </div>
            {
              showSignatures(decoded.scriptSignatures.value)
            }
      </Typography>
    </div>
  )
}

function showScript(decoded: codec.Transaction, scriptCodec: ScriptCodec) {
  return decoded.unsigned.statefulScript.option !== 0 ? (
    <Tooltip title="StatefulScriptValue" arrow>
      <span className="StatefulScriptValue">
        { encodeToString(scriptCodec, decoded.unsigned.statefulScript.value!) }
      </span>
    </Tooltip>
  ) : undefined
}

function showMethods(script: codec.script.Script) {
  return (
    <>
      {
         script.methods.value.map((method, index) => {
           return (
             <>
               <br/>
               <u>Method {index}: </u>
               <br/>
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
               <br/>
                 <u>Input {index}: </u>
               <br/>

               <Tooltip title={"OutputRefHint"} arrow>
                 <span className={"OutputRefHint"}>{encodeToString(codec.signedIntCodec, input.outputRef.hint)}</span>
               </Tooltip>
               <Tooltip title={"OutputRefKey"} arrow>
                 <span className={"OutputRefKey"}>{input.outputRef.key.toString('hex')}</span>
               </Tooltip>
               {
                 showUnlockScript(input.unlockScript)
               }
               <br/>
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
        <span className={"ScriptType"}>{ byteToString(unlockScript.scriptType) }</span>
      </Tooltip>

      {
        unlockScript.scriptType === 0 ? (
          <>
            <Tooltip title={"PublicKey"} arrow>
              <span className={"PublicKey"}>{(unlockScript.script as codec.unlockScript.P2PKH).publicKey.toString('hex')}</span>
            </Tooltip>
            <br/>
            This is a <u>P2PKH</u> input, the public key is <span className={"PublicKey"}>{(unlockScript.script as codec.unlockScript.P2PKH).publicKey.toString('hex')}</span>
          </>
        ) : unlockScript.scriptType === 1 ? (
          <>
            <Tooltip title={"PublicKeysLength"} arrow>
              <span className={"PublicKeysLength"}>{encodeToString(codec.compactSignedIntCodec, (unlockScript.script as codec.unlockScript.P2MPKH).publicKeys.length)}</span>
            </Tooltip>

            {
              (unlockScript.script as codec.unlockScript.P2MPKH).publicKeys.value.map((publicKey, index) => {
                return (
                  <>
                    <Tooltip title={"PublicKey"} arrow>
                      <span className={"PublicKey"}>{publicKey.publicKey.publicKey.toString('hex')}</span>
                    </Tooltip>
                    <Tooltip title={"PublicKeyIndex"} arrow>
                      <span className={"PublicKeyIndex"}>{encodeToString(codec.compactUnsignedIntCodec, publicKey.index)}</span>
                    </Tooltip>
                  </>
                )
              })
            }
            <br/>
            This is a <u>P2MPKH</u> input, the indexed public keys are:
            <br/>
            {
              (unlockScript.script as codec.unlockScript.P2MPKH).publicKeys.value.map((publicKey, index) => {
                return (
                  <>
                    <span className={"PublicKey"}>{publicKey.publicKey.publicKey.toString('hex')}</span><span className={"PublicKeyIndex"}>{encodeToString(codec.compactUnsignedIntCodec, publicKey.index)}</span>
                    <br/>
                  </>
                )
              })
            }
          </>
        ) : unlockScript.scriptType === 2 ? (
          <>
            { showMethods((unlockScript.script as codec.unlockScript.P2SH).script) }
            { showP2SHParams((unlockScript.script as codec.unlockScript.P2SH).params) }
            <br/>
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
                ): val.type === 1 ? (
                  <Tooltip title={"I256ValValue"} arrow>
                    <span className={"I256ValValue"}>{encodeToString(codec.compactUnsignedIntCodec, val.val)}</span>
                  </Tooltip>
                ): val.type === 2 ? (
                  <Tooltip title={"U256ValValue"} arrow>
                    <span className={"U256ValValue"}>{encodeToString(codec.compactUnsignedIntCodec, val.val)}</span>
                  </Tooltip>
                ): val.type === 3 ? (
                  <Tooltip title={"ByteVecValValue"} arrow>
                    <span className={"ByteVecValValue"}>{encodeToString(codec.byteStringCodec, val.val)}</span>
                  </Tooltip>
                ): val.type === 4 ? (
                  <Tooltip title={"AddressValValue"} arrow>
                    <span className={"AddressValValue"}>{encodeToString(codec.lockupScript.lockupScriptCodec, val.val)}</span>
                  </Tooltip>
                ): undefined
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
            <span className={"ScriptType"}>{ byteToString(lockScript.scriptType) }</span>
          </Tooltip>
          <Tooltip title={"PublicKeyHash"} arrow>
            <span className={"PublicKeyHash"}>{(lockScript.script as codec.lockupScript.PublicKeyHash).publicKeyHash.toString('hex')}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2PKH</u> output, the public key hash is <span className={"PublicKeyHash"}>{(lockScript.script as codec.lockupScript.PublicKeyHash).publicKeyHash.toString('hex')}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 1) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{ byteToString(lockScript.scriptType) }</span>
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
                      <span className={`${className}`}>{publicKey.publicKeyHash.toString('hex')}</span>
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
          <br/>
          {
            (lockScript.script as codec.lockupScript.MultiSig).publicKeyHashes.value.map((publicKey, index) => {
              const className = index % 2 === 0 ? "PublicKeyHash" : "PublicKeyHashInverse"
              return (
                <>
                  <span className={`${className}`}>{publicKey.publicKeyHash.toString('hex')}</span>
                </>
              )
            })
          }
          <br/>
          The required number of signatures is <span className={"MultiSigRequiredKeys"}>{encodeToString(codec.compactUnsignedIntCodec, (lockScript.script as codec.lockupScript.MultiSig).m)}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 2) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{ byteToString(lockScript.scriptType) }</span>
          </Tooltip>
          <Tooltip title={"P2SHScriptHash"} arrow>
            <span className={"P2SHScriptHash"}>{(lockScript.script as codec.lockupScript.P2SH).scriptHash.toString('hex')}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2SH</u> output, the script hash is <span className={"P2SHScriptHash"}>{(lockScript.script as codec.lockupScript.P2SH).scriptHash.toString('hex')}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 3) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{ byteToString(lockScript.scriptType) }</span>
          </Tooltip>
          <Tooltip title={"P2CContractId"} arrow>
            <span className={"P2CContractId"}>{(lockScript.script as codec.lockupScript.P2C).contractId.toString('hex')}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2C</u> output, the contract id is <span className={"P2CContractId"}>{(lockScript.script as codec.lockupScript.P2C).contractId.toString('hex')}</span>
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
              <br/>
              <u>Fixed Output {index}: </u>
              <br/>
              <Tooltip title={"Amount"} arrow>
                <span className={"Amount"}>{encodeToString(codec.compactUnsignedIntCodec, output.amount)}</span>
              </Tooltip>
              { showLockScript(output.lockupScript) }
              <Tooltip title={"LockTime"} arrow>
                <span className={"LockTime"}>{output.lockTime.toString('hex')}</span>
              </Tooltip>
              <Tooltip title={"Tokens"} arrow>
                <span className={"Tokens"}>{encodeToString(codec.token.tokensCodec, output.tokens.value)}</span>
              </Tooltip>
              <Tooltip title={"AdditionalData"} arrow>
                <span className={"AdditionalData"}>{encodeToString(codec.byteStringCodec, output.additionalData)}</span>
              </Tooltip>
              <br/>
              { lockScriptDescription !== undefined && lockScriptDescription }
              <br/>
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
              <br/>
              <u>Contract Input {index}: </u>
              <br/>
              <Tooltip title={"OutputRefHint"} arrow>
                <span className={"OutputRefHint"}>{encodeToString(codec.signedIntCodec, contractOutputRef.hint)}</span>
              </Tooltip>
              <Tooltip title={"OutputRefKey"} arrow>
                <span className={"OutputRefKey"}>{contractOutputRef.key.toString('hex')}</span>
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
            <span className={"ScriptType"}>{ byteToString(lockScript.scriptType) }</span>
          </Tooltip>
          <Tooltip title={"PublicKeyHash"} arrow>
            <span className={"PublicKeyHash"}>{(lockScript.script as codec.lockupScript.PublicKeyHash).publicKeyHash.toString('hex')}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2PKH</u> output, the public key hash is <span className={"PublicKeyHash"}>{(lockScript.script as codec.lockupScript.PublicKeyHash).publicKeyHash.toString('hex')}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 1) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{ byteToString(lockScript.scriptType) }</span>
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
                      <span className={`${className}`}>{publicKey.publicKeyHash.toString('hex')}</span>
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
          <br/>
          {
            (lockScript.script as codec.lockupScript.MultiSig).publicKeyHashes.value.map((publicKey, index) => {
              const className = index % 2 === 0 ? "PublicKeyHash" : "PublicKeyHashInverse"
              return (
                <>
                  <span className={`${className}`}>{publicKey.publicKeyHash.toString('hex')}</span>
                </>
              )
            })
          }
          <br/>
          The required number of signatures is <span className={"MultiSigRequiredKeys"}>{encodeToString(codec.compactUnsignedIntCodec, (lockScript.script as codec.lockupScript.MultiSig).m)}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 2) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{ byteToString(lockScript.scriptType) }</span>
          </Tooltip>
          <Tooltip title={"P2SHScriptHash"} arrow>
            <span className={"P2SHScriptHash"}>{(lockScript.script as codec.lockupScript.P2SH).scriptHash.toString('hex')}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2SH</u> output, the script hash is <span className={"P2SHScriptHash"}>{(lockScript.script as codec.lockupScript.P2SH).scriptHash.toString('hex')}</span>
        </>
      )
      return result
    } else if (lockScript.scriptType === 3) {
      const result = (
        <>
          <Tooltip title={"ScriptType"} arrow>
            <span className={"ScriptType"}>{ byteToString(lockScript.scriptType) }</span>
          </Tooltip>
          <Tooltip title={"P2CContractId"} arrow>
            <span className={"P2CContractId"}>{(lockScript.script as codec.lockupScript.P2C).contractId.toString('hex')}</span>
          </Tooltip>
        </>
      )

      lockScriptDescription = (
        <>
          This is a <u>P2C</u> output, the contract id is <span className={"P2CContractId"}>{(lockScript.script as codec.lockupScript.P2C).contractId.toString('hex')}</span>
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
              <br/>
              <u>Generated Output {index}: </u>
              <br/>
              <Tooltip title={"OutputType"} arrow>
                <span className={"OutputType"}>{byteToString(output.either)}</span>
              </Tooltip>
              {
                output.either === 0 ? (
                  <>
                    <Tooltip title={"Amount"} arrow>
                      <span className={"Amount"}>{encodeToString(codec.compactUnsignedIntCodec, (output.value as codec.assetOutput.AssetOutput).amount)}</span>
                    </Tooltip>
                    { showLockScript((output.value as codec.assetOutput.AssetOutput).lockupScript) }
                    <Tooltip title={"LockTime"} arrow>
                      <span className={"LockTime"}>{(output.value as codec.assetOutput.AssetOutput).lockTime.toString('hex')}</span>
                    </Tooltip>
                    <Tooltip title={"Tokens"} arrow>
                      <span className={"Tokens"}>{encodeToString(codec.token.tokensCodec, (output.value as codec.assetOutput.AssetOutput).tokens.value)}</span>
                    </Tooltip>
                    <Tooltip title={"AdditionalData"} arrow>
                      <span className={"AdditionalData"}>{encodeToString(codec.byteStringCodec, (output.value as codec.assetOutput.AssetOutput).additionalData)}</span>
                    </Tooltip>
                    <br/>
                      { lockScriptDescription !== undefined && lockScriptDescription }
                    <br/>
                  </>
                ) : output.either === 1 ? (
                  <>
                    <Tooltip title={"Amount"} arrow>
                      <span className={"Amount"}>{encodeToString(codec.compactUnsignedIntCodec, (output.value as codec.contractOutput.ContractOutput).amount)}</span>
                    </Tooltip>
                    <Tooltip title={"ContractId"} arrow>
                      <span className={"ContractId"}>{(output.value as codec.contractOutput.ContractOutput).lockupScript.contractId.toString("hex")}</span>
                    </Tooltip>
                    <Tooltip title={"Tokens"} arrow>
                      <span className={"Tokens"}>{encodeToString(codec.token.tokensCodec, (output.value as codec.contractOutput.ContractOutput).tokens.value)}</span>
                    </Tooltip>
                    <br/>
                    This is a <u>P2C Output</u>, contract id is <span className={"Amount"}>{(output.value as codec.contractOutput.ContractOutput).lockupScript.contractId.toString("hex")}</span>
                    <br/>
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
              <br/>
              <u>Input Signature {index}: </u>
              <br/>
              <Tooltip title={"Signature"} arrow>
                <span className={`${className}`}>{signature.value.toString('hex')}</span>
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
  const instrsToName: { [code: string]: string} = {
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

export default TransactionRawComponent
