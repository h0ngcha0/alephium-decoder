import { Val } from '@alephium/web3/dist/src/api/api-alephium'
import _ from 'lodash'

const Locals = ({ vals }: { vals: Val[] }) => {
  return (
    <div className="ScriptOpCodeList">
      {_(vals)
        .map((val, index) => {
          const className = `OpCode ${val.type}`

          return (
            <div className={className} key={index}>
              <strong>{val.type}</strong><span style={{ opacity: 0.7 }}> {`${val.value}`}</span>
            </div>
          )
        })
        .value()}
    </div>
  )
}

export default Locals
