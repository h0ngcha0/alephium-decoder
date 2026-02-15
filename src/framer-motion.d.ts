import * as React from 'react'
import { MotionProps as OriginalMotionProps } from 'framer-motion'

declare module 'framer-motion' {
  type MotionDivProps = React.HTMLAttributes<HTMLDivElement> & OriginalMotionProps & {
    children?: React.ReactNode
  }

  type MotionSpanProps = React.HTMLAttributes<HTMLSpanElement> & OriginalMotionProps & {
    children?: React.ReactNode
  }

  export interface CustomMotion {
    div: React.ForwardRefExoticComponent<MotionDivProps & React.RefAttributes<HTMLDivElement>>
    span: React.ForwardRefExoticComponent<MotionSpanProps & React.RefAttributes<HTMLSpanElement>>
  }

  export const motion: CustomMotion
}
