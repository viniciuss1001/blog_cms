import { intl } from '@/config/intl'
import { createNavigation } from 'next-intl/navigation'

export const { Link, redirect, usePathname, useRouter } = createNavigation({ locales: intl.locales })