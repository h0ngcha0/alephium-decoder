import FrameStack from './FrameStack'
import Instrs from './Instrs'
import Loading from './Loading'
import Locals from './Locals'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import OpStack from './OpStack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { Grid } from '@mui/material'
import { Val } from '@alephium/web3/dist/src/api/api-alephium'
import { codec, hexToBinUnsafe } from '@alephium/web3'
import { getInstrName, instrToString } from '../services/utils'
import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

interface TransactionReplayComponentProps {
  txId: string
}

interface FrameSnapshot {
  currentInstr: codec.Instr
  remainingInstrs: codec.Instr[],
  contractId?: string,
  locals: Val[],
  opStack: Val[],
  frameStack: (string | null)[]
}

interface TransactionReplayState {
  step: number
  automatic: boolean
  loading: boolean
  frameSnapshots: FrameSnapshot[]
}

export const TransactionReplayComponent: React.FunctionComponent<TransactionReplayComponentProps> = (props) => {
  const { txId } = props
  const [state, setState] = useState<TransactionReplayState>({
    step: 0,
    loading: true,
    automatic: false,
    frameSnapshots: []
  })

  const executionDescriptionComponent = (instr: codec.Instr) => {
    const [instrName, instrValue] = instrToString(instr)

    return (
      <div style={{ maxWidth: '480px', textAlign: 'center', marginTop: '20px', wordWrap: 'break-word' }}>
        <span>
          <span style={{ textDecoration: 'underline' }}></span><span className={`OpCode ${instrName}`}>{instrName}{instrValue ? `: ${instrValue}` : null}</span>
        </span>{' '}
      </div>
    )
  }

  const loadTransactionExecution = useCallback(() => {
    setState({ ...state, loading: true })

    executeTransaction(txId)
      .then((response) => {
        setState({
          ...state,
          loading: false,
          automatic: false,
          frameSnapshots: toFrameSnapshots(response)
        })
      })
      .catch((error) => {
        console.error("Loading execution steps failed", error)
        setState({
          ...state,
          loading: false,
          automatic: false,
          frameSnapshots: []
        })
      })
  }, [])

  useEffect(() => {
    loadTransactionExecution()
  }, [txId])

  if (state.loading) {
    return <Loading />
  }

  const prevNextButtons = () => {
    const maxStep = state.frameSnapshots.length - 1

    const calculatePrevStep = () => {
      if (state.step > 0) {
        setState({ ...state, step: state.step - 1 })
      }
    }

    const calculateNextStep = () => {
      if (state.step < maxStep) {
        setState({ ...state, step: state.step + 1 })
      }
    }

    if (!state.automatic) {

      const disabledIconStyle = { verticalAlign: 'middle', fontSize: '16px', color: 'grey' }
      const activeIconStyle = { verticalAlign: 'middle', fontSize: '16px', color: 'rgb(219, 56, 111)' }
      const prevStepClassName = state.step <= 0 ? 'not-active' : 'prevnext'
      const prevStepIconStyle = state.step <= 0 ? disabledIconStyle : activeIconStyle
      const nextStepClassName = state.step >= maxStep ? 'not-active' : 'prevnext'
      const nextStepIconStyle = state.step >= maxStep ? disabledIconStyle : activeIconStyle

      return (
        <div style={{ maxWidth: '550px', textAlign: 'center', margin: '0 auto', marginTop: '30px' }}>
          <Grid container>
            <Grid item sm={4} xs={4}>
              <div>
                <NavigateBeforeIcon style={prevStepIconStyle} />
                <a className={prevStepClassName} onClick={calculatePrevStep}>
                  <span style={{ fontSize: '14px' }}>Prev</span>
                </a>
              </div>
            </Grid>
            <Grid item sm={4} xs={4}>
              <div style={{ fontSize: '14px', color: 'grey' }}>
                [ {state.step}/{maxStep} ]
              </div>
            </Grid>
            <Grid item sm={4} xs={4}>
              <div>
                <a className={nextStepClassName} onClick={calculateNextStep}>
                  <span style={{ fontSize: '14px' }}>Next</span>
                </a>
                <NavigateNextIcon style={nextStepIconStyle} />
              </div>
            </Grid>
          </Grid>
        </div >
      )
    } else {
      return null
    }
  }

  return (
    <div style={{ maxWidth: '480px', textAlign: 'left', marginTop: '20px', wordWrap: 'break-word' }}>
      {prevNextButtons()}

      <Table padding="none">
        <TableHead>
          <TableRow>
            <TableCell style={{ height: '48px' }}>
              <Typography color="textSecondary" variant="caption">
                Frame Stack
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{ whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '120px', height: '48px' }}>

              <FrameStack frameStack={state.frameSnapshots[state.step].frameStack.slice().reverse()} />

            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {executionDescriptionComponent(state.frameSnapshots[state.step].currentInstr)}

      <Table padding="none">
        <TableHead>
          <TableRow>
            <TableCell style={{ height: '48px' }}>
              <Typography color="textSecondary" variant="caption">
                Instrs
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{ whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '120px', height: '48px' }}>
              <div style={{ marginTop: '5px' }}>
                <Instrs instrs={state.frameSnapshots[state.step].remainingInstrs} />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table padding="none">
        <TableHead>
          <TableRow>
            <TableCell style={{ height: '48px' }}>
              <Typography color="textSecondary" variant="caption">
                Op Stack
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{ whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '120px', height: '48px' }}>
              <div style={{ marginTop: '5px' }}>
                <OpStack vals={state.frameSnapshots[state.step].opStack.slice().reverse()} />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table padding="none">
        <TableHead>
          <TableRow>
            <TableCell style={{ height: '48px' }}>
              <Typography color="textSecondary" variant="caption">
                Locals
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{ whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '120px', height: '48px' }}>
              <div style={{ marginTop: '5px' }}>
                <Locals vals={state.frameSnapshots[state.step].locals} />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

function toFrameSnapshots(response: any) {
  return response.frameSnapshots.map((snapshot: any) => {
    return {
      currentInstr: codec.instrCodec.decode(hexToBinUnsafe(snapshot.currentInstr)),
      remainingInstrs: snapshot.remainingInstrs.map((instr: any) => codec.instrCodec.decode(hexToBinUnsafe(instr))),
      contractId: snapshot.contractId,
      locals: snapshot.locals,
      opStack: snapshot.opStack,
      frameStack: snapshot.frameStack
    }
  })
}

async function executeTransaction(id: string): Promise<{ frameSnapshots: FrameSnapshot[] }> {
  return (await axios.post(`https://alephium-d13e6g.alephium.org/transactions/execute?fromGroup=0&toGroup=0`, { id }, {
    headers: {
      "X-API-KEY": "017941ed977eb0bd94708a5bfcff4ca22a5a7980ccd9677f8a44a019a59655cb"
    }
  })).data
}



TransactionReplayComponent.propTypes = {
  txId: PropTypes.string.isRequired
}

export default TransactionReplayComponent
