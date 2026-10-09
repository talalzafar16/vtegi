'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { ArrowRight, CheckCircle2, Loader2, Lock } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch, type FieldPath } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { describedBy, Field, Input, Select, Textarea } from '@/components/ui/field'
import { Heading } from '@/components/ui/typography'

import { submitRequest } from './actions'
import {
  computerTypes,
  contactMethods,
  HELP_ME_CHOOSE,
  inquiryTypes,
  isBusinessInquiry,
  type InquiryType,
  organizationTypes,
  timelines,
} from './options'
import { emptyRequest, requestSchema, type RequestInput } from './schema'

type SolutionOption = { slug: string; title: string }

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const MESSAGE_MAX = 2000

export type RequestFormProps = {
  solutions: SolutionOption[]
  /** Pre-selected solution when the URL doesn't specify one (e.g. on a solution page). */
  defaultSolution?: string
  defaultInquiry?: InquiryType
}

/** The website request form. Reads `?solution=<slug>` and `?inquiry=<type>` from the URL. */
export function RequestForm({ solutions, defaultSolution, defaultInquiry }: RequestFormProps) {
  const params = useSearchParams()
  const solutionParam = params.get('solution')
  const inquiryParam = params.get('inquiry')
  const validPreselected = solutions.some((s) => s.slug === solutionParam) ? solutionParam : null
  const initialSolution = validPreselected ?? defaultSolution ?? ''
  const initialInquiry =
    inquiryTypes.find((o) => o.value === inquiryParam)?.value ??
    (initialSolution ? 'service' : (defaultInquiry ?? 'service'))

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
    defaultValues: { ...emptyRequest, inquiryType: initialInquiry, solution: initialSolution },
    mode: 'onTouched',
  })

  const startedAt = useRef(0)
  const turnstile = useRef<TurnstileInstance>(undefined)
  const [turnstileToken, setTurnstileToken] = useState<string>()
  const [formError, setFormError] = useState<string>()
  const [submittedName, setSubmittedName] = useState<string>()

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  // A solution card was clicked (URL changed without a page load): select it.
  useEffect(() => {
    if (!validPreselected) return
    setValue('inquiryType', 'service')
    setValue('solution', validPreselected, { shouldValidate: true })
  }, [validPreselected, setValue])

  const inquiryType = useWatch({ control, name: 'inquiryType' })
  const messageLength = useWatch({ control, name: 'message' }).length
  const business = isBusinessInquiry(inquiryType)

  const onSubmit = async (data: RequestInput) => {
    setFormError(undefined)
    try {
      const result = await submitRequest(data, { startedAt: startedAt.current, turnstileToken })
      if (result.ok) {
        setSubmittedName(data.name)
        reset({ ...emptyRequest, solution: data.solution })
        return
      }
      setFormError(result.message)
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as FieldPath<RequestInput>, { message: messages?.[0] })
      }
    } catch {
      setFormError('Something went wrong sending your request. Please try again or call us.')
    }
    turnstile.current?.reset()
  }

  if (submittedName) {
    return (
      <Success
        name={submittedName}
        onReset={() => {
          setSubmittedName(undefined)
          startedAt.current = Date.now()
        }}
      />
    )
  }

  const field = (name: keyof RequestInput, hasHint = false) =>
    describedBy(`request-${name}`, errors[name]?.message, hasHint)

  return (
    <form onSubmit={(event) => handleSubmit(onSubmit)(event)} noValidate className="space-y-5">
      {formError && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {formError}
        </p>
      )}

      <Field id="request-inquiryType" label="What can we help with?" required>
        <Select {...field('inquiryType')} {...register('inquiryType')}>
          {inquiryTypes.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Field>

      {inquiryType === 'service' && (
        <Field
          id="request-solution"
          label="Solution"
          required
          hint="Selected automatically when you choose a solution above."
          error={errors.solution?.message}
        >
          {/* Re-mounts on a new pre-selection so the highlight animation replays. */}
          <div
            key={validPreselected ?? 'none'}
            className={validPreselected ? 'animate-highlight rounded-md' : ''}
          >
            <Select {...field('solution', true)} {...register('solution')}>
              <option value="">Choose a solution</option>
              {solutions.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
              <option value={HELP_ME_CHOOSE}>Not sure: help me choose</option>
            </Select>
          </div>
        </Field>
      )}

      {inquiryType === 'custom-build' && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="request-computerType"
            label="Computer type"
            required
            error={errors.computerType?.message}
          >
            <Select {...field('computerType')} {...register('computerType')}>
              <option value="">Select a type</option>
              {computerTypes.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="request-budget" label="Budget" hint="Include currency, or “Not sure yet”.">
            <Input {...field('budget', true)} {...register('budget')} />
          </Field>
          <Field
            id="request-applications"
            label="Applications and everyday use"
            className="sm:col-span-2"
            error={errors.applications?.message}
          >
            <Input
              {...field('applications')}
              {...register('applications')}
              placeholder="e.g. CAD, video editing, Microsoft 365"
            />
          </Field>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="request-name" label="Full name" required error={errors.name?.message}>
          <Input {...field('name')} {...register('name')} autoComplete="name" />
        </Field>
        <Field id="request-email" label="Work email" required error={errors.email?.message}>
          <Input {...field('email')} {...register('email')} type="email" autoComplete="email" />
        </Field>
      </div>

      {inquiryType !== 'career' && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="request-organization"
            label="Organization"
            required={business}
            error={errors.organization?.message}
          >
            <Input
              {...field('organization')}
              {...register('organization')}
              autoComplete="organization"
            />
          </Field>
          <Field
            id="request-organizationType"
            label="Organization type"
            required={business}
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
        </div>
      )}

      <Field
        id="request-message"
        label="What do you need help with?"
        required
        hint={`A brief overview is all we need. ${messageLength}/${MESSAGE_MAX}`}
        error={errors.message?.message}
      >
        <Textarea {...field('message', true)} {...register('message')} maxLength={MESSAGE_MAX} />
      </Field>

      <details className="group rounded-md border border-zinc-200 px-4">
        <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-medium text-zinc-800 [&::-webkit-details-marker]:hidden">
          Add phone and preferences
          <span className="text-xs text-zinc-500">Optional</span>
        </summary>
        <div className="grid gap-5 pb-4 sm:grid-cols-2">
          <Field id="request-phone" label="Phone">
            <Input {...field('phone')} {...register('phone')} type="tel" autoComplete="tel" />
          </Field>
          <Field id="request-contactMethod" label="Preferred contact">
            <Select {...field('contactMethod')} {...register('contactMethod')}>
              <option value="">No preference</option>
              {contactMethods.slice(1).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="request-timeline" label="Desired timeline" className="sm:col-span-2">
            <Select {...field('timeline')} {...register('timeline')}>
              <option value="">Select a timeline</option>
              {timelines.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </details>

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

      <p className="flex gap-2 text-xs text-zinc-500">
        <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
        Please don’t include passwords, patient information, or sensitive government information.
      </p>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 aria-hidden className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Submit Request <ArrowRight aria-hidden className="size-4" />
          </>
        )}
      </Button>
      <p className="text-center text-xs text-zinc-500">
        By submitting, you agree to our{' '}
        <Link href="/privacy" className="underline hover:text-zinc-900">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}

function Success({ name, onReset }: { name: string; onReset: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])

  return (
    <div role="status" className="py-8 text-center">
      <CheckCircle2 aria-hidden className="mx-auto size-12 text-brand-700" />
      <Heading ref={heading} tabIndex={-1} as="h3" size="lg" className="mt-5 outline-none">
        Thanks, {name}. We received your request.
      </Heading>
      <p className="mx-auto mt-3 max-w-sm text-zinc-600">
        A VTEGI specialist will follow up within one business day. We’ve sent a confirmation to your
        email.
      </p>
      <Button variant="outline" className="mt-8" onClick={onReset}>
        Submit another request
      </Button>
    </div>
  )
}
