import React, {
  Suspense,
  useLayoutEffect,
  useRef,
  useState,
  useEffect
} from 'react';
import { showLogin, hideCart } from '@js/redux/modules/visibility';
import {
  useCartItemDelete,
  useCartItemUpdate,
  useCartQuery,
  useCustomer
} from '@openstudio/thelia-api-utils';
import { useDispatch, useSelector } from 'react-redux';

import AddCoupon from '../AddCoupon';
import { ReactComponent as IconCLose } from '@icons/close.svg';
import { ReactComponent as IconTrash } from '@icons/trash.svg';
import useLockBodyScroll from '@utils/useLockBodyScroll';
import { useClickAway } from 'react-use';
import Loader from '../Loader';
import priceFormat from '@utils/priceFormat';
import { useIntl } from 'react-intl';
import Quantity from '../Quantity';
import useEscape from '@js/utils/useEscape';
import closeAndFocus from '@js/utils/closeAndFocus';
import { trapTabKey } from '@js/standalone/trapItemsMenu';

function Price({ price, price_promo, isPromo }) {
  return (
    <div className="flex items-center text-lg">
      {isPromo ? (
        <div className="flex flex-col items-end font-bold leading-none">
          <span className="mb-1">{priceFormat(+price_promo)}</span>
          <span className="text-sm font-normal line-through">
            {priceFormat(+price)}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-end font-bold leading-none">
          {priceFormat(+price)}
        </div>
      )}
    </div>
  );
}

function Delete({ id, setRemoveItem, visible }) {
  const { mutate: deleteItem, status } = useCartItemDelete(id);

  useEffect(() => {
    status === 'loading' ? setRemoveItem(true) : setRemoveItem(false);
  }, [status, setRemoveItem]);

  if (!id) return null;

  return (
    <button
      onClick={() => deleteItem()}
      className="focus: outline-gray-600"
      tabIndex={visible ? '0' : '-1'}
    >
      <IconTrash className="h-[17px] w-[12px]" />
    </button>
  );
}

export function Item({
  id,
  product,
  productSaleElement,
  price,
  promo,
  promoPrice,
  quantity,
  canDelete,
  canChangeQuantity,
  recap,
  images = [],
  visible
}) {
  const [removeItem, setRemoveItem] = useState(false);
  const { mutate, status } = useCartItemUpdate(id);

  const intl = useIntl();

  return (
    <div
      className={`CartItem ${
        removeItem || status === 'loading'
          ? 'pointer-events-none opacity-50'
          : ''
      } ${recap ? 'CartItem--recap' : ''}`}
    >
      {images.length > 0 ? (
        <div className="CartItem-img">
          {images ? (
            <img
              src={`/legacy-image-library/product_image_${images?.[0]?.id}/full/!106,/0/default.webp`}
              alt={
                typeof images?.[0]?.i18n?.title === 'string'
                  ? `${images?.[0]?.i18n?.title} ${intl.formatMessage({
                      id: 'VISUAL_OF_CART'
                    })}`
                  : `${product?.i18n.title} ${intl.formatMessage({
                      id: 'VISUAL_OF_CART'
                    })}`
              }
              title={
                typeof images?.[0]?.i18n?.title === 'string'
                  ? `${images?.[0]?.i18n?.title} ${intl.formatMessage({
                      id: 'VISUAL_OF_CART'
                    })}`
                  : `${product?.i18n.title} ${intl.formatMessage({
                      id: 'VISUAL_OF_CART'
                    })}`
              }
              loading="lazy"
            />
          ) : null}
        </div>
      ) : (
        <div className="CartItem-img">
          <img
            src={window.PLACEHOLDER_IMAGE}
            alt={
              typeof images?.[0]?.i18n?.title === 'string'
                ? `${images?.[0]?.i18n?.title} ${intl.formatMessage({
                    id: 'VISUAL_OF_CART'
                  })}`
                : `${product?.i18n.title} ${intl.formatMessage({
                    id: 'VISUAL_OF_CART'
                  })}`
            }
            title={
              typeof images?.[0]?.i18n?.title === 'string'
                ? `${images?.[0]?.i18n?.title} ${intl.formatMessage({
                    id: 'VISUAL_OF_CART'
                  })}`
                : `${product?.i18n.title} ${intl.formatMessage({
                    id: 'VISUAL_OF_CART'
                  })}`
            }
            loading="lazy"
          />
        </div>
      )}
      <div className="CartItem-contain">
        <div className="item-center flex justify-between">
          <a
            href={product.url}
            className="mr-4 block font-bold"
            tabIndex={visible ? '0' : '-1'}
          >
            {product.i18n.title}
          </a>
          {canDelete ? (
            <Delete id={id} setRemoveItem={setRemoveItem} visible={visible} />
          ) : null}
        </div>
        <div className="text-sm leading-none text-gray-600 ">
          <div>
            {productSaleElement?.attributes?.map((attribute) => {
              return (
                <div key={attribute.id}>
                  {attribute?.i18n?.title}:{' '}
                  {attribute?.values
                    ?.map((value) => value?.i18n?.title || '')
                    .join(' - ')}
                </div>
              );
            })}
          </div>
          <div>
            {intl.formatMessage({ id: 'UNIT_PRICE' })}:{' '}
            {priceFormat(price.taxed)}
          </div>
        </div>
        <div className=" CartItem-bottom">
          {canChangeQuantity ? (
            <Quantity
              max={productSaleElement?.quantity || 0}
              mutate={mutate}
              quantity={quantity}
              small={true}
              visible={visible}
            />
          ) : (
            <span className="CartItem-smallQuantity">x{quantity}</span>
          )}
          <Price
            price={price.taxed * quantity}
            price_promo={promoPrice.taxed * quantity}
            isPromo={promo}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  const intl = useIntl();
  return (
    <legend className="Title Title--3 text-center">
      <button
        type="button"
        className="SideBar-close"
        aria-label={intl.formatMessage({ id: 'CLOSE_CART' })}
        data-close-cart
      >
        <IconCLose className="pointer-events-none h-3 w-3" />
      </button>
      {intl.formatMessage({ id: 'CART_EMPTY' })}
    </legend>
  );
}

export function CartItems({
  cart,
  canDelete = true,
  canChangeQuantity = true,
  recap = false,
  visible
}) {
  return (
    <div>
      <div className={`CartItems ${recap ? 'CartItems--recap' : ''}`}>
        {cart.items?.map((item, index) => (
          <Item
            key={item.id || index}
            canDelete={canDelete}
            canChangeQuantity={canChangeQuantity}
            recap={recap}
            visible={visible}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

function FooterItem({ label, value }) {
  return (
    <dl className="flex items-center justify-between text-lg uppercase leading-none">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}

function Total({ label, value }) {
  return (
    <dl className="flex flex-col items-baseline justify-between leading-none">
      <dt className="text-sm text-gray-600">{label}</dt>
      <dd className="text-3xl font-medium">{value}</dd>
    </dl>
  );
}

export function MiniCartFooter({ delivery, taxes, discount, coupon, total }) {
  const intl = useIntl();
  return (
    <div>
      <div className="grid gap-y-4 border-t border-b border-main border-opacity-25 py-5">
        <AddCoupon />
        <FooterItem
          label={intl.formatMessage({ id: 'TOTAL_UNTAXED' })}
          value={priceFormat(total - taxes)}
        />
        {delivery !== null ? (
          <FooterItem
            label={intl.formatMessage({ id: 'DELIVERY' })}
            value={priceFormat(delivery)}
          />
        ) : null}
        <FooterItem
          label={intl.formatMessage({ id: 'TAXES' })}
          value={priceFormat(taxes)}
        />
        {discount && coupon !== 'NO_COUPON' ? (
          <FooterItem
            label={intl.formatMessage({ id: 'DISCOUNT' })}
            value={priceFormat(discount)}
          />
        ) : null}
      </div>
      <Total
        label={intl.formatMessage({ id: 'TOTAL' })}
        value={priceFormat(total + delivery)}
      />
    </div>
  );
}

function MiniCart({ visible, redirect }) {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const focusRef = useRef(null);
  const { data: cart = {} } = useCartQuery();
  const { data: customer } = useCustomer();
  const intl = useIntl();
  const [totalQuantityCart, setTotalQuantityCart] = useState(
    cart?.items?.length || 0
  );

  useLayoutEffect(() => {
    if (cart) {
      let count = 0;
      cart?.items?.forEach((el) => {
        count = count + (el?.quantity || 0);
      });
      setTotalQuantityCart(count);
    }
  }, [cart]);

  useEffect(() => {
    const node = document.getElementById('js-cart-count');
    if (node) {
      node.innerText = `${totalQuantityCart || 0}`;
    }
  }, [totalQuantityCart]);

  useLockBodyScroll(ref, visible, redirect);

  useClickAway(ref, (e) => {
    if (!e.target?.matches('[data-toggle-cart]') && visible) {
      closeAndFocus(() => dispatch(hideCart()), '[data-toggle-cart]');
    }
  });

  useLayoutEffect(() => {
    if (visible) {
      focusRef.current.focus();
    }
  }, [focusRef, visible]);

  useEscape(ref, () =>
    closeAndFocus(() => dispatch(hideCart()), '[data-toggle-cart]')
  );

  ref?.current?.addEventListener('keydown', (e) => {
    if (!visible) return;

    trapTabKey(ref.current, e);
  });

  return (
    <div ref={ref} className="grid gap-8">
      <button
        ref={focusRef}
        type="button"
        aria-label={intl.formatMessage({ id: 'CLOSE_CART' })}
        className="SideBar-close"
        data-close-cart
        onClick={() =>
          closeAndFocus(() => dispatch(hideCart()), '[data-toggle-cart]')
        }
        tabIndex={visible ? '0' : '-1'}
      >
        <IconCLose className="pointer-events-none h-3 w-3" />
      </button>
      {!cart.items || cart.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="flex items-center justify-between ">
            <strong className="Title Title--3">mon panier</strong>
            <span className="block text-base font-bold text-gray-600">
              {totalQuantityCart +
                ' article' +
                (totalQuantityCart > 1 ? 's' : '')}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Total
              label={intl.formatMessage({ id: 'TOTAL' })}
              value={priceFormat(cart.total + cart.delivery)}
            />
            <a
              href="/order/delivery"
              className={`Button ${
                cart.items?.length <= 0 ? 'opacity-50' : ''
              }`}
              onClick={(e) => {
                if (cart.items?.length === 0) {
                  e.preventDefault();
                }
                if (!customer) {
                  e.preventDefault();
                  dispatch(
                    showLogin({ showCart: true, redirectionToCheckout: true })
                  );
                }
              }}
              tabIndex={visible ? '0' : '-1'}
            >
              {intl.formatMessage({ id: 'SUBMIT_CART' })}
            </a>
          </div>
          <CartItems cart={cart} visible={visible} />
        </>
      )}
    </div>
  );
}

export default function MiniCartWrapper() {
  const { cart: visible, redirectionToCheckout: redirect } = useSelector(
    (state) => state.visibility
  );

  return (
    <div className={`SideBar ${visible ? 'SideBar--visible' : ''} `}>
      <Suspense fallback={<Loader />}>
        <MiniCart visible={visible} redirect={redirect} />
      </Suspense>
    </div>
  );
}
