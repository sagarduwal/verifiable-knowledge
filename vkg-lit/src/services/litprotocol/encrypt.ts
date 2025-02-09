import { getLitNodeClient } from './utils'

export const encryptString = async (connectedAddress, stringToEncrypt) => {
  try {
    console.log('connectedAddress: ', connectedAddress)
    let litNodeClient

    litNodeClient = await getLitNodeClient()

    const accessControlConditions = [
      {
        contractAddress: '0xA474d1C455058EaB59DdA82A5C7321b1e21Cd63b',
        standardContractType: '',
        chain: 'baseSepolia',
        method: 'balanceOf',
        parameters: [':account', connectedAddress, ':id', '1'],
        returnValueTest: {
          comparator: '>=',
          value: '0',
        },
      },
    ]

    const { ciphertext, dataToEncryptHash } = await litNodeClient.encrypt({
      dataToEncrypt: new TextEncoder().encode(stringToEncrypt),
      accessControlConditions,
    })
    console.log(ciphertext)
    console.log(dataToEncryptHash)
    return { ciphertext, dataToEncryptHash }
  } catch (ex) {
    console.log(ex)
  }
}
