import { cn } from '@/lib/utils'

type ButtonVariant =
  'default' | 'destructive' | 'outline' | 'muted' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'
type BadgeVariant = 'default' | 'muted' | 'destructive' | 'outline'

const buttonBase =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const buttonVariantClasses: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive:
    'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
  outline:
    'border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
  muted: 'bg-muted text-foreground hover:bg-muted/80',
  ghost: 'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50',
  link: 'text-primary underline-offset-4 hover:underline',
}

const buttonSizeClasses: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2 has-[>svg]:px-3',
  sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
  lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
  icon: 'size-9',
}

const badgeBase =
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] aria-invalid:border-destructive aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3'

const badgeVariantClasses: Record<BadgeVariant, string> = {
  default:
    'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
  muted: 'border-transparent bg-muted text-foreground [a&]:hover:bg-muted/90',
  destructive:
    'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/70 dark:focus-visible:ring-destructive/40',
  outline: 'text-foreground [a&]:hover:bg-muted [a&]:hover:text-foreground',
}

export function buttonVariants({
  variant = 'default',
  size = 'default',
  className,
  class: classValue,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  class?: string
} = {}) {
  return cn(
    buttonBase,
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    className,
    classValue,
  )
}

export function badgeVariants({
  variant = 'default',
  className,
  class: classValue,
}: {
  variant?: BadgeVariant
  className?: string
  class?: string
} = {}) {
  return cn(badgeBase, badgeVariantClasses[variant], className, classValue)
}
