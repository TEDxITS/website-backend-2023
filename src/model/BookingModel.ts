export interface BookingDetailRequest {
    name: string
    email: string
    phoneNumber: string
    ticketId: string
}

export interface BookingDetailDataModel extends BookingDetailRequest {
    bookingId: string
}

export interface UploadPaymentRequest {
    bookingId: string
    paymentProof: string
}

export enum BookingStatus {
    MENUNGGU_PEMBAYARAN = 'MENUNGGU_PEMBAYARAN',
    MENUNGGU_VERIFIKASI = 'MENUNGGU_VERIFIKASI',
    TERVERIFIKASI = 'TERVERIFIKASI',
}