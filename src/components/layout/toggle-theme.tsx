"use client"

import { useTheme } from '@/hooks/useTheme'
import { Button, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import {MoonOutlined, SunOutlined} from '@ant-design/icons'

const ToggleThemeComponent = () => {
	const {theme, toggleTheme} = useTheme()

	const t = useTranslations('Layout')

  return (
	 <Tooltip title={t('toggle_theme_label')}>
		<Button
		onClick={toggleTheme}
		className='h-9 text-lg'
		type='text'
		>
			{theme === 'dark' ? < SunOutlined/> : <MoonOutlined />}
		</Button>
	 </Tooltip>
  )
}

export default ToggleThemeComponent