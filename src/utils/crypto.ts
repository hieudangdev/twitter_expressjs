import { createHash } from 'crypto'

export default function hashPassword(password: string) {
  const newPassword = createHash('sha256').update(password).digest('hex') + process.env.PASSWORD_KEYSECRET
  return newPassword
}
