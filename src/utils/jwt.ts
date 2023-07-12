import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/models/request/user.request'

config()
export const signToken = ({
  payload,
  secretKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  secretKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, rejects) => {
    jwt.sign(payload, secretKey, options, (err, token) => {
      if (err) {
        rejects(err)
      }
      resolve(token as string)
    })
  })
}
export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) {
        reject(err)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
