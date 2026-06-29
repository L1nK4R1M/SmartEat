import { repo } from "@/lib/repo";
import { OnboardingWizard } from "@/components/onboarding-wizard";

export default async function OnboardingPage() {
  const stores = await repo.getStores();
  return <OnboardingWizard stores={stores} />;
}
