import React from 'react';
import { Button, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { Form, FastField, ErrorMessage } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { compose } from 'redux';

import { CLASSES } from 'common/classes';
import { inputIntent } from 'utils';
import { useAutofocus } from 'hooks';

import withDialogActions from 'containers/Dialog/withDialogActions';


/**
 * Payment via license form.
 */
function PaymentViaLicenseForm({
  // #ownProps
  isSubmitting,

  // #withDialogActions
  closeDialog,
}) {
  const licenseNumberRef = useAutofocus();

  // Handle close button click.
  const handleCloseBtnClick = () => {
    closeDialog('payment-via-voucher');
  };

  return (
    <Form>
      <div className={CLASSES.DIALOG_BODY}>
        <p>Please enter your preferred payment method below.</p>

        <FastField name="license_number">
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'voucher_number'} />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="voucher_number" />}
              className={'form-group--voucher_number'}
            >
              <InputGroup
                {...field}
                inputRef={(ref) => (licenseNumberRef.current = ref)}
              />
            </FormGroup>
          )}
        </FastField>
      </div>

      <div className={CLASSES.DIALOG_FOOTER}>
        <div className={CLASSES.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleCloseBtnClick} disabled={isSubmitting}>
            <T id={'close'} />
          </Button>

          <Button
            intent={Intent.PRIMARY}
            disabled={false}
            type="submit"
            loading={isSubmitting}
          >
            <T id={'submit'} />
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default compose(
  withDialogActions
)(PaymentViaLicenseForm);