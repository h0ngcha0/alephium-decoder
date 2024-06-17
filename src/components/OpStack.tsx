import { Val } from '@alephium/web3/dist/src/api/api-alephium'
import _ from 'lodash'

const OpStack = ({ vals }: { vals: Val[] }) => {
  return (
    <div className="ScriptOpCodeList">
      {_(vals)
        .map((val, index) => {
          const className = `OpCode ${val.type}`

          return (
            <div className={className} key={index}>
              {val.type}: {`${val.value}`}
            </div>
          )
        })
        .value()}
    </div>
  )
}

export default OpStack