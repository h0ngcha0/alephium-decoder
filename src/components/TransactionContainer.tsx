import React, { useEffect, useState, useCallback } from 'react'

import Loading from './Loading'
import TransactionRawComponent from './TransactionRawComponent'
import axios from 'axios'
import { Link } from '@mui/material'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AlephiumLogo from '../assets/alephium-logo.png'

interface TransactionContainerProps {
  transactionId?: string
}

interface TransactionContainerState {
  transactionId?: string
  rawTransaction?: string
  loading: boolean
  error: string | undefined
}

async function fetchTransaction(txId: string): Promise<{raw: string}> {
    return (await axios.get(`https://alephium-0a5dc.alephium.org/transactions/details/${txId}`)).data
}

export const TransactionContainer: React.FunctionComponent<TransactionContainerProps> = (props) => {
  const [state, setState] = useState<TransactionContainerState>({
    transactionId: props.transactionId,
    rawTransaction: undefined,
    loading: false,
    error: undefined,
  })

  const loadTransaction = useCallback((transactionId: string) => {
    setState({
      ...state,
      rawTransaction: undefined,
      transactionId: transactionId,
      loading: true
    })

    fetchTransaction(transactionId)
      .then((rawTransaction) => {
        setState({
          ...state,
          loading: false,
          error: undefined,
          transactionId: transactionId,
          rawTransaction: rawTransaction.raw
        })
      })
      .catch((error) => {
        setState({
          ...state,
          loading: false,
          error: error.message
        })
      })
  }, [])

  useEffect(() => {
    if (props.transactionId) {
      loadTransaction(props.transactionId)
    }
  }, [props.transactionId, loadTransaction])

  const handleSetTransactionId = (txId: string) => {
    setState({
      ...state,
      transactionId: txId
    })
  }

  const executeAfterFetchTransaction = (state: any, func: any) => {
    if (state.error) {
      return (
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          {state.error}
        </div>
      )
    } else if (state.transaction) {
      return func(state.transaction)
    }
  }

  const showRawTransaction = () => {
    if (state.error) {
        return (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            {state.error}
          </div>
        )
    } else if (state.rawTransaction) {
        return (<TransactionRawComponent txRaw={state.rawTransaction} />)
    }
  }

  return (
    <div className="container">
      <div className={'application-definition'}>
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <img src={`${AlephiumLogo.src}`} style={{ maxWidth: '300px', marginBottom: '20px' }} />
        <Paper
          component="form"
          style={{ maxWidth: '500px', textAlign: 'center', margin: '0 auto', boxShadow: '2px 2px 2px 2px grey' }}
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <InputBase
            value={state.transactionId}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Transaction Id"
            inputProps={{ 'aria-label': 'search transaction id' }}
            onChange={(newValue) => handleSetTransactionId(newValue.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => state.transactionId && loadTransaction(state.transactionId)}>
            <SearchIcon />
          </IconButton>
        </Paper>
        {state.loading ? (
            <Loading />
          ) : (
            <span>
              <br/>
              <span>
                {
                    state.rawTransaction && (
                      <Link
                        href={`https://explorer.alephium.org/transactions/${state.transactionId}`}
                        target="_blank"
                      >
                        View on Explorer
                      </Link>
                    )
                }
              </span>
              <div style={{ maxWidth: '480px', textAlign: 'center', margin: 'auto', marginTop: '16px' }}>
                { showRawTransaction() }
              </div>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
