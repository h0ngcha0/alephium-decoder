import _ from 'lodash'
import { codec } from '@alephium/web3'
import { instrToString } from '../services/utils'

const Instrs = ({ instrs }: { instrs: codec.Instr[] }) => {
  return (
    <div className="ScriptOpCodeList">
      {_(instrs)
        .map((instr, index) => {
          const [instrName, instrValue] = instrToString(instr)
          const className = `OpCode ${instrName}`

          return (
            <div className={className} key={index}>
              {instrName}{instrValue ? `: ${instrValue}` : null}
            </div>
          )
        })
        .value()}
    </div>
  )
}

export default Instrs