// @ts-nocheck
import React, { createContext, useContext, useState } from 'react';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { DashboardInsider } from '@/components';
import { useProjects } from '@/containers/Projects/hooks';
import {
  useSettingsPaymentReceives,
  usePaymentReceiveEditPage,
  useAccounts,
  useCustomers,
  useBranches,
  useCreatePaymentReceive,
  useEditPaymentReceive,
} from '@/hooks/query';
import { useGetPdfTemplates } from '@/hooks/query/pdf-templates';

// Payment receive form context.
const PaymentReceiveFormContext = createContext();

/**
 * Payment receive form provider.
 */
function PaymentReceiveFormProvider({ query, paymentReceiveId, ...props }) {
  // Form state.
  const [submitPayload, setSubmitPayload] = React.useState({});

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isProjectsFeatureCan = featureCan(Features.Projects);

  // Fetches payment recevie details.
  const {
    data: {
      paymentReceive: paymentReceiveEditPage,
      entries: paymentEntriesEditPage,
    },
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
  } = usePaymentReceiveEditPage(paymentReceiveId, {
    enabled: !!paymentReceiveId,
  });
  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Fetch payment made settings.
  const fetchSettings = useSettingsPaymentReceives();

  // Fetches customers list.
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers({ page_size: 10000 });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Fetches the projects list.
  const {
    data: { projects },
    isLoading: isProjectsLoading,
  } = useProjects({}, { enabled: !!isProjectsFeatureCan });

  // Fetches branding templates of payment received module.
  const { data: brandingTemplates, isLoading: isBrandingTemplatesLoading } =
    useGetPdfTemplates({ resource: 'PaymentReceive' });

  // Detarmines whether the new mode.
  const isNewMode = !paymentReceiveId;

  const isFeatureLoading = isBranchesLoading;

  // Create and edit payment receive mutations.
  const { mutateAsync: editPaymentReceiveMutate } = useEditPaymentReceive();
  const { mutateAsync: createPaymentReceiveMutate } = useCreatePaymentReceive();

  const [isExcessConfirmed, setIsExcessConfirmed] = useState<boolean>(false);

  // Provider payload.
  const provider = {
    paymentReceiveId,
    paymentReceiveEditPage,
    paymentEntriesEditPage,
    accounts,
    customers,
    branches,
    projects,

    isPaymentLoading,
    isAccountsLoading,
    isPaymentFetching,
    isCustomersLoading,
    isFeatureLoading,
    isBranchesSuccess,
    isNewMode,

    submitPayload,
    setSubmitPayload,

    editPaymentReceiveMutate,
    createPaymentReceiveMutate,

    isExcessConfirmed,
    setIsExcessConfirmed,

    // Branding templates
    brandingTemplates,
    isBrandingTemplatesLoading,
  };

  const isLoading =
    isPaymentLoading ||
    isAccountsLoading ||
    isCustomersLoading ||
    isBrandingTemplatesLoading;

  return (
    <DashboardInsider loading={isLoading} name={'payment-receive-form'}>
      <PaymentReceiveFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentReceiveFormContext = () =>
  useContext(PaymentReceiveFormContext);

export { PaymentReceiveFormProvider, usePaymentReceiveFormContext };
