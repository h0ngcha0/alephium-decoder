import { addressFromContractId } from '@alephium/web3'
import { Val } from '@alephium/web3/dist/src/api/api-alephium'
import _ from 'lodash'
import Locals from './Locals'

const FrameStack = ({ frameStack, vals }: { frameStack: (string | null)[], vals: Val[] }) => {
  return (
    <div className="ScriptOpCodeList">
      {_(frameStack)
        .map((frame, index) => {
          const className = frame === null ? "TxScriptFrame" : "ContractFrame"

          return (
            <div className={className} key={index}>
              {frame === null ? <strong>TxScript</strong> : <><strong>Contract</strong> <span style={{ opacity: 0.7 }}>{addressFromContractId(frame)}</span></>}

              {index === 0 && vals.length > 0 && (
                <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                  <h4 style={{ marginTop: '0', marginBottom: '10px', color: '#3f51b5' }}>Locals</h4>
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