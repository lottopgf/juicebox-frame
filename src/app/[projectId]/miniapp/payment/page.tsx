import { PaymentComponent } from "@/app/[projectId]/miniapp/payment/component";

export default async function PaymentApp({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId: rawProjectId } = await params;
  const projectId = parseInt(rawProjectId);

  return <PaymentComponent projectId={projectId} />;
}
