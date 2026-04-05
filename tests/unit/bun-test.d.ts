declare module 'bun:test' {
  export const describe: (...args: any[]) => void
  export const expect: (value: any) => any
  export const it: (...args: any[]) => void
}
