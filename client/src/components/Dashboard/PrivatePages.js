import React from 'react';
import { Switch, Route } from 'react-router';
import { useQuery } from 'react-query';

import Dashboard from 'components/Dashboard/Dashboard';
import SetupWizardPage from 'containers/Setup/WizardSetupPage';
import DashboardLoadingIndicator from 'components/Dashboard/DashboardLoadingIndicator';

import withOrganizationActions from 'containers/Organization/withOrganizationActions';

import { compose } from 'utils';

/**
 * Dashboard inner private pages.
 */
function DashboardPrivatePages({

  // #withOrganizationActions
  requestAllOrganizations,
}) {
  const fetchOrganizations = useQuery(
    ['organizations'], () => requestAllOrganizations(),
  );

  return (
    <DashboardLoadingIndicator isLoading={fetchOrganizations.isFetching}>
      <Switch>
        <Route path={'/setup'}>
          <SetupWizardPage />
        </Route>

        <Route path='/'>
          <Dashboard />
        </Route>
      </Switch>
    </DashboardLoadingIndicator>
  );
}

export default compose(
  withOrganizationActions,
)(DashboardPrivatePages);