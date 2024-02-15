import React, { useEffect, useState, useCallback } from 'react'

import Loading from './Loading'
import TransactionRawComponent from './TransactionRawComponent'
import axios from 'axios'
import { Link } from '@mui/material'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AlephiumLogo from '../assets/alephium-logo.png'
import ScrollableTabs from './ScrollableTabs'
import { contractIdFromAddress, groupOfAddress } from '@alephium/web3'
import ContractBytecodeComponent from './ContractBytecodeComponent'

interface DecoderContainerProps {
  transactionIdOrContractAddress?: string
}

interface DecoderContainerState {
  transactionIdOrContractAddress?: string
  rawTransaction?: string
  contractBytecode?: string
  loading: boolean
  error: string | undefined
}

async function fetchTransaction(txId: string): Promise<{ raw: string }> {
  return (await axios.get(`https://alephium-0a5dc.alephium.org/transactions/details/${txId}`)).data
}

async function fetchContractBytecode(contractAddress: string): Promise<{ bytecode: string }> {
  const group = groupOfAddress(contractAddress)
  return (await axios.get(`https://alephium-0a5dc.alephium.org/contracts/${contractAddress}/state?group=${group}`)).data
}

function isContractAddress(transactionOrContract: string): boolean {
  try {
    contractIdFromAddress(transactionOrContract)
    return true
  } catch (e) {
    return false
  }
}

export const DecoderContainer: React.FunctionComponent<DecoderContainerProps> = (props) => {
  const [state, setState] = useState<DecoderContainerState>({
    transactionIdOrContractAddress: props.transactionIdOrContractAddress,
    rawTransaction: undefined,
    loading: false,
    error: undefined,
  })

  const loadTransactionOrContract = useCallback((transactionIdOrContractAddress: string) => {
    const contractAddress = isContractAddress(transactionIdOrContractAddress) ?
      transactionIdOrContractAddress : undefined
    setState({
      ...state,
      transactionIdOrContractAddress: transactionIdOrContractAddress,
      rawTransaction: undefined,
      contractBytecode: undefined,
      loading: true
    })

    if (contractAddress) {
      fetchContractBytecode(contractAddress)
        .then((response) => {
          setState({
            ...state,
            loading: false,
            error: undefined,
            rawTransaction: undefined,
            transactionIdOrContractAddress: contractAddress,
            contractBytecode: response.bytecode
          })
        })
        .catch((error) => {
          setState({
            ...state,
            loading: false,
            error: error.message
          })
        })
    } else {
      fetchTransaction(transactionIdOrContractAddress)
        .then((response) => {
          setState({
            ...state,
            loading: false,
            error: undefined,
            transactionIdOrContractAddress: transactionIdOrContractAddress,
            rawTransaction: response.raw,
            contractBytecode: undefined
          })
        })
        .catch((error) => {
          setState({
            ...state,
            loading: false,
            error: error.message
          })
        })
    }
  }, [])

  useEffect(() => {
    if (props.transactionIdOrContractAddress) {
      loadTransactionOrContract(props.transactionIdOrContractAddress)
    }
  }, [props.transactionIdOrContractAddress, loadTransactionOrContract])

  const handleSetTransactionIdOrContractAddress = (transactionIdOrContractAddress: string) => {
    setState({
      ...state,
      transactionIdOrContractAddress: transactionIdOrContractAddress
    })
  }

  return (
    <div className="container">
      <div className={'application-definition'}>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <img src={`${AlephiumLogo.src}`} style={{ maxWidth: '300px', marginBottom: '20px' }} />
          <Paper
            component="form"
            style={{ maxWidth: '300px', textAlign: 'center', margin: '0 auto', boxShadow: '2px 2px 2px 2px grey' }}
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
          >
            <InputBase
              value={state.transactionIdOrContractAddress}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Tx or Contract Address"
              inputProps={{ 'aria-label': 'search transaction or contract' }}
              onChange={(newValue) => handleSetTransactionIdOrContractAddress(newValue.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && state.transactionIdOrContractAddress) {
                  loadTransactionOrContract(state.transactionIdOrContractAddress)
                  e.preventDefault()
                }
              }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => state.transactionIdOrContractAddress && loadTransactionOrContract(state.transactionIdOrContractAddress)}>
              <SearchIcon />
            </IconButton>
          </Paper>
          {state.loading ? (
            <Loading />
          ) : (
            <span>
              <br />
              <span>
                {
                  (state.rawTransaction) && (
                    <Link
                      href={`https://explorer.alephium.org/transactions/${state.transactionIdOrContractAddress}`}
                      target="_blank"
                    >
                      View on Explorer
                    </Link>
                  )
                }
                {
                  (state.contractBytecode) && (
                    <Link
                      href={`https://explorer.alephium.org/addresses/${state.transactionIdOrContractAddress}`}
                      target="_blank"
                    >
                      View on Explorer
                    </Link>
                  )
                }
              </span>
              <div style={{ maxWidth: '480px', textAlign: 'center', margin: 'auto', marginTop: '16px' }}>
                {
                  state.error !== undefined ? (
                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                      {state.error}
                    </div>
                  ) : state.rawTransaction ? (
                    <ScrollableTabs
                      tabs={[
                        { title: 'Raw Transaction', children: <TransactionRawComponent txRaw={state.rawTransaction} breakDown={false} /> },
                        { title: 'Break Down', children: <TransactionRawComponent txRaw={state.rawTransaction} breakDown={true} /> }
                      ]}
                    />
                  ) : state.contractBytecode ? (
                    <ScrollableTabs
                      tabs={[
                        { title: 'Contract Bytecode', children: <ContractBytecodeComponent bytecode={state.contractBytecode} breakDown={false} /> },
                        { title: 'Break Down', children: <ContractBytecodeComponent bytecode={state.contractBytecode} breakDown={true} /> }
                      ]}
                    />
                  ) : undefined
                }
              </div>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
