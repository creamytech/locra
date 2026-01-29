import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

interface ReferralPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: ReferralPageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Join LOCRA Travel Club — Referral ${code}`,
    description: 'Join the LOCRA Atlas Travel Club with a referral bonus. Earn 500 bonus miles on your first purchase!',
  };
}

export default async function ReferralPage({ params }: ReferralPageProps) {
  const { code } = await params;
  
  // Store referral code in cookie
  const cookieStore = await cookies();
  cookieStore.set('locra_ref', code.toUpperCase(), {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
    sameSite: 'lax',
  });
  
  // Redirect to homepage with referral indicator
  redirect(`/?ref=${code}`);
}
