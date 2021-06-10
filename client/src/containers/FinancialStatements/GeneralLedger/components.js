import React from 'react';
import intl from 'react-intl-universal';
import { Button } from '@blueprintjs/core';
import { Icon, If } from 'components';
import { FormattedMessage as T } from 'react-intl';

import { getForceWidth, getColumnWidth } from 'utils';
import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve the general ledger table columns.
 */
export function useGeneralLedgerTableColumns() {
  

  // General ledger context.
  const {
    generalLedger: { tableRows },
  } = useGeneralLedgerContext();

  return React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: (row) => {
          if (row.rowType === 'ACCOUNT_ROW') {
            return (
              <span
                className={'force-width'}
                style={{ minWidth: getForceWidth(row.date) }}
              >
                {row.date}
              </span>
            );
          }
          return row.date;
        },
        className: 'date',
        width: 120,
      },
      {
        Header: intl.get('account_name'),
        accessor: 'name',
        className: 'name',
        textOverview: true,
        // width: 200,
      },
      {
        Header: intl.get('transaction_type'),
        accessor: 'reference_type_formatted',
        className: 'transaction_type',
        width: 125,
        textOverview: true,
      },
      {
        Header: intl.get('transaction_number'),
        accessor: 'reference_id',
        className: 'transaction_number',
        width: 100,
      },
      {
        Header: intl.get('description'),
        accessor: 'note',
        className: 'description',
        // width: 145,
      },
      {
        Header: intl.get('credit'),
        accessor: 'formatted_credit',
        className: 'credit',
        width: getColumnWidth(tableRows, 'formatted_credit', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: intl.get('debit'),
        accessor: 'formatted_debit',
        className: 'debit',
        width: getColumnWidth(tableRows, 'formatted_debit', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: intl.get('amount'),
        accessor: 'formatted_amount',
        className: 'amount',
        width: getColumnWidth(tableRows, 'formatted_amount', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: intl.get('running_balance'),
        accessor: 'formatted_running_balance',
        className: 'running_balance',
        width: getColumnWidth(tableRows, 'formatted_running_balance', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
    ],
    [tableRows],
  );
}

/**
 * General ledger sheet alerts.
 */
export function GeneralLedgerSheetAlerts() {
  const { generalLedger, isLoading, sheetRefresh } = useGeneralLedgerContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    sheetRefresh();
  };
  // Can't display any error if the report is loading.
  if (isLoading) {
    return null;
  }

  return (
    <If condition={generalLedger.meta.is_cost_compute_running}>
      <div class="alert-compute-running">
        <Icon icon="info-block" iconSize={12} />
        <T id={'just_a_moment_we_re_calculating_your_cost_transactions'} />
        <Button onClick={handleRecalcReport} minimal={true} small={true}>
          <T id={'refresh'} />
        </Button>
      </div>
    </If>
  );
}

/**
 * General ledger sheet loading bar.
 */
export function GeneralLedgerSheetLoadingBar() {
  const { isFetching } = useGeneralLedgerContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
