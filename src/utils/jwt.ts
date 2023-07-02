import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'

config()
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
export const verifyToken = ({
   token,
   secretOrPublicKey = process.env.JWT_SECRET as string
}: {
   token: string
   secretOrPublicKey?: string
}) => {
   return new Promise<jwt.JwtPayload>((resolve, reject) => {
      jwt.verify(token, secretOrPublicKey, (err, decoded) => {
         if (err) {
            reject(err)
         }
         resolve(decoded as jwt.JwtPayload)
      })
   })
}
