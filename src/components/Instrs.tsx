import _ from 'lodash'
import { codec } from '@alephium/web3'
import { getInstrName } from '../services/utils'

const Instrs = ({ instrs }: { instrs: codec.Instr[] }) => {
  return (
    <div className="ScriptOpCodeList">
      {_(instrs)
        .map((instr, index) => {
          const instrName = getInstrName(instr.code)
          const className = `OpCode ${instrName}`

          return (
            <div className={className} key={index}>
              {getInstrName(instr.code)}
            </div>
          )
        })
        .value()}
    </div>
  )
}

export default Instrs