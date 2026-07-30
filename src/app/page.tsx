import { redirect } from 'next/navigation';

export default function Root() {
  // Check onboarding status server-side is not possible without cookies,
  // so redirect to onboarding by default; client will handle skip
  redirect('/onboarding');
}
