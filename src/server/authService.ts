"use server"

import { prisma } from "@/lib/db"
import { signIn as authSignIn } from "@/lib/auth"
import { redirect } from "@/lib/navigation"
import { getLocale } from "next-intl/server"

type signInProps = {
	data: {
		email: string
	}
}

export const signIn = async ({ data }: signInProps) => {
	const user = await prisma.user.findUnique({
		where: {
			email: data.email
		}
	})

	if (!user) return { error: "ACCOUNT_NOT_FOUND" }

	//send email with verification link
	await authSignIn('nodemailer', {
		email: data.email,
		redirect: false
	})

	const currentLocale = await getLocale()

	redirect({ href: '/auth/verify-email', locale: currentLocale })
}

type signUpProps = {
	data: {
		email: string
		password: string
	}
}

export const signUp = async ({ data }: signUpProps) => {
	const user = await prisma.user.findUnique({
		where: {
			email: data.email
		}
	})

	if (user) return { error: "ACCOUNT_EXISTS" }
	const currentLocale = await getLocale()

	//create user
	await prisma.user.create({ data })

	//send email with verification link
	await authSignIn('nodemailer', {
		email: data.email,
		redirect: false
	})

	redirect({ href: '/auth/verify-email', locale: currentLocale })
}
