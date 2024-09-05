import { addressFromContractId } from '@alephium/web3'
import { Val } from '@alephium/web3/dist/src/api/api-alephium'
import _, { method } from 'lodash'
import Locals from './Locals'

const FrameStack = ({ frameStack, vals }: { frameStack: [(string | null), number][], vals: Val[] }) => {
  return (
    <div className="ScriptOpCodeList">
      {_(frameStack)
        .map((frameStackElem, index) => {
          const frame = frameStackElem[0]
          const methodIndex = frameStackElem[1]
          const className = frame === null ? "TxScriptFrame" : "ContractFrame"

          console.log("frameStackElem", frameStackElem)
          console.log("frame", frame)
          console.log("methodIndex", methodIndex)
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

              {index === 0 && vals.length > 0 && (
                <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                  <h4 style={{ marginTop: '0', marginBottom: '10px', color: '#3f51b5' }}>Local Variables</h4>
                  <Locals vals={vals} />
                </div>
              )}
            </div>
          )
        })
        .value()}
    </div>
  )
}

export default FrameStack