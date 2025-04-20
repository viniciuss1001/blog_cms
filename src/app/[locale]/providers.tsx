"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { theme as antdTheme, ConfigProvider } from "antd";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import enUS from 'antd/locale/en_US';
import ptBR from 'antd/locale/pt_BR';
import 'react-quill/dist/quill.snow.css';
import { useTheme } from "@/hooks/useTheme";
import { ThemeProvider } from "@/components/layout/theme/theme-provider";

const { defaultAlgorithm, darkAlgorithm } = antdTheme;

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const { theme, getSavedTheme } = useTheme()

    const locale = useLocale()

    return (
        <StyleProvider layer>
            <AntdRegistry>
                <ThemeProvider

                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange>
                    <ConfigProvider

                        locale={locale === 'pt-BR' ? ptBR : enUS}
                    >
                        {children}
                    </ConfigProvider>
                </ThemeProvider>
            </AntdRegistry>
        </StyleProvider>
    )
}