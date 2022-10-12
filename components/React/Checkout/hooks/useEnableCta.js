import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useEnableCta(currentStep = 1, checkout = {}) {
  const { mode: selectedMode, phoneNumberValid } = useSelector(
    (state) => state.checkout
  );
  const [enabledCta, setEnabledCta] = useState(1);

  useEffect(() => {
    setEnabledCta(false);
    switch (currentStep) {
      case 4:
        if (
          checkout?.isComplete &&
          checkout.acceptedTermsAndConditions &&
          phoneNumberValid
        ) {
          setEnabledCta(true);
        }
        break;
      case 3:
        if (
          selectedMode !== null &&
          checkout?.deliveryModuleId &&
          checkout?.deliveryModuleOptionCode &&
          (checkout?.deliveryAddressId || checkout.pickupAddress) &&
          checkout?.billingAddressId
        ) {
          setEnabledCta(true);
        }
        break;
      case 2:
        setEnabledCta(false);
        if (
          selectedMode !== null &&
          checkout?.deliveryModuleId &&
          checkout?.deliveryModuleOptionCode &&
          (checkout?.deliveryAddressId || checkout.pickupAddress)
        ) {
          setEnabledCta(true);
        }
        break;
      case 1:
        setEnabledCta(true);
        break;
      default:
        setEnabledCta(false);
    }
  }, [checkout, selectedMode, currentStep, phoneNumberValid]);

  return enabledCta;
}
