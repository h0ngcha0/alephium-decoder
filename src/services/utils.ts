import { binToHex, codec } from '@alephium/web3'

export function encodeToString<T>(codec: codec.Codec<T>, input: T) {
  return binToHex(codec.encode(input))
}

export function byteToString(input: number): string {
  return binToHex(Uint8Array.from([input]))
}

export function instrToString(instr: codec.Instr): [string, string | undefined] {
  const instrName = instr.name
  const instrValue = binToHex(codec.instrCodec.encode(instr))

  return [instrName!, instrValue]
}

export function encodeAssetModifier(arg: {
  usePreapprovedAssets: boolean
  useContractAssets: boolean
  usePayToContractOnly: boolean
}): number {
  const encoded =
    !arg.usePreapprovedAssets && !arg.useContractAssets
      ? 0
      : arg.usePreapprovedAssets && arg.useContractAssets
        ? 1
        : !arg.usePreapprovedAssets && arg.useContractAssets
          ? 2
          : 3
  return encoded | (arg.usePayToContractOnly ? 4 : 0)
}
