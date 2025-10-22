import fs from 'fs'
import path from 'path'
import { Wechatpay } from 'wechatpay-node-v3'
import { callTransfer } from '../lib/cloudbase.js'

const pay = new Wechatpay({
  mchid: process.env.MCH_ID,
  serial: process.env.MCH_SERIAL,
  privateKey: fs.readFileSync(path.join(process.cwd(),'certs/apiclient_key.pem')),
  certs: { [process.env.WECHATPAY_SERIAL]: fs.readFileSync(path.join(process.cwd(),'certs/wechatpay_*.pem')) }
})

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { headers, body } = req
    const { decrypt } = await pay.middleware.request(body, headers['wechatpay-signature'])
    console.log('支付成功', decrypt.out_trade_no)
    await callTransfer(decrypt.out_trade_no)   // 调用云开发转账
    res.status(200).send('SUCCESS')
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}