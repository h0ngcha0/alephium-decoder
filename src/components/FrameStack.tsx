import { addressFromContractId } from '@alephium/web3'
import _ from 'lodash'

const FrameStack = ({ frameStack }: { frameStack: (string | null)[] }) => {
  return (
    <div className="ScriptOpCodeList">
      {_(frameStack)
        .map((frame, index) => {
          const className = `OpCode`

          return (
            <div className={className} key={index}>
              {frame === null ? "TxScript" : `Contract: ${addressFromContractId(frame)}`}
            </div>
          )
        })
        .value()}
    </div>
  )
}

export default FrameStack