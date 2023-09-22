'use client'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import React from 'react'
import cn from '@/utils/cn'
import {FaChevronDown} from 'react-icons/fa'
// export

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({className, children, ...props}, ref) => (
  <AccordionPrimitive.Root ref={ref} className={cn('', className)} {...props}>
    {children}
  </AccordionPrimitive.Root>
))

Accordion.displayName = 'Accordion'

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({className, ...props}, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('ring-blue-600 rounded-sm', className)}
    {...props}
  />
))

AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({className, children, ...props}, ref) => (
  <AccordionPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex w-full text-lg h-10 justify-between items-center px-2.5 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]:focus]:ring-2 [&[data-state=closed]:focus]:ring-2 ring-blue-600 rounded-sm transition-shadow',
      'hover:bg-blue-50',
      className,
    )}
    {...props}
  >
    {children}
    <FaChevronDown aria-hidden className='text-slate-400' />
  </AccordionPrimitive.Trigger>
))

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({className, children, ...props}, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden px-3 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className,
    )}
    {...props}
  >
    <div className='transition-all pt-0.5'>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export {Accordion, AccordionItem, AccordionTrigger, AccordionContent}
