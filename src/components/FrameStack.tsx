import { addressFromContractId } from '@alephium/web3'
import _ from 'lodash'

const FrameStack = ({ frameStack }: { frameStack: (string | null)[] }) => {
  return (
    <div className="ScriptOpCodeList">
      {_(frameStack)
        .map((frame, index) => {
          const className = frame === null ? "TxScriptFrame" : "ContractFrame"

          return (
            <div className={className} key={index}>
              {frame === null ? <strong>TxScript</strong> : <><strong>Contract</strong> <span style={{ opacity: 0.7 }}>{addressFromContractId(frame)}</span></>}
            </div>
          )
        })
        .value()}
    </div>
  )
}

export default FrameStack