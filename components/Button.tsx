'use client'
import cn from '@/utils/cn'
import {Slot} from '@radix-ui/react-slot'
import * as React from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(className)} ref={ref} {...props} />
  },
)

Button.displayName = 'Button'

export default Button
