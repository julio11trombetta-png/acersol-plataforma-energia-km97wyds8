import pb from '@/lib/pocketbase/client'

export const getBankAccounts = () =>
  pb.collection('bank_accounts').getFullList({ sort: '-created' })

export const createBankAccount = (data: {
  bankName: string
  agency?: string
  accountNumber?: string
  balance?: number
}) => pb.collection('bank_accounts').create(data)

export const updateBankAccount = (id: string, data: any) =>
  pb.collection('bank_accounts').update(id, data)

export const deleteBankAccount = (id: string) => pb.collection('bank_accounts').delete(id)
