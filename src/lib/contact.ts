export type ContactDetails = {
  tutor: string
  pet?: string
  species: 'cao' | 'gato'
  interest: string
  message?: string
}

/** International format: country code, area code and number; optional leading +. */
export function isValidWhatsApp(phone: string | null | undefined): phone is string {
  return typeof phone === 'string' && /^\+?[1-9]\d{7,14}$/.test(phone)
}

/** Creates a link only; never sends a message or confirms an appointment. */
export function buildWhatsAppUrl(phone: string, details: ContactDetails): string {
  if (!isValidWhatsApp(phone)) {
    throw new Error('Configure um WhatsApp válido com código do país e DDD.')
  }
  if (!details.tutor.trim() || !details.interest.trim() || !['cao', 'gato'].includes(details.species)) {
    throw new Error('Informe tutor, espécie e interesse antes de continuar.')
  }

  const lines = [
    'Olá! Gostaria de conversar sobre os cuidados com meu pet.',
    '',
    `Tutor: ${details.tutor.trim()}`,
    ...(details.pet?.trim() ? [`Pet: ${details.pet.trim()}`] : []),
    `Espécie: ${details.species === 'cao' ? 'Cão' : 'Gato'}`,
    `Interesse: ${details.interest.trim()}`,
    ...(details.message?.trim() ? ['', `Mensagem: ${details.message.trim()}`] : []),
    '',
    'Gostaria de consultar a disponibilidade com a equipe.',
  ]

  return `https://wa.me/${phone.replace(/^\+/, '')}?text=${encodeURIComponent(lines.join('\n'))}`
}
