import type { Metadata } from "next";
import { menuCategories, venue } from "../content";

export const metadata: Metadata = {
  title: "Меню — БЕЗДНА, тапрум и кухня",
  description: "Меню кухни Бездны на Рижском проспекте, 12: рёбра, бургеры, пицца, горячее и закуски с ценами и составом.",
  alternates: { canonical: "/menu" },
  openGraph: {
    url: "/menu",
    title: "Меню кухни — БЕЗДНА",
    description: "Рёбра, бургеры, пицца, горячее и закуски на Рижском проспекте, 12.",
  },
};

export default function MenuPage() {
  return (
    <>
      <a href="#menu-content" className="skip-link">Перейти к меню</a>
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <header className="legal-header">
        <div className="container legal-header-inner">
          <a href="/" className="legal-logo" aria-label="БЕЗДНА — на главную">
            <img src="/logo.svg" alt="БЕЗДНА" width="995" height="826" decoding="async" />
          </a>
          <Link href="/contacts" className="legal-back-link">Контакты и бронь</a>
        </div>
      </header>

      <main id="menu-content" className="menu-page">
        <section className="container menu-page-content" aria-labelledby="menu-page-title">
          <p className="eyebrow">Тапрум и кухня · Рижский пр., 12</p>
          <h1 id="menu-page-title">Меню <span className="accent">Бездны</span></h1>
          <div className="menu-page-intro">
            <p>Наличие отдельных позиций может меняться. Перед визитом поздним вечером уточните работу кухни по телефону.</p>
            <a href={venue.phoneHref} className="btn btn-primary" data-conversion="phone-menu-page">Позвонить в бар</a>
          </div>

          <nav className="menu-nav" aria-label="Категории меню">
            {menuCategories.map((category) => (
              <a href={`#${category.id}`} key={category.id}>{category.title}</a>
            ))}
          </nav>

          {menuCategories.map((category) => (
            <article className="menu-category" id={category.id} key={category.id}>
              <div className="menu-category-head">
                <span className="menu-category-num">{category.number}</span>
                <h2 className="menu-category-title">{category.title}</h2>
              </div>
              <ul className="menu-list">
                {category.items.map((item) => (
                  <li className="menu-item" key={`${category.id}-${item.name}`}>
                    <div className="menu-item-row">
                      <span className="menu-item-name">{item.name}</span>
                      <span className="menu-item-leader" aria-hidden="true" />
                      <span className="menu-item-price">{item.price}</span>
                    </div>
                    <p className="menu-item-desc">{item.description}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <div className="menu-page-footer">
            <p>Выбор напитков и заказ — на баре.</p>
            <Link href="/contacts" className="btn btn-ghost">Как добраться</a>
          </div>
        </section>
      </main>

      <aside className="mobile-cta" aria-label="Быстрое бронирование">
        <a href={venue.phoneHref} className="btn btn-primary" data-conversion="phone-menu-mobile">Позвонить и забронировать</a>
      </aside>
      <script src="/site.js" defer />
    </>
  );
}
