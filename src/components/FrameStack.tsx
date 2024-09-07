import { addressFromContractId } from '@alephium/web3'
import { Val } from '@alephium/web3/dist/src/api/api-alephium'
import _, { method } from 'lodash'
import Locals from './Locals'
import OpStack from './OpStack'

type AddressBalance = [string, { attoAlphAmount: bigint, tokenAmounts: [string, bigint][] }]
type FrameStackProps = {
  frameStack: [(string | null), number][],
  locals: Val[],
  immFields: Val[],
  mutFields: Val[],
  opStack: Val[],
  balanceState?: {
    available: AddressBalance[],
    approved: AddressBalance[],
  }
}

const FrameStack = ({ frameStack, locals, immFields, mutFields, opStack, balanceState }: FrameStackProps) => {
  return (
    <div className="ScriptOpCodeList">
      {_(frameStack)
        .map((frameStackElem, index) => {
          const frame = frameStackElem[0]
          const methodIndex = frameStackElem[1]
          const className = frame === null ? "TxScriptFrame" : "ContractFrame"

          return (
            <div className={className} key={index}>
              {
                frame === null ?
                  <strong>TxScript</strong> :
                  <>
                    <strong>Contract</strong>
                    <span title="Contract Address" style={{ opacity: 0.6, marginLeft: '5px', fontSize: '0.95em' }}>{addressFromContractId(frame)}</span>
                    <span style={{
                      opacity: 0.7,
                      marginLeft: '3px',
                      color: '#555',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      padding: '1px 4px',
                      backgroundColor: '#f5f5f5'
                    }}
                      title="Method Index"
                    >
                      {methodIndex}
                    </span>
                  </>
              }

              {index === 0 && (
                <>
                  <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                    <h4 style={{ marginTop: '0', marginBottom: '10px', color: '#3f51b5' }}>Op Stack</h4>
                    <OpStack vals={opStack} />
                  </div>
                  {immFields.length > 0 && (
                    <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                      <h4 style={{ marginTop: '0', marginBottom: '10px', color: '#3f51b5' }}>Immutable Fields</h4>
                      <Locals vals={immFields} />
                    </div>
                  )}
                  {mutFields.length > 0 && (
                    <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                      <h4 style={{ marginTop: '0', marginBottom: '10px', color: '#3f51b5' }}>Mutable Fields</h4>
                      <Locals vals={mutFields} />
                    </div>
                  )}
                  {locals.length > 0 && (
                    <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                      <h4 style={{ marginTop: '0', marginBottom: '10px', color: '#3f51b5' }}>Local Variables</h4>
                      <Locals vals={locals} />
                    </div>
                  )}
                  {balanceState && (
                    <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                      <h4 style={{ marginTop: '0', marginBottom: '0', color: '#3f51b5' }}>Asset Balances</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                        <div>
                          <h5 style={{ color: '#2e7d32', marginBottom: '5px', fontSize: '0.9em' }}>Available</h5>
                          {balanceState.available.map(([address, balance], index) => (
                            <div key={index} style={{ marginBottom: '5px', padding: '8px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                <span style={{ fontWeight: 'bold', color: '#2196f3', fontFamily: 'monospace', fontSize: '0.8em' }}>
                                  {address.slice(0, 10)}...{address.slice(-10)}
                                </span>
                                <button
                                  onClick={() => navigator.clipboard.writeText(address)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#2196f3',
                                    fontSize: '1em',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                </button>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '5px' }}>
                                <span style={{ color: '#333', fontSize: '0.8em', fontWeight: 'bold' }}>ALPH</span>
                                <span style={{ wordBreak: 'break-all', color: '#4caf50', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '0.8em' }}>{balance.attoAlphAmount.toString()}</span>
                              </div>
                              {balance.tokenAmounts.map(([tokenId, amount], tokenIndex) => (
                                <div key={tokenIndex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flexGrow: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ color: '#333', fontSize: '0.75em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        Token <span style={{ color: '#757575' }}>{tokenId.slice(0, 10)}...{tokenId.slice(-10)}</span>
                                      </span>
                                      <button
                                        onClick={() => navigator.clipboard.writeText(tokenId)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          cursor: 'pointer',
                                          color: '#2196f3',
                                          fontSize: '1em',
                                          display: 'flex',
                                          alignItems: 'center',
                                          marginLeft: '5px'
                                        }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                      </button>
                                    </div>
                                    <span style={{ wordBreak: 'break-all', color: '#009688', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '0.75em' }}>{amount.toString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div>
                          <h5 style={{ color: '#c62828', marginBottom: '5px', fontSize: '0.9em' }}>Approved</h5>
                          {balanceState.approved.map(([address, balance], index) => (
                            <div key={index} style={{ marginBottom: '5px', padding: '8px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                <span style={{ fontWeight: 'bold', color: '#2196f3', fontFamily: 'monospace', fontSize: '0.8em' }}>
                                  {address.slice(0, 10)}...{address.slice(-10)}
                                </span>
                                <button
                                  onClick={() => navigator.clipboard.writeText(address)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#2196f3',
                                    fontSize: '1em',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                </button>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '5px' }}>
                                <span style={{ color: '#333', fontSize: '0.8em', fontWeight: 'bold' }}>ALPH</span>
                                <span style={{ wordBreak: 'break-all', color: '#4caf50', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '0.8em' }}>{balance.attoAlphAmount.toString()}</span>
                              </div>
                              {balance.tokenAmounts.map(([tokenId, amount], tokenIndex) => (
                                <div key={tokenIndex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flexGrow: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ color: '#333', fontSize: '0.75em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        Token <span style={{ color: '#757575' }}>{tokenId.slice(0, 10)}...{tokenId.slice(-10)}</span>
                                      </span>
                                      <button
                                        onClick={() => navigator.clipboard.writeText(tokenId)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          cursor: 'pointer',
                                          color: '#2196f3',
                                          fontSize: '1em',
                                          display: 'flex',
                                          alignItems: 'center',
                                          marginLeft: '5px'
                                        }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                      </button>
                                    </div>
                                    <span style={{ wordBreak: 'break-all', color: '#009688', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '0.75em' }}>{amount.toString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })
        .value()}
    </div>
  )
}

export default FrameStack