import * as z from "zod";



export const SignupValidation = z.object({
  name: z.string().min(2, { message: 'Too short'}),
  username: z.string().min(2, { message: 'Too short'}),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.'}),

})

export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.'}),
  })

export const PostValidation = z.object({
  Update: z.string().min(5).max(2200),
  Good: z.string().max(2200),
  Bad: z.string().max(2200),
  tags: z.string(),
})

export const StatusValidation = z.object({
  Status: z.string().min(1).max(60),
  //statusUrl: z.string().url(),
})

  