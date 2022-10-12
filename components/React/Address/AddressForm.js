import Checkbox from '../Checkbox';
import Input from '../Input';
import React from 'react';
import Select from '../Select';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { isUndefined } from 'lodash-es';

export default function AddressForm({ address = {}, onSubmit = () => {} }) {
  const intl = useIntl();
  const { register, handleSubmit, formState, setError } = useForm();

  const titles = (window.CUSTOMER_TITLES || [])
    .map((t) => {
      return {
        label: t.short,
        value: t.id,
        isDefault: !!t.isDefault
      };
    })
    .sort((a, b) => b.isDefault - a.isDefault);

  const countries = (window.COUNTRIES || []).map((c) => {
    return {
      label: c.title,
      value: c.id,
      isDefault: c.id === window.DEFAULT_COUNTRY
    };
  });

  return (
    <form
      className={`flex flex-col gap-6 ${
        formState.isSubmitting ? 'opacity-50' : ''
      }`}
      onSubmit={handleSubmit(async (data) => {
        try {
          await onSubmit(data);
        } catch (error) {
          if (error?.response?.data?.schemaViolations) {
            for (const [key, val] of Object.entries(
              error?.response?.data?.schemaViolations
            )) {
              setError(key, {
                type: 'manual',
                message: val.message,
                shouldFocus: true
              });
            }
          }
        }
      })}
    >
      <small className="text-gray-600">
        {intl.formatMessage({ id: 'MANDATORY_FIELDS' })}
      </small>
      <div className="md:w-1/2">
        <Input
          label={intl.formatMessage({ id: 'LABEL_LABEL' })}
          defaultValue={address.label}
          required={true}
          {...register('label', {
            required: intl.formatMessage({ id: 'MANDATORY' })
          })}
          error={formState.errors?.label?.message}
        />
      </div>

      <div className="w-1/2 lg:w-1/3">
        <Select
          label={intl.formatMessage({ id: 'CIVILITY_TITLE_LABEL' })}
          defaultValue={
            isUndefined(address.title)
              ? titles.find((t) => t.isDefault).value
              : address.title
          }
          required={true}
          options={titles}
          {...register('civilityTitle.id', {
            required: intl.formatMessage({ id: 'MANDATORY' })
          })}
          error={formState.errors?.title?.message}
        />
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Input
            label={intl.formatMessage({ id: 'FIRSTNAME_LABEL' })}
            defaultValue={address.firstName}
            required={true}
            {...register('firstName', {
              required: intl.formatMessage({ id: 'MANDATORY' })
            })}
            error={formState.errors?.firstName?.message}
          />
        </div>
        <div className="w-1/2">
          <Input
            label={intl.formatMessage({ id: 'LASTNAME_LABEL' })}
            defaultValue={address.lastName}
            required={true}
            {...register('lastName', {
              required: intl.formatMessage({ id: 'MANDATORY' })
            })}
            error={formState.errors?.lastName?.message}
          />
        </div>
      </div>

      <Input
        label={intl.formatMessage({ id: 'COMPANY_LABEL' })}
        defaultValue={address.company}
        {...register('company')}
        error={formState.errors?.company?.message}
      />

      <Input
        label={intl.formatMessage({ id: 'ADDRESS_1_LABEL' })}
        required={true}
        defaultValue={address.address1}
        {...register('address1', {
          required: intl.formatMessage({ id: 'MANDATORY' })
        })}
        error={formState.errors?.address1?.message}
      />
      <Input
        label={intl.formatMessage({ id: 'ADDRESS_2_LABEL' })}
        defaultValue={address.address2}
        {...register('address2')}
        error={formState.errors?.address2?.message}
      />

      <div className="flex gap-3">
        <div className="w-1/2 md:w-2/3">
          <Input
            label={intl.formatMessage({ id: 'CITY_LABEL' })}
            required={true}
            defaultValue={address.city}
            {...register('city', {
              required: intl.formatMessage({ id: 'MANDATORY' })
            })}
            error={formState.errors?.city?.message}
          />
        </div>

        <div className="w-1/2 md:w-1/3">
          <Input
            label={intl.formatMessage({ id: 'ZIPCODE_LABEL' })}
            required={true}
            defaultValue={address.zipCode}
            {...register('zipCode', {
              required: intl.formatMessage({ id: 'MANDATORY' })
            })}
            error={formState.errors?.zipCode?.message}
          />
        </div>
      </div>

      <div className="w-1/2">
        <Select
          label={intl.formatMessage({ id: 'COUNTRY_LABEL' })}
          required={true}
          options={countries}
          defaultValue={
            isUndefined(address.countryCode)
              ? countries.find((c) => c.isDefault).value
              : address.countryCode
          }
          {...register('countryCode', { required: 'Mandatory' })}
          error={formState.errors?.countryCode?.message}
        />
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Input
            label={intl.formatMessage({ id: 'CELLPHONE_LABEL' })}
            required={true}
            defaultValue={address.cellphone}
            {...register('cellphone', {
              required: intl.formatMessage({ id: 'MANDATORY' })
            })}
            error={formState.errors?.cellphone?.message}
          />
        </div>
        <div className="w-1/2">
          <Input
            label={intl.formatMessage({ id: 'PHONE_LABEL' })}
            defaultValue={address.phone}
            {...register('phone')}
            error={formState.errors?.phone?.message}
          />
        </div>
      </div>

      <Checkbox
        label={intl.formatMessage({ id: 'DEFAULT_ADDRESS' })}
        className="py-4 text-base"
        {...register('isDefault')}
      />

      <div className="mx-auto text-center md:col-span-2">
        <button type="submit" className="Button">
          {intl.formatMessage({ id: 'SUBMIT' })}
        </button>
      </div>
    </form>
  );
}
