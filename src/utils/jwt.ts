import jwt, { SignOptions } from 'jsonwebtoken'

export const signToken = ({
   payload,
   secretKey = process.env.JWT_SECRET as string,
   option = { algorithm: 'HS256' }
}: {
   payload: string | object | Buffer
   secretKey?: string
   option?: SignOptions
}) => {
   return new Promise<string>((resolve, rejects) => {
      jwt.sign(payload, secretKey, option, (err, token) => {
         if (err) {
            rejects(err)
         }
         resolve(token as string)
      })
   })
}
