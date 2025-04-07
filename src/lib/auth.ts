import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import {PrismaAdapter} from '@auth/prisma-adapter' 
import { prisma } from "./db"
import Nodemailer from 'next-auth/providers/nodemailer'


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter:PrismaAdapter(prisma),
  providers: [
    Google, 
    Facebook,
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER, 
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        secure: true
      },
      from: process.env.EMAIL_FROM
    })
  ],
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
    error: '/auth/error'
  },
  callbacks: {
    async session({session, user, token}) {
      return session
    }
  }
})