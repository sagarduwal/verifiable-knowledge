import { Request, Response, NextFunction } from 'express'
import { encryptString } from '../../services/litprotocol/encrypt'
import { uploadToWalrus } from '../../services/walrus/upload'

const encrypt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { connectedWallet, stringToEncrypt } = req.body
    console.log(req.body)
    let encryptResponse = await encryptString(connectedWallet, stringToEncrypt)

    if (encryptResponse) {
      let uploadedResponse = await uploadToWalrus(connectedWallet, encryptResponse)
      res.json({
        data: { encrypted: encryptResponse, uploaded: uploadedResponse },
      })
    } else {
      res.json({ data: { encrypt: encryptResponse } })
    }
  } catch (error) {
    next(error)
  }
}

export default {
  encrypt,
}
