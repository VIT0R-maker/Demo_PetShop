import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl, isValidWhatsApp } from './contact'

describe('WhatsApp contact', () => {
  it('requires an international number without embedded URL or formatting', () => {
    for (const invalid of [null, undefined, '', '123', '05511999999999', '55 11 99999-9999', 'https://wa.me/5511999999999', '55119999999999999']) {
      expect(isValidWhatsApp(invalid)).toBe(false)
    }
    expect(isValidWhatsApp('+5511999999999')).toBe(true)
    expect(isValidWhatsApp('5511999999999')).toBe(true)
  })

  it('encodes Portuguese text, user punctuation and line breaks in one query parameter', () => {
    const url = new URL(buildWhatsAppUrl('+5511999999999', {
      tutor: '  João & Ana  ',
      pet: '  Amêndoa  ',
      species: 'cao',
      interest: 'Hidratação',
      message: 'Pode ser às 14h?\nBanho & escovação, por favor! #cuidado',
    }))
    expect(url.origin).toBe('https://wa.me')
    expect(url.pathname).toBe('/5511999999999')
    expect([...url.searchParams.keys()]).toEqual(['text'])
    expect(url.searchParams.get('text')).toContain('Tutor: João & Ana\nPet: Amêndoa\nEspécie: Cão\nInteresse: Hidratação')
    expect(url.searchParams.get('text')).toContain('Pode ser às 14h?\nBanho & escovação, por favor! #cuidado')
    expect(url.hash).toBe('')
  })

  it('omits optional values and treats products as an inquiry', () => {
    const text = new URL(buildWhatsAppUrl('5511999999999', {
      tutor: 'Maria', pet: ' ', species: 'gato', interest: 'Produtos para pets', message: '',
    })).searchParams.get('text')!
    expect(text).toContain('Espécie: Gato')
    expect(text).toContain('Interesse: Produtos para pets')
    expect(text).not.toContain('\nPet:')
    expect(text).not.toContain('Mensagem:')
    expect(text).not.toContain('confirmado')
  })

  it('refuses missing configuration and incomplete contact details', () => {
    expect(() => buildWhatsAppUrl('', { tutor: 'Maria', species: 'cao', interest: 'Banho' })).toThrow()
    expect(() => buildWhatsAppUrl('5511999999999', { tutor: ' ', species: 'cao', interest: 'Banho' })).toThrow()
    expect(() => buildWhatsAppUrl('5511999999999', { tutor: 'Maria', species: 'gato', interest: '' })).toThrow()
  })
})
