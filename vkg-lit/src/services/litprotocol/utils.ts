import { LitNodeClient } from '@lit-protocol/lit-node-client'
import { LitNetwork } from '@lit-protocol/constants'

export const getLitNodeClient = async () => {
  const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.DatilDev,
    debug: true,
  })
  await litNodeClient.connect()
  return litNodeClient
}
