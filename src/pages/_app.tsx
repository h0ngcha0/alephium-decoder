import React, { Component } from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles'
//import blue from '@mui/material/colors/blue'
import Helmet from 'react-helmet'
import 'flexboxgrid'

const theme = createTheme(
  adaptV4Theme({
    palette: {
      primary: { 500: '#2196f3' }
    }
  })
)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
        <Helmet key="helmet" defaultTitle="alph.reverse" titleTemplate="%s - alph.reverse" />
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </StyledEngineProvider>
      </React.Fragment>
  )
}
