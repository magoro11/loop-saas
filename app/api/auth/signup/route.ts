import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "../../../../lib/prisma"
import { hashPassword } from "../../../../lib/auth"
import { authOptions } from "../../../../lib/nextauth"
import { getServerSession } from "next-auth/next"
import { Role } from "@prisma/client"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  workspaceName: z.string().min(2, "Workspace name must be at least 2 characters"),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user) {
      return NextResponse.json({ error: "Already signed in" }, { status: 400 })
    }

    const body = await request.json()
    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }

    const { name, email, password, workspaceName } = parsed.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    const workspace = await prisma.workspace.create({
      data: {
        name: workspaceName,
        users: {
          create: {
            email,
            name,
            passwordHash,
            role: Role.ADMIN,
          },
        },
      },
      include: {
        users: true,
      },
    })

    return NextResponse.json(
      {
        message: "Workspace created successfully",
        workspace: {
          id: workspace.id,
          name: workspace.name,
          user: workspace.users[0],
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
