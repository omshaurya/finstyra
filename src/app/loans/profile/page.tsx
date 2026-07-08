import type { Metadata } from 'next';
import ProfileEditClient from './ProfileEditClient';

export const metadata: Metadata = {
  title: 'Edit Profile | Finstyra',
  description: 'Manage your personal details, address, identity documents and loan preferences.',
  robots: { index: false, follow: false },
};

export default function ProfileEditPage() {
  return <ProfileEditClient />;
}
