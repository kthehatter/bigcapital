export const initialValues = {
  templateName: '',
  
  // Colors
  primaryColor: '#2c3dd8',
  secondaryColor: '#2c3dd8',

  // Company logo.
  showCompanyLogo: true,
  companyLogo:
    'https://cdn-development.mercury.com/demo-assets/avatars/mercury-demo-dark.png',

  // Top details.
  showEstimateNumber: true,
  estimateNumberLabel: 'Estimate number',

  estimateDateLabel: 'Date of Issue',
  showEstimateDate: true,

  showExpirationDate: true,
  expirationDateLabel: 'Expiration Date',

  // Company name
  companyName: 'Bigcapital Technology, Inc.',

  // Addresses
  showBilledFromAddress: true,
  showBilledToAddress: true,
  billedToLabel: 'Billed To',

  // Entries
  itemNameLabel: 'Item',
  itemDescriptionLabel: 'Description',
  itemRateLabel: 'Rate',
  itemTotalLabel: 'Total',

  // Totals
  showSubtotal: true,
  subtotalLabel: 'Subtotal',

  showTotal: true,
  totalLabel: 'Total',

  // Statements
  showCustomerNote: true,
  customerNoteLabel: 'Customer Note',

  showTermsConditions: true,
  termsConditionsLabel: 'Terms & Conditions',
};

export const fieldsGroups = [
  {
    label: 'Header',
    fields: [
      {
        labelKey: 'estimateNumberLabel',
        enableKey: 'showEstimateNumber',
        label: 'Estimate No.',
      },
      {
        labelKey: 'estimateDateLabel',
        enableKey: 'showEstimateDate',
        label: 'Issue Date',
      },
      {
        labelKey: 'expirationDateLabel',
        enableKey: 'showExpirationDate',
        label: 'Expiration Date',
      },
      {
        enableKey: 'showBilledToAddress',
        labelKey: 'billedToLabel',
        label: 'Bill To',
      },
      {
        enableKey: 'showBilledFromAddress',
        label: 'Billed From',
      },
    ],
  },
  {
    label: 'Totals',
    fields: [
      {
        labelKey: 'subtotalLabel',
        enableKey: 'showSubtotal',
        label: 'Subtotal',
      },
      { labelKey: 'totalLabel', enableKey: 'showTotal', label: 'Total' },
    ],
  },
  {
    label: 'Footer',
    fields: [
      {
        labelKey: 'termsConditionsLabel',
        enableKey: 'showTermsConditions',
        label: 'Terms & Conditions',
      },
      {
        labelKey: 'customerNoteLabel',
        enableKey: 'showCustomerNote',
        label: 'Statement',
        labelPlaceholder: 'Statement',
      },
    ],
  },
];
