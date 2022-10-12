import 'react-phone-number-input/style.css';

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import {
  useAddressQuery,
  useAddressUpdate
} from '@openstudio/thelia-api-utils';
import { setPhoneNumberValid } from '@redux/modules/checkout';
import Alert from '../Alert';
import React from 'react';
import { parsePhoneNumber } from 'react-phone-number-input';
import Title from '../Title';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

export default function PhoneCheck({ addressId }) {
  const [phone, setPhone] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);
  const { data = [] } = useAddressQuery();
  const dispatch = useDispatch();
  const intl = useIntl();
  const {
    mutate: update,
    isSuccess,
    isError,
    reset,
    isLoading
  } = useAddressUpdate();
  const address = React.useMemo(() => {
    if (addressId && Array.isArray(data)) {
      return data.find((a) => a.id === addressId);
    }

    if (!addressId && Array.isArray(data)) {
      return data.find((a) => a.isDefault);
    }

    return null;
  }, [data, addressId]);

  React.useEffect(() => {
    if (!address) return;
    let currentPhoneNumber = address?.cellphone || '';

    if (address?.cellphone && address?.countryCode) {
      currentPhoneNumber = parsePhoneNumber(
        address?.cellphone,
        address?.countryCode
      ).number;
    }
    setPhone(currentPhoneNumber);
  }, [address]);

  React.useEffect(() => {
    if (addressId !== undefined) {
      reset();
    }
  }, [addressId, reset]);

  React.useEffect(() => {
    if (isValidPhoneNumber(phone || '') && !isError) {
      dispatch(setPhoneNumberValid(true));
    }
  }, [isError, phone, isSuccess, dispatch]);

  const isValid = phone ? isValidPhoneNumber(phone || '') : false;

  if (!address) return null;

  return (
    <div>
      <Title title="CONTACT_NUMBER" className="text-2xl Title--3" />
      <small className="text-gray-600 ">
        {intl.formatMessage({ id: 'NOTICE_PHONE_CHECK' })}
      </small>
      <form
        className={`PhoneCheck ${isLoading ? 'PhoneCheck--loading' : ''} ${
          isSubmitted && !isValid ? 'PhoneCheck--error' : ''
        }`}
        onChange={() => setIsSubmitted(false)}
        onFocus={() => setIsDirty(true)}
        onSubmit={async (e) => {
          e.preventDefault();
          if (isValid) {
            try {
              await update({
                id: addressId,
                data: {
                  ...address,
                  cellphone: phone
                }
              });
            } catch (error) {
              console.error(error);
            }
          }
        }}
      >
        <div className="relative PhoneCheck-field">
          <PhoneInput
            international={false}
            defaultCountry={address?.countryCode}
            value={phone}
            onChange={setPhone}
          />
          <button
            type="submit"
            className="absolute right-0 PhoneCheck-btn"
            onClick={() => setIsSubmitted(true)}
          >
            {intl.formatMessage({ id: 'CONFIRM' })}
          </button>
        </div>
        {isDirty && isValid && !isSuccess ? (
          <Alert
            message={intl.formatMessage({ id: 'VALID_NUMBER_PHONE' })}
            className="mt-4"
          />
        ) : null}
        {isSubmitted && !isValid ? (
          <Alert
            type="error"
            message={intl.formatMessage({ id: 'INVALID_NUMBER_PHONE' })}
            className="mt-4"
          />
        ) : null}
        {isSubmitted && isError ? (
          <Alert
            type="error"
            message={intl.formatMessage({ id: 'ERROR_DURING_UPDATE' })}
            className="mt-4"
          />
        ) : null}
        {isSubmitted && !isError && isValid && isSuccess ? (
          <Alert
            type="success"
            message={intl.formatMessage({ id: 'NUMBER_UPDATED' })}
            className="mt-4"
          />
        ) : null}
      </form>
    </div>
  );
}
