import cloudbase from '@cloudbase/node-sdk'
const app = cloudbase.init({ env: process.env.CLOUDBASE_ENV })
const db = app.database()

export async function callTransfer(orderNo) {
  await db.collection('orders').doc(orderNo).update({ status: 'paid' })
  await app.callFunction({ name: 'transfer', data: { orderNo } })
}