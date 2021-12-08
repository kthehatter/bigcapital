import React from 'react';
import { FastField, useFormikContext } from 'formik';
import { Classes } from '@blueprintjs/core';
import { T, TotalLines, TotalLine } from 'components';
import { sumBy, subtract } from 'lodash';
import ReconcileCreditNoteEntriesTable from './ReconcileCreditNoteEntriesTable';
import { useReconcileCreditNoteContext } from './ReconcileCreditNoteFormProvider';
import { formattedAmount } from 'utils';

/**
 * Reconcile credit note form fields.
 */
export default function ReconcileCreditNoteFormFields() {
  const {
    creditNote: {
      formatted_credits_remaining,
      credits_remaining,
      currency_code,
    },
  } = useReconcileCreditNoteContext();

  const { values } = useFormikContext();

  // Calculate the total amount.
  const totalAmount = React.useMemo(() => {
    const total = sumBy(values.entries, 'amount');
    return subtract(credits_remaining, total);
  }, [values.entries]);

  return (
    <div className={Classes.DIALOG_BODY}>
      <div className="credit-remaining">
        <div className="credit-remaining__label">
          <T id={'reconcile_credit_note.dialog.credits_balance'} />
        </div>
        <div className="credit-remaining__balance">
          {formatted_credits_remaining}
        </div>
      </div>

      {/*------------ Reconcile credit entries table -----------*/}
      <FastField name={'entries'}>
        {({
          form: { setFieldValue, values },
          field: { value },
          meta: { error, touched },
        }) => (
          <ReconcileCreditNoteEntriesTable
            entries={value}
            errors={error}
            onUpdateData={(newEntries) => {
              setFieldValue('entries', newEntries);
            }}
          />
        )}
      </FastField>
      <div className="footer">
        <TotalLines className="total_lines">
          <TotalLine
            title={
              <T id={'reconcile_credit_note.dialog.total_amount_to_credit'} />
            }
            value={formattedAmount(totalAmount, currency_code)}
          />
          <TotalLine
            title={<T id={'reconcile_credit_note.dialog.remaining_credits'} />}
            value={formatted_credits_remaining}
          />
        </TotalLines>
      </div>
    </div>
  );
}
