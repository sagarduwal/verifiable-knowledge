export const uploadToWalrus = async (connectedAddress, stringToEncrypt) => {
  console.log('connectedAddress: ', connectedAddress)

  console.log('stringToEncrypt: ', stringToEncrypt)
  const jsonString = typeof stringToEncrypt === 'string' ? stringToEncrypt : JSON.stringify(stringToEncrypt)
  const encryptedBlob = new Blob([jsonString], { type: 'application/json' })

  const fileName = `encrypted-${Date.now()}.txt`
  const encryptedFile = new File([encryptedBlob], fileName)

  // Upload the file to Walrus
  const walrusResponse = await fetch('https://publisher.walrus-testnet.walrus.space/v1/blobs', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: encryptedFile,
  })

  if (!walrusResponse.ok) {
    throw new Error('Failed to store data with Walrus publisher')
  }

  const walrusResult = await walrusResponse.json()
  const blobId = walrusResult.newlyCreated.blobObject.blobId
  const blobUrl = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`

  console.log('Stored with Walrus, blob ID:', blobId)

  return {
    hash: blobId,
    url: blobUrl,
  }
}
