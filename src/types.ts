export interface KvantSchema<Output, Input = Output, RawInput = unknown> {
  readonly parse: (value: RawInput) => Output
  readonly encode: (value: Output) => Input
}
