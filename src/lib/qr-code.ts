// ============================================================================
// QR CODE GENERATION UTILITY
// ============================================================================

import QRCode from 'qrcode'

export async function generateQRCode(
  text: string,
  options: {
    width?: number
    color?: { dark?: string; light?: string }
    type?: 'image/png' | 'image/jpeg'
  } = {}
): Promise<string> {
  const defaultOptions = {
    width: 300,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    type: 'image/png' as const,
    ...options,
  }

  try {
    const qrCode = await QRCode.toDataURL(text, {
      width: defaultOptions.width,
      color: defaultOptions.color,
      type: defaultOptions.type,
      margin: 2,
      errorCorrectionLevel: 'H',
    })
    return qrCode
  } catch (error) {
    console.error('QR code generation error:', error)
    throw error
  }
}

export async function generateQRCodeBuffer(text: string): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(text, {
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      margin: 2,
      errorCorrectionLevel: 'H',
    })
    return buffer
  } catch (error) {
    console.error('QR code buffer generation error:', error)
    throw error
  }
}

export function generateTableQRLink(
  outletSlug: string,
  tableNumber: string,
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
): string {
  return `${baseUrl}/m/${outletSlug}?table=${encodeURIComponent(tableNumber)}`
}
