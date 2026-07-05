'use client';
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, ChevronRight, Save } from 'lucide-react'
import { getRequiredFields } from '@/lib/utils/schema'

import { sellerProfileFormSchema, SellerProfileFormValues } from '@/schemas/seller-profile'
import { useLang } from '@/lib/i18n/context'
import { FormInput, FormTextarea } from '@/components/form'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field'
import { createClient } from '@/lib/supabase/client';
import { updateSellerProfile } from './actions';
import { error } from 'console';
import { toast } from 'sonner';

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Flex wrap container — fields tự xuống dòng khi hết chỗ
const wrap = 'flex flex-wrap items-start gap-x-6 gap-y-7'
// min-w cho từng field — field sẽ grow để fill space, nhưng không co nhỏ hơn min này
const field = 'flex-1 min-w-56'   // text input ngắn
const fieldLg = 'flex-1 min-w-72'   // textarea / input dài hơn


const req = getRequiredFields(sellerProfileFormSchema)

const SellerProfileForm = ({ defaultValues, recordId }: { defaultValues: Partial<SellerProfileFormValues> | undefined, recordId: string }) => {
	const { t } = useLang()
	const sp = t.sellerProfile

	/** Appends a red * if the field is required in the schema */
	function l(text: string, name: keyof SellerProfileFormValues): ReactNode {
		return req.has(name)
			? <>{text}<span className='text-destructive ml-0.5'>*</span></>
			: text
	}

	// ── Form setup ──────────────────────────────────────────────────────────────
	const form = useForm<SellerProfileFormValues>({
		resolver: zodResolver(sellerProfileFormSchema),
		defaultValues: defaultValues ?? {
			company_name_vi: '',
			company_name_en: '',
			company_name_cn: '',
			address_vi: '',
			address_en: '',
			address_cn: '',
			authorized_person: '',
			position: '',
			tax_code: '',
			bank_account: '',
			swift_code: '',
			bank_name: '',
			bank_address: '',
		},
	})

	// ── Submit ──────────────────────────────────────────────────────────────────
	async function onSubmit(data: SellerProfileFormValues) {
		console.log(recordId)
		const result = await updateSellerProfile( data, recordId)
		
		if (! result){
			toast.error("Update failed: server error")
			return
		}
		
		if (result?.error) {
			// hiện error
			toast.error(result.error.message)
			return
		}
	
		toast.success("Updated successfully")

	}

	// ── Render ───────────────────────────────────────────────────────────────────
	return (
		<>
			{/* Toolbar */}
			<div className='flex items-center h-9 px-4 gap-2 border-b bg-background shrink-0 '>
				<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
					<Building2 className='size-3.5' />
					<ChevronRight className='size-3' />
					<span className='text-foreground font-medium'>{sp.title}</span>
				</div>
				<div className='ml-auto'>
					<Button
						size='sm'
						className='h-7 text-xs gap-1.5'
						disabled={form.formState.isSubmitting}
						onClick={form.handleSubmit(onSubmit)}
					>
						<Save className='size-3' />
						{form.formState.isSubmitting ? sp.saving : sp.save}
					</Button>
				</div>
			</div>

			{/* Form  */}
			<div className='flex-1 overflow-y-auto '>
				<div className='max-w-6xl mx-auto py-8 px-6'>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>

							{/* Company name */}
							<FieldSet>
								<FieldLegend>{sp.companyName}</FieldLegend>
								<div className={wrap}>
									<FormInput className={field} control={form.control} name='company_name_vi' label={l(sp.langVi, 'company_name_vi')} placeholder='Công ty TNHH...' />
									<FormInput className={field} control={form.control} name='company_name_en' label={l(sp.langEn, 'company_name_en')} placeholder='Co., Ltd...' />
									<FormInput className={field} control={form.control} name='company_name_cn' label={l(sp.langCn, 'company_name_cn')} placeholder='有限公司...' />
								</div>
							</FieldSet>

							<FieldSeparator />

							{/* Address */}
							<FieldSet>
								<FieldLegend>{sp.address}</FieldLegend>
								<div className={wrap}>
									<FormTextarea className={fieldLg} control={form.control} name='address_vi' label={l(sp.langVi, 'address_vi')} placeholder='Số ..., Đường ..., Quận ...' />
									<FormTextarea className={fieldLg} control={form.control} name='address_en' label={l(sp.langEn, 'address_en')} placeholder='No. ..., Street ..., District ...' />
									<FormTextarea className={fieldLg} control={form.control} name='address_cn' label={l(sp.langCn, 'address_cn')} placeholder='...' />
								</div>
							</FieldSet>

							<FieldSeparator />

							{/* Authorized person */}
							<FieldSet>
								<FieldLegend>{sp.authorizedPerson}</FieldLegend>
								<div className={wrap}>
									<FormInput className={field} control={form.control} name='authorized_person' label={l(sp.fullName, 'authorized_person')} placeholder='Nguyễn Văn A' />
									<FormInput className={field} control={form.control} name='position' label={l(sp.position, 'position')} placeholder='Director' />
								</div>
							</FieldSet>

							<FieldSeparator />

							{/* Tax */}
							<FieldSet>
								<FieldLegend>{sp.tax}</FieldLegend>
								<div className={wrap}>
									<FormInput className={field} control={form.control} name='tax_code' label={l(sp.taxCode, 'tax_code')} placeholder='0123456789' />
								</div>
							</FieldSet>

							<FieldSeparator />

							{/* Bank */}
							<FieldSet>
								<FieldLegend>{sp.bankInfo}</FieldLegend>
								<div className={wrap}>
									<FormInput className={field} control={form.control} name='bank_name' label={l(sp.bankName, 'bank_name')} placeholder='Vietcombank' />
									<FormInput className={field} control={form.control} name='bank_account' label={l(sp.accountNumber, 'bank_account')} placeholder='0123456789' />
									<FormInput className={field} control={form.control} name='swift_code' label={l(sp.swiftCode, 'swift_code')} placeholder='BFTVVNVX' />
									<FormInput className={field} control={form.control} name='bank_account_name' label={l(sp.bankAccountName, 'bank_account_name')} placeholder='Nguyen Van A' />
									<FormTextarea className={fieldLg} control={form.control} name='bank_address' label={l(sp.bankAddress, 'bank_address')} placeholder='...' />
								</div>
							</FieldSet>

						</FieldGroup>
					</form>
				</div>
			</div>
		</>
	)
}

export default SellerProfileForm