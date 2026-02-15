import React, { useEffect, useState, useCallback } from 'react'

import AlephiumLogo from '../assets/alephium-logo.png'
import ContractBytecodeComponent from './ContractBytecodeComponent'
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Loading from './Loading'
import Paper from '@mui/material/Paper';
import ScrollableTabs from './ScrollableTabs'
import SearchIcon from '@mui/icons-material/Search';
import TransactionRawComponent from './TransactionRawComponent'
import TransactionReplayComponent from './TransactionReplayComponent'
import axios from 'axios'
import { Link, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { binToHex, contractIdFromAddress, groupOfAddress, hexToBinUnsafe } from '@alephium/web3'
import { codec } from '@alephium/web3'
import { AnimatedIntro } from './AnimatedIntro'

export type Network = 'mainnet' | 'testnet'

const networkConfig: Record<Network, { nodeUrl: string; explorerUrl: string }> = {
  mainnet: {
    nodeUrl: 'https://node.mainnet.alephium.org',
    explorerUrl: 'https://explorer.alephium.org',
  },
  testnet: {
    nodeUrl: 'https://node.testnet.alephium.org',
    explorerUrl: 'https://explorer.testnet.alephium.org',
  },
}

interface DecoderContainerProps {
  transactionIdOrContractAddress?: string
}

interface DecoderContainerState {
  transactionIdOrContractAddress?: string
  decodedTx?: codec.Transaction
  contractBytecode?: string
  loading: boolean
  error: string | undefined
}

async function fetchTransaction(txId: string, nodeUrl: string): Promise<any> {
  return (await axios.get(`${nodeUrl}/transactions/details/${txId}`)).data
}

async function fetchContractBytecode(contractAddress: string, nodeUrl: string): Promise<{ bytecode: string }> {
  const group = groupOfAddress(contractAddress)
  return (await axios.get(`${nodeUrl}/contracts/${contractAddress}/state?group=${group}`)).data
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
    decodedTx: undefined,
    loading: false,
    error: undefined,
  })
  const [showIntro, setShowIntro] = useState(true);
  const [network, setNetwork] = useState<Network>('mainnet');

  const { nodeUrl, explorerUrl } = networkConfig[network];

  const loadTransactionOrContract = useCallback((transactionIdOrContractAddress: string, currentNodeUrl: string) => {
    const contractAddress = isContractAddress(transactionIdOrContractAddress) ?
      transactionIdOrContractAddress : undefined
    setState({
      ...state,
      transactionIdOrContractAddress: transactionIdOrContractAddress,
      decodedTx: undefined,
      contractBytecode: undefined,
      loading: true
    })

    if (contractAddress) {
      fetchContractBytecode(contractAddress, currentNodeUrl)
        .then((response) => {
          setState({
            ...state,
            loading: false,
            error: undefined,
            decodedTx: undefined,
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
      fetchTransaction(transactionIdOrContractAddress, currentNodeUrl)
        .then((response) => {
          const rawTx = binToHex(codec.transactionCodec.encodeApiTransaction(response))
          setState({
            ...state,
            loading: false,
            error: undefined,
            transactionIdOrContractAddress: transactionIdOrContractAddress,
            decodedTx: codec.transactionCodec.decode(hexToBinUnsafe(rawTx)),
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
      loadTransactionOrContract(props.transactionIdOrContractAddress, nodeUrl)
    }
  }, [props.transactionIdOrContractAddress, loadTransactionOrContract, nodeUrl])

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
          <div style={{ marginBottom: '12px' }}>
            <ToggleButtonGroup
              value={network}
              exclusive
              onChange={(_, value) => { if (value) setNetwork(value) }}
              size="small"
            >
              <ToggleButton value="mainnet" sx={{ textTransform: 'none', fontSize: '12px', px: 2 }}>
                Mainnet
              </ToggleButton>
              <ToggleButton value="testnet" sx={{ textTransform: 'none', fontSize: '12px', px: 2 }}>
                Testnet
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <Paper
            component="form"
            style={{ maxWidth: '300px', textAlign: 'center', margin: '0 auto', boxShadow: '2px 2px 2px 2px grey' }}
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
          >
            <InputBase
              value={state.transactionIdOrContractAddress}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Tx Id or Contract Address"
              inputProps={{ 'aria-label': 'search transaction or contract' }}
              onChange={(newValue) => {
                handleSetTransactionIdOrContractAddress(newValue.target.value);
                setShowIntro(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && state.transactionIdOrContractAddress) {
                  loadTransactionOrContract(state.transactionIdOrContractAddress, nodeUrl)
                  e.preventDefault()
                }
              }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => state.transactionIdOrContractAddress && loadTransactionOrContract(state.transactionIdOrContractAddress, nodeUrl)}>
              <SearchIcon />
            </IconButton>
          </Paper>
          <AnimatedIntro isVisible={showIntro} />
          {state.loading ? (
            <Loading />
          ) : (
            <span>
              <br />
              <span>
                {
                  (state.decodedTx) && (
                    <Link
                      href={`${explorerUrl}/transactions/${state.transactionIdOrContractAddress}`}
                      target="_blank"
                    >
                      View on Explorer
                    </Link>
                  )
                }
                {
                  (state.contractBytecode) && (
                    <Link
                      href={`${explorerUrl}/addresses/${state.transactionIdOrContractAddress}`}
                      target="_blank"
                    >
                      View on Explorer
                    </Link>
                  )
                }
              </span>
              <div style={{ maxWidth: '600px', textAlign: 'center', margin: 'auto', marginTop: '16px' }}>
                {
                  state.error !== undefined ? (
                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                      {state.error}
                    </div>
                  ) : state.decodedTx ? (
                    <ScrollableTabs
                      tabs={
                        state.decodedTx.unsigned.statefulScript.kind === 'None' ? [
                          { title: 'Raw Tx', children: <TransactionRawComponent decoded={state.decodedTx} breakDown={false} /> },
                          { title: 'Break Down', children: <TransactionRawComponent decoded={state.decodedTx} breakDown={true} /> }
                        ] : [
                          { title: 'Raw Tx', children: <TransactionRawComponent decoded={state.decodedTx} breakDown={false} /> },
                          { title: 'Break Down', children: <TransactionRawComponent decoded={state.decodedTx} breakDown={true} /> },
                          { title: 'Replay', children: <TransactionReplayComponent txId={state.transactionIdOrContractAddress!} nodeUrl={nodeUrl} /> }
                        ]
                      }
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
