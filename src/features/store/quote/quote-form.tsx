'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { ArrowRight, CheckCircle2, Loader2, Lock } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch, type FieldPath } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { describedBy, Field, Input, Select, Textarea } from '@/components/ui/field'
import { Heading } from '@/components/ui/typography'
import { organizationTypes } from '@/features/request-form/options'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { Offer } from '../catalog'
import type { VendorId } from '../vendors'
import { submitQuote, type QuoteResult } from './actions'
import { quoteSchema, type QuoteInput } from './schema'

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

type QuoteFormProps = {
  vendor: VendorId
  productId: string
  offers: Offer[]
  /** From this quantity VTEGI prices the order itself. */
  customFrom: number | null
}

function priceUnit(offer: Offer) {
  const unit = offer.unit === 'each' ? 'unit' : offer.unit
  const period =
    offer.billingTerm === 'monthly' ? ' / month' : offer.billingTerm === 'annual' ? ' / year' : ''
  return `per ${unit}${period}`
}

const range = (from: number, to: number | null) =>
  to === null ? `${from}+` : from === to ? String(from) : `${from}–${to}`

export function QuoteForm({ vendor, productId, offers, customFrom }: QuoteFormProps) {
  const [offerKey, setOfferKey] = useState(offers[0]?.key ?? 'unit')
  const offer = offers.find((o) => o.key === offerKey)

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      vendor,
      productId,
      offer: offerKey,
      quantity: 1,
      name: '',
      email: '',
      organization: '',
      organizationType: '' as QuoteInput['organizationType'],
      phone: '',
      zip: '',
      address: '',
      notes: '',
      website: '',
    },
    mode: 'onTouched',
  })

  const startedAt = useRef(0)
  const turnstile = useRef<TurnstileInstance>(undefined)
  const [turnstileToken, setTurnstileToken] = useState<string>()
  const [formError, setFormError] = useState<string>()
  const [result, setResult] = useState<Extract<QuoteResult, { ok: true }> & { email: string }>()

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  const quantity = useWatch({ control, name: 'quantity' })

  const onSubmit = async (data: QuoteInput) => {
    setFormError(undefined)
    try {
      const response = await submitQuote(
        { ...data, offer: offerKey },
        { startedAt: startedAt.current, turnstileToken },
      )
      if (response.ok) {
        setResult({ ...response, email: data.email })
        reset()
        return
      }
      setFormError(response.message)
      for (const [field, messages] of Object.entries(response.fieldErrors ?? {})) {
        setError(field as FieldPath<QuoteInput>, { message: messages?.[0] })
      }
    } catch {
      setFormError('Something went wrong sending your request. Please try again or call us.')
    }
    turnstile.current?.reset()
  }

  if (result) {
    return (
      <Success
        result={result}
        onReset={() => {
          setResult(undefined)
          startedAt.current = Date.now()
        }}
      />
    )
  }

  const field = (name: keyof QuoteInput, hasHint = false) =>
    describedBy(`quote-${name}`, errors[name]?.message, hasHint)

  return (
    <div className="space-y-6">
      {offers.length > 1 && (
        <fieldset>
          <legend className="text-sm font-medium text-ink-800 on-dark:text-ink-200">
            Choose a term
          </legend>
          <div className="mt-2 grid gap-2">
            {offers.map((o) => (
              <label
                key={o.key}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-3 text-sm transition-colors',
                  o.key === offerKey
                    ? 'border-brand-700 bg-brand-700/[0.04] on-dark:border-brand-400 on-dark:bg-brand-400/10'
                    : 'border-ink-200 hover:border-ink-400 on-dark:border-white/15 on-dark:hover:border-white/40',
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="offer"
                    value={o.key}
                    checked={o.key === offerKey}
                    onChange={() => setOfferKey(o.key)}
                    className="accent-brand-700"
                  />
                  {o.label}
                </span>
                {o.levels[0] && (
                  <span className="text-right whitespace-nowrap tabular-nums">
                    <span className="font-semibold">{formatPrice(o.levels[0].unitPrice)}</span>
                    <span className="block text-xs text-ink-500">{priceUnit(o)}</span>
                  </span>
                )}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {offer && offer.levels.length > 0 ? (
        <PriceTable offer={offer} customFrom={customFrom} />
      ) : (
        <p className="rounded-md bg-ink-50 px-4 py-3 text-sm text-ink-700 on-dark:bg-white/5 on-dark:text-ink-300">
          Price on request: send the form and we’ll email you a quote.
        </p>
      )}

      <form onSubmit={(e) => handleSubmit(onSubmit)(e)} noValidate className="space-y-5">
        <div className="grid items-start gap-5 sm:grid-cols-[8rem_1fr]">
          <Field id="quote-quantity" label="Quantity" required error={errors.quantity?.message}>
            <Input
              {...field('quantity')}
              {...register('quantity', { valueAsNumber: true })}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
            />
          </Field>
          <Estimate offer={offer} quantity={quantity} customFrom={customFrom} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="quote-name" label="Full name" required error={errors.name?.message}>
            <Input {...field('name')} {...register('name')} autoComplete="name" />
          </Field>
          <Field id="quote-email" label="Work email" required error={errors.email?.message}>
            <Input {...field('email')} {...register('email')} type="email" autoComplete="email" />
          </Field>
          <Field
            id="quote-organization"
            label="Organization"
            required
            error={errors.organization?.message}
          >
            <Input
              {...field('organization')}
              {...register('organization')}
              autoComplete="organization"
            />
          </Field>
          <Field
            id="quote-organizationType"
            label="Organization type"
            required
            error={errors.organizationType?.message}
          >
            <Select {...field('organizationType')} {...register('organizationType')}>
              <option value="">Select a type</option>
              {organizationTypes.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="quote-phone" label="Phone" error={errors.phone?.message}>
            <Input {...field('phone')} {...register('phone')} type="tel" autoComplete="tel" />
          </Field>
          <Field id="quote-zip" label="Delivery ZIP code" required error={errors.zip?.message}>
            <Input
              {...field('zip')}
              {...register('zip')}
              inputMode="numeric"
              autoComplete="postal-code"
            />
          </Field>
        </div>
        <Field id="quote-address" label="Company address" error={errors.address?.message}>
          <Input {...field('address')} {...register('address')} autoComplete="street-address" />
        </Field>
        <Field id="quote-notes" label="Notes" error={errors.notes?.message}>
          <Textarea
            {...field('notes')}
            {...register('notes')}
            maxLength={1000}
            className="min-h-24"
            placeholder="Anything we should know, e.g. a required delivery date"
          />
        </Field>

        {/* Honeypot: invisible to people and screen readers. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" {...register('website')} />
          </label>
        </div>

        {turnstileSiteKey && (
          <Turnstile
            ref={turnstile}
            siteKey={turnstileSiteKey}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken(undefined)}
            options={{ theme: 'light', size: 'flexible' }}
          />
        )}

        {formError && (
          <p role="alert" className="text-sm text-red-700 on-dark:text-red-400">
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" /> Preparing your quote…
            </>
          ) : (
            <>
              Email my quote <ArrowRight aria-hidden className="size-4" />
            </>
          )}
        </Button>
        <p className="flex justify-center gap-2 text-center text-xs text-ink-500">
          <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          <span>
            No account or payment needed. By submitting, you agree to our{' '}
            <Link href="/privacy" className="underline hover:text-ink-900 on-dark:hover:text-white">
              Privacy Policy
            </Link>
            .
          </span>
        </p>
      </form>
    </div>
  )
}

function PriceTable({ offer, customFrom }: { offer: Offer; customFrom: number | null }) {
  return (
    <table className="w-full text-sm">
      <caption className="mb-2 text-left text-sm font-medium text-ink-800 on-dark:text-ink-200">
        Price {priceUnit(offer)}
      </caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Quantity</th>
          <th scope="col">Price</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-ink-100 border-y border-ink-100 on-dark:divide-white/10 on-dark:border-white/10">
        {offer.levels.map((level) => (
          <tr key={level.from}>
            <td className="py-2 text-ink-600 on-dark:text-ink-400">
              {range(level.from, level.to)} {level.from === 1 && level.to === 1 ? 'unit' : 'units'}
            </td>
            <td className="py-2 text-right tabular-nums">
              {level.discountPercent > 0 && (
                <span className="mr-2 text-xs text-brand-700 on-dark:text-brand-400">
                  {level.discountPercent}% off
                </span>
              )}
              <span className="font-semibold">{formatPrice(level.unitPrice)}</span>
            </td>
          </tr>
        ))}
        {customFrom && (
          <tr>
            <td className="py-2 text-ink-600 on-dark:text-ink-400">{customFrom}+ units</td>
            <td className="py-2 text-right font-semibold">Custom quote</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

/** Live estimate next to the quantity field; the emailed quote uses fresh distributor prices. */
function Estimate({
  offer,
  quantity,
  customFrom,
}: {
  offer: Offer | undefined
  quantity: number
  customFrom: number | null
}) {
  const box = 'rounded-md bg-ink-50 px-4 py-2.5 text-sm sm:mt-6.5 on-dark:bg-white/5'
  if (!Number.isInteger(quantity) || quantity < 1) return <div className={box}>&nbsp;</div>
  if (customFrom && quantity >= customFrom) {
    return (
      <p className={box}>
        <span className="font-semibold">Custom volume pricing.</span> We’ll prepare your quote.
      </p>
    )
  }
  const level = offer?.levels.filter((l) => quantity >= l.from).at(-1)
  if (!offer || !level) {
    return <p className={box}>We’ll email your quote with current pricing.</p>
  }
  const total = Math.round(level.unitPrice * quantity * offer.periods * 100) / 100
  const term =
    offer.periods > 1
      ? ` × ${offer.periods} ${offer.billingTerm === 'annual' ? 'years' : 'months'}`
      : ''
  return (
    <p className={box}>
      Estimated total <span className="font-semibold tabular-nums">{formatPrice(total)}</span>
      <span className="block text-xs text-ink-500 tabular-nums">
        {quantity} × {formatPrice(level.unitPrice)}
        {term} · tax and shipping extra
      </span>
    </p>
  )
}

function Success({
  result,
  onReset,
}: {
  result: Extract<QuoteResult, { ok: true }> & { email: string }
  onReset: () => void
}) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  const sent = result.status === 'sent'

  return (
    <div role="status" className="py-6 text-center">
      <CheckCircle2 aria-hidden className="mx-auto size-12 text-brand-700 on-dark:text-brand-400" />
      <Heading ref={heading} tabIndex={-1} as="h3" size="md" className="mt-5 outline-none">
        {sent ? 'Your quote is on its way.' : 'We’re preparing your quote.'}
      </Heading>
      <p className="mx-auto mt-3 max-w-sm text-sm text-ink-600 on-dark:text-ink-400">
        {sent
          ? `We’ve emailed quote ${result.quoteNumber} to ${result.email} as a PDF. Reply to that email to place your order.`
          : `A VTEGI specialist will email your quote${result.quoteNumber ? ` (${result.quoteNumber})` : ''} within one business day.`}
      </p>
      <Button variant="outline" className="mt-8" onClick={onReset}>
        Request another quote
      </Button>
    </div>
  )
}
