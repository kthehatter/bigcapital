import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Intent, FormGroup, TextArea } from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick } from 'lodash';
import { CLASSES } from 'common/classes';
import BillFormHeader from './BillFormHeader';
import EstimatesItemsTable from 'containers/Sales/Estimate/EntriesItemsTable';
import BillFormFooter from './BillFormFooter';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withBills from './withBills';
import withBillActions from './withBillActions';
import withBillDetail from './withBillDetail';
import withSettings from 'containers/Settings/withSettings';

import { AppToaster, Row, Col  } from 'components';
import Dragzone from 'components/Dragzone';
import useMedia from 'hooks/useMedia';

import { compose, repeatValue } from 'utils';

const MIN_LINES_NUMBER = 5;

function BillForm({
  //#WithMedia
  requestSubmitMedia,
  requestDeleteMedia,

  //#withBillActions
  requestSubmitBill,
  requestEditBill,
  setBillNumberChanged,

  //#withDashboard
  changePageTitle,

  // #withBills
  nextBillNumberChanged,

  // #withSettings
  billNextNumber,
  billNumberPrefix,

  //#withBillDetail
  bill,

  //#Own Props
  billId,
  onFormSubmit,
  onCancelForm,
}) {
  const { formatMessage } = useIntl();
  const [payload, setPayload] = useState({});

  const {
    setFiles,
    saveMedia,
    deletedFiles,
    setDeletedFiles,
    deleteMedia,
  } = useMedia({
    saveCallback: requestSubmitMedia,
    deleteCallback: requestDeleteMedia,
  });

  const handleDropFiles = useCallback((_files) => {
    setFiles(_files.filter((file) => file.uploaded === false));
  }, []);

  const savedMediaIds = useRef([]);
  const clearSavedMediaIds = () => {
    savedMediaIds.current = [];
  };

  useEffect(() => {
    if (bill && bill.id) {
      changePageTitle(formatMessage({ id: 'edit_bill' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_bill' }));
    }
  }, [changePageTitle, bill, formatMessage]);

  const validationSchema = Yup.object().shape({
    vendor_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'vendor_name_' })),
    bill_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'bill_date_' })),
    due_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'due_date_' })),
    bill_number: Yup.string()
      .required()
      .label(formatMessage({ id: 'bill_number_' })),
    reference_no: Yup.string().nullable().min(1).max(255),
    // status: Yup.string().required().nullable(),
    note: Yup.string()
      .trim()
      .min(1)
      .max(1024)
      .label(formatMessage({ id: 'note' })),
    entries: Yup.array().of(
      Yup.object().shape({
        quantity: Yup.number().nullable(),
        rate: Yup.number().nullable(),
        item_id: Yup.number()
          .nullable()
          .when(['quantity', 'rate'], {
            is: (quantity, rate) => quantity || rate,
            then: Yup.number().required(),
          }),
        total: Yup.number().nullable(),
        discount: Yup.number().nullable(),
        description: Yup.string().nullable(),
      }),
    ),
  });

  const saveBillSubmit = useCallback(
    (payload) => {
      onFormSubmit && onFormSubmit(payload);
    },
    [onFormSubmit],
  );

  const defaultBill = useMemo(
    () => ({
      index: 0,
      item_id: null,
      rate: null,
      discount: 0,
      quantity: null,
      description: '',
    }),
    [],
  );

  const billNumber = billNumberPrefix
    ? `${billNumberPrefix}-${billNextNumber}`
    : billNextNumber;

  const defaultInitialValues = useMemo(
    () => ({
      vendor_id: '',
      bill_number: billNumber,
      bill_date: moment(new Date()).format('YYYY-MM-DD'),
      due_date: moment(new Date()).format('YYYY-MM-DD'),
      // status: 'Bill',
      reference_no: '',
      note: '',
      entries: [...repeatValue(defaultBill, MIN_LINES_NUMBER)],
    }),
    [defaultBill, billNumber],
  );

  const orderingIndex = (_bill) => {
    return _bill.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
  };

  const initialValues = useMemo(
    () => ({
      ...(bill
        ? {
            ...pick(bill, Object.keys(defaultInitialValues)),
            entries: [
              ...bill.entries.map((bill) => ({
                ...pick(bill, Object.keys(defaultBill)),
              })),
              ...repeatValue(
                defaultBill,
                Math.max(MIN_LINES_NUMBER - bill.entries.length, 0),
              ),
            ],
          }
        : {
            ...defaultInitialValues,
            entries: orderingIndex(defaultInitialValues.entries),
          }),
    }),
    [bill, defaultInitialValues, defaultBill],
  );

  const initialAttachmentFiles = useMemo(() => {
    return bill && bill.media
      ? bill.media.map((attach) => ({
          preview: attach.attachment_file,
          uploaded: true,
          metadata: { ...attach },
        }))
      : [];
  }, [bill]);

  const formik = useFormik({
    // enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      setSubmitting(true);

      const form = {
        ...values,
        entries: values.entries.filter((item) => item.item_id && item.quantity),
      };
      const requestForm = { ...form };
      if (bill && bill.id) {
        requestEditBill(bill.id, requestForm)
          .then((response) => {
            AppToaster.show({
              message: formatMessage(
                {
                  id: 'the_bill_has_been_successfully_edited',
                },
                { number: values.bill_number },
              ),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            saveBillSubmit({ action: 'update', ...payload });
            resetForm();
          })
          .catch((error) => {
            setSubmitting(false);
          });
      } else {
        requestSubmitBill(requestForm)
          .then((response) => {
            AppToaster.show({
              message: formatMessage(
                { id: 'the_bill_has_been_successfully_created' },
                { number: values.bill_number },
              ),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            saveBillSubmit({ action: 'new', ...payload });
            resetForm();
          })
          .catch((errors) => {
            setSubmitting(false);
          });
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue('bill_number', billNumber);
    setBillNumberChanged(false);
  }, [nextBillNumberChanged, billNumber]);

  const handleSubmitClick = useCallback(
    (payload) => {
      setPayload(payload);
      formik.submitForm();
      formik.setSubmitting(false);
    },
    [setPayload, formik],
  );

  const handleCancelClick = useCallback(
    (payload) => {
      onCancelForm && onCancelForm(payload);
    },
    [onCancelForm],
  );

  const handleDeleteFile = useCallback(
    (_deletedFiles) => {
      _deletedFiles.forEach((deletedFile) => {
        if (deletedFile.uploaded && deletedFile.metadata.id) {
          setDeletedFiles([...deletedFiles, deletedFile.metadata.id]);
        }
      });
    },
    [setDeletedFiles, deletedFiles],
  );
  
  const onClickCleanAllLines = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...repeatValue(defaultBill, MIN_LINES_NUMBER)]),
    );
  };

  const onClickAddNewRow = () => {
    formik.setFieldValue(
      'entries',
      orderingIndex([...formik.values.entries, defaultBill]),
    );
  };
  return (
    <div className={classNames(
      CLASSES.PAGE_FORM,
      CLASSES.PAGE_FORM_BILL,
    )}>
      <form onSubmit={formik.handleSubmit}>
        <BillFormHeader formik={formik} />

        <EstimatesItemsTable
          formik={formik}
          entries={formik.values.entries}
          onClickAddNewRow={onClickAddNewRow}
          onClickClearAllLines={onClickCleanAllLines}
        />
        <div class="page-form__footer">
          <Row>
            <Col md={8}>
              <FormGroup label={<T id={'note'} />} className={'form-group--note'}>
                <TextArea
                  growVertically={true}
                  {...formik.getFieldProps('note')}
                />
              </FormGroup>
            </Col>

            <Col md={4}>
              <Dragzone
                initialFiles={initialAttachmentFiles}
                onDrop={handleDropFiles}
                onDeleteFile={handleDeleteFile}
                hint={'Attachments: Maxiumum size: 20MB'}
              />
            </Col>
          </Row>
        </div>
      </form>
      <BillFormFooter
        formik={formik}
        onSubmitClick={handleSubmitClick}
        bill={bill}
        disabled={formik.isSubmitting}
        onCancelClick={handleCancelClick}
      />
    </div>
  );
}

export default compose(
  withBillActions,
  withBillDetail(),
  withBills(({ nextBillNumberChanged }) => ({ nextBillNumberChanged })),
  withDashboardActions,
  withMediaActions,
  withSettings(({ billsettings }) => ({
    billNextNumber: billsettings?.next_number,
    billNumberPrefix: billsettings?.number_prefix,
  })),
)(BillForm);
