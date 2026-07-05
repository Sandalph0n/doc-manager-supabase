



import { createClient } from '@/lib/supabase/server'
import SellerProfileForm from './seller-profile-form'





// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function SellerProfilePage() {
	const supabase = await createClient()

	const { data, error } = await supabase.from('seller_profile').select().single()



	if (data && !error) {
		Object.entries(data).map(([k, _]) => {
			data[k] = data[k] === null ? "" : data[k]
		})

	}
	const recordId = data?.id;


	return <SellerProfileForm defaultValues={data ?? undefined} recordId = {recordId}/>
}
