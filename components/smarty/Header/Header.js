import { trapTabKey } from '@js/standalone/trapItemsMenu';

function manageFocusAccesibilty(target, targetMenu, activeClass = 'open') {
  const lang = document.querySelector(target);

  if (!lang) return;

  lang.addEventListener('keydown', (e) => {
    const { key } = e;

    if (!['Enter', 'Escape'].includes(key)) return;

    e.preventDefault();
    e.stopPropagation();

    const menu = lang.querySelector(targetMenu);

    if (!menu) return;

    if (key !== 'Escape') {
      menu.classList.add(activeClass);
    }

    const firstItem = menu.querySelector('a');

    if (!firstItem) return;

    firstItem.focus();

    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        menu.classList.remove(activeClass);
        lang.querySelector('a').focus();
        return;
      }

      trapTabKey(menu, event);
    });
  });
}

function Header() {
  manageFocusAccesibilty('#header-account', '.Header-dropdown');
  manageFocusAccesibilty('#lang-select', '.LangSelect-dropdown');
}

export default Header;
