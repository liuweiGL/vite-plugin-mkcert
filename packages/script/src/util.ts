import path from 'path'

export const resolveRoot = (...paths: string[]) => {
  return path.resolve(__dirname, '../../../', ...paths)
}
