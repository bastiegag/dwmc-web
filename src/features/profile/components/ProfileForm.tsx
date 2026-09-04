import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormError } from '@/components/form/FormError'
import { FormField } from '@/components/form/FormField'
import { FormSubmitButton } from '@/components/form/FormSubmitButton'
import { TextField } from '@/components/form/TextField'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useUpdateProfile } from '../hooks'
import { profileFormSchema, type ProfileFormValues } from '../schemas/profile.schema'
import { supportedCurrencies, type UserProfile } from '../types/profile.types'

interface ProfileFormProps {
    profile: UserProfile
}

const getProfileFormValues = (profile: UserProfile): ProfileFormValues => ({
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    displayName: profile.displayName ?? '',
    preferredCurrency: profile.preferredCurrency,
})

export const ProfileForm = ({ profile }: ProfileFormProps) => {
    const updateProfile = useUpdateProfile()
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitSuccessful },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: getProfileFormValues(profile),
    })

    useEffect(() => {
        reset(getProfileFormValues(profile))
    }, [profile, reset])

    const onSubmit = async (values: ProfileFormValues) => {
        try {
            await updateProfile.mutateAsync({
                firstName: values.firstName.trim() || null,
                lastName: values.lastName.trim() || null,
                displayName: values.displayName.trim() || null,
                preferredCurrency: values.preferredCurrency,
            })
        } catch {
            // The mutation state renders the API error in the form.
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
            <section aria-labelledby="personal-information-heading" className="space-y-4">
                <div>
                    <h2 id="personal-information-heading" className="text-lg font-semibold">
                        Personal information
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Choose how your name appears in the application.
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        id="firstName"
                        label="First name"
                        autoComplete="given-name"
                        error={errors.firstName?.message}
                        {...register('firstName')}
                    />
                    <TextField
                        id="lastName"
                        label="Last name"
                        autoComplete="family-name"
                        error={errors.lastName?.message}
                        {...register('lastName')}
                    />
                </div>
                <TextField
                    id="displayName"
                    label="Display name"
                    autoComplete="nickname"
                    error={errors.displayName?.message}
                    {...register('displayName')}
                />
            </section>

            <section aria-labelledby="preferences-heading" className="space-y-4">
                <div>
                    <h2 id="preferences-heading" className="text-lg font-semibold">
                        Preferences
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        This preference affects presentation only; it does not convert stored
                        amounts.
                    </p>
                </div>
                <FormField
                    id="preferredCurrency"
                    label="Preferred currency"
                    error={errors.preferredCurrency?.message}
                >
                    <Controller
                        name="preferredCurrency"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger
                                    id="preferredCurrency"
                                    aria-describedby={
                                        errors.preferredCurrency
                                            ? 'preferredCurrency-error'
                                            : undefined
                                    }
                                >
                                    <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {supportedCurrencies.map((currency) => (
                                        <SelectItem key={currency} value={currency}>
                                            {currency}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormField>
            </section>

            <FormError message={updateProfile.error?.message} />
            {isSubmitSuccessful && !updateProfile.isPending && !isDirty && (
                <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
                    Profile saved.
                </p>
            )}
            <FormSubmitButton isLoading={updateProfile.isPending} loadingText="Saving...">
                Save changes
            </FormSubmitButton>
        </form>
    )
}
