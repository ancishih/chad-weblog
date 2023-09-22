import cn from '@/utils/cn'

export default function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-300', className)}
      {...props}
    />
  )
}
