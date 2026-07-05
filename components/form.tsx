'use client'

// ─── Imports ─────────────────────────────────────────────────────────────────
import { ReactNode } from 'react'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// ─── Types ────────────────────────────────────────────────────────────────────
type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name:         TName
  label:        ReactNode
  description?: ReactNode
  className?:   string
  control:      ControllerProps<TFieldValues, TName, TTransformedValues>['control']
}

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?:   boolean
  controlFirst?: boolean
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>['render']
    >[0]['field'] & {
      'aria-invalid': boolean
      id: string
    }
  ) => ReactNode
}

// FormControlFunc — shorthand type for the exported wrapper components
type FormControlFunc<
  ExtraProps extends Record<string, unknown> = Record<never, never>,
> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps
) => ReactNode

// ─── FormBase ─────────────────────────────────────────────────────────────────
function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  children,
  control,
  label,
  name,
  description,
  className,
  controlFirst,
  horizontal,
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        )
        const controlElement = children({
          ...field,
          id: field.name,
          'aria-invalid': fieldState.invalid,
        })
        const errorElement = fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        )

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? 'horizontal' : undefined}
            className={className}
          >
            {controlFirst ? (
              <>
                {controlElement}
                <FieldContent>
                  {labelElement}
                  {errorElement}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent>{labelElement}</FieldContent>
                {controlElement}
                {errorElement}
              </>
            )}
          </Field>
        )
      }}
    />
  )
}

// ─── Exported components ──────────────────────────────────────────────────────
export const FormInput: FormControlFunc<{ placeholder?: string }> = ({ placeholder, ...props }) => (
  <FormBase {...props}>{field => <Input {...field} placeholder={placeholder} />}</FormBase>
)

export const FormTextarea: FormControlFunc<{ placeholder?: string }> = ({ placeholder, ...props }) => (
  <FormBase {...props}>{field => <Textarea {...field} placeholder={placeholder} />}</FormBase>
)
