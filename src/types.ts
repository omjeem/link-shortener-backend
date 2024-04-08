import z from "zod"


export const userTypeSignUp = z.object({
   username : z.string(),
   email : z.string(),
   password : z.string()  
})

export const userTypeSignIn = z.object({
    username : z.string(),
    password : z.string()
})

export const linkType = z.object({
    url : z.string()
})

export  const updateProfile = z.object({
    username : z.string().optional(),
    password : z.string().optional()
})


