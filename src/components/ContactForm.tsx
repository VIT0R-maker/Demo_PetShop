import { useId, useRef, useState, type FormEvent } from 'react'
import { business } from '../config/business'
import { buildWhatsAppUrl, isValidWhatsApp } from '../lib/contact'

type ContactFormProps = {
  selectedService: string
  onServiceChange: (value: string) => void
}

type Errors = Partial<Record<'tutor' | 'species' | 'interest', string>>

export function ContactForm({ selectedService, onServiceChange }: ContactFormProps) {
  const id = useId()
  const [tutor, setTutor] = useState('')
  const [pet, setPet] = useState('')
  const [species, setSpecies] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState('')
  const tutorRef = useRef<HTMLInputElement>(null)
  const speciesRef = useRef<HTMLSelectElement>(null)
  const interestRef = useRef<HTMLSelectElement>(null)
  const whatsappReady = isValidWhatsApp(business.whatsapp)
  const interestError = business.services.some((service) => service.id === selectedService) ? undefined : errors.interest

  function clearError(field: keyof Errors) {
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    const nextErrors: Errors = {}
    if (!tutor.trim()) nextErrors.tutor = 'Informe o nome do tutor.'
    if (species !== 'cao' && species !== 'gato') nextErrors.species = 'Selecione cão ou gato.'
    const service = business.services.find((item) => item.id === selectedService)
    if (!service) nextErrors.interest = 'Selecione um interesse para continuar.'
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.tutor) tutorRef.current?.focus()
      else if (nextErrors.species) speciesRef.current?.focus()
      else interestRef.current?.focus()
      return
    }

    if (!isValidWhatsApp(business.whatsapp)) {
      setStatus('O canal de atendimento será disponibilizado em breve. Nenhuma mensagem foi enviada.')
      return
    }

    const url = buildWhatsAppUrl(business.whatsapp, {
      tutor,
      pet,
      species: species as 'cao' | 'gato',
      interest: service!.title,
      message,
    })
    window.open(url, '_blank', 'noopener,noreferrer')
    setStatus('Continue a conversa no WhatsApp. A disponibilidade e o agendamento serão confirmados pela equipe.')
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate aria-label="Consultar cuidados para seu pet">
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label" htmlFor={`${id}-tutor`}>Nome do tutor <span aria-hidden="true">*</span></label>
          <input
            ref={tutorRef} className="form-input" id={`${id}-tutor`} name="tutor" autoComplete="name"
            value={tutor} maxLength={100} required aria-invalid={Boolean(errors.tutor)}
            aria-describedby={errors.tutor ? `${id}-tutor-error` : undefined}
            onChange={(event) => { setTutor(event.target.value); clearError('tutor') }}
          />
          {errors.tutor && <span className="field-error" id={`${id}-tutor-error`}>{errors.tutor}</span>}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor={`${id}-pet`}>Nome do pet <span className="form-optional">(opcional)</span></label>
          <input className="form-input" id={`${id}-pet`} name="pet" value={pet} maxLength={100} onChange={(event) => setPet(event.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor={`${id}-species`}>Espécie <span aria-hidden="true">*</span></label>
          <select
            ref={speciesRef} className="form-input" id={`${id}-species`} name="species" value={species} required
            aria-invalid={Boolean(errors.species)} aria-describedby={errors.species ? `${id}-species-error` : undefined}
            onChange={(event) => { setSpecies(event.target.value); clearError('species') }}
          >
            <option value="">Selecione</option>
            <option value="cao">Cão</option>
            <option value="gato">Gato</option>
          </select>
          {errors.species && <span className="field-error" id={`${id}-species-error`}>{errors.species}</span>}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor={`${id}-interest`}>Serviço de interesse <span aria-hidden="true">*</span></label>
          <select
            ref={interestRef} className="form-input" id={`${id}-interest`} name="interest" value={selectedService} required
            aria-invalid={Boolean(interestError)} aria-describedby={interestError ? `${id}-interest-error` : undefined}
            onChange={(event) => { onServiceChange(event.target.value); clearError('interest') }}
          >
            <option value="">Selecione uma opção</option>
            {business.services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}
          </select>
          {interestError && <span className="field-error" id={`${id}-interest-error`}>{interestError}</span>}
        </div>
        <div className="form-field form-field--full">
          <label className="form-label" htmlFor={`${id}-message`}>Conte um pouco sobre seu pet <span className="form-optional">(opcional)</span></label>
          <textarea className="form-input" id={`${id}-message`} name="message" rows={4} value={message} maxLength={1500} onChange={(event) => setMessage(event.target.value)} />
        </div>
      </div>
      <p className="form-note">* Campos obrigatórios. Disponibilidade e agendamento confirmados pela equipe.</p>
      {!whatsappReady && <p className="form-note form-note--unavailable">O canal de atendimento será disponibilizado em breve.</p>}
      <button className="button button--primary" type="submit">Continuar no WhatsApp <span aria-hidden="true">↗</span></button>
      <p className="form-status" role="status" aria-live="polite" aria-atomic="true">{status}</p>
    </form>
  )
}
