import { apiClient } from "./apiClient.api"

export interface CreditPackage {
  id: string
  name: string
  credits: number
  priceVnd: number
  bonusCredit: number
  isActive: boolean
}

export interface PaymentInitiateResponse {
  transactionId: string
  qrImageUrl: string
  accountNumber: string
  bankName: string
  amountVnd: number
  transferMemo: string
  credits: number
  expiredAt: string
}

export interface PaymentStatusResponse {
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  transactionId: string
  credits: number
  amountVnd: number
}

export const paymentApi = {
  getPackages: () =>
    apiClient.get<CreditPackage[]>("/payment/packages"),

  initiatePayment: (packageId: string) =>
    apiClient.post<PaymentInitiateResponse>("/payment/initiate", { packageId }),

  checkStatus: (transactionId: string) =>
    apiClient.get<PaymentStatusResponse>(`/payment/status/${transactionId}`)
}
