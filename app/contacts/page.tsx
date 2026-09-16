import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { venue } from "../content";
import SiteInteractions from "../site-interactions";

export const metadata: Metadata = {
  title: "Как добраться и забронировать — БЕЗДНА",
  description:
    "Адрес, часы работы, телефон и маршруты до тапрума и кухни «Бездна» на Рижском проспекте, 12 в Санкт-Петербурге.",
  alternates: { canonical: "/contacts" },
  openGraph: {
    url: "/contacts",
    title: "Как найти «Бездну» на Рижском проспекте",
    description: "Рижский проспект, 12. Ежедневно 16:00–03:00. Маршрут, телефон и бронирование.",
  },
};

export default function ContactsPage() {
  return (
    <>
      <a href="#contacts-content" className="skip-link">Перейти к маршруту</a>
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <header className="legal-header">
        <div className="container legal-header-inner">
          <Link href="/" className="legal-logo" aria-label="БЕЗДНА — на главную">
            <Image src="/logo.svg" alt="БЕЗДНА" width={995} height={826} priority />
          </Link>
          <Link href="/menu" className="legal-back-link">Посмотреть меню</Link>
        </div>
      </header>

      <main id="contacts-content" className="contacts-page">
        <section className="container contacts-page-content" aria-labelledby="contacts-page-title">
          <p className="eyebrow">Санкт-Петербург · Адмиралтейский район</p>
          <h1 id="contacts-page-title">Как найти <span className="accent">Бездну</span></h1>
          <p className="contacts-page-lead">
            Тапрум и кухня на Рижском проспекте, 12. Открыты ежедневно с 16:00 до 03:00.
            Если нужен стол на конкретное время, позвоните сотруднику перед визитом.
          </p>

          <div className="route-action-grid" aria-label="Основные действия">
            <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer" className="route-action-card" data-conversion="route-yandex-contacts-page">
              <span>Маршрут</span>
              <strong>Яндекс Карты</strong>
              <small>Открыть точку и построить путь →</small>
            </a>
            <a href={venue.twoGisUrl} target="_blank" rel="noopener noreferrer" className="route-action-card" data-conversion="route-2gis-contacts-page">
              <span>Маршрут</span>
              <strong>2ГИС</strong>
              <small>Открыть карточку заведения →</small>
            </a>
            <a href={venue.phoneHref} className="route-action-card route-action-card-primary" data-conversion="phone-contacts-page">
              <span>Бронирование</span>
              <strong>{venue.phone}</strong>
              <small>Позвонить сотруднику →</small>
            </a>
          </div>

          <div className="arrival-grid">
            <article>
              <h2>Адрес</h2>
              <address>{venue.address}</address>
              <p>В карточках Яндекса и 2ГИС отмечен вход в здание. Перед выходом откройте маршрут на выбранной карте.</p>
            </article>
            <article>
              <h2>От метро</h2>
              <p>Ближайшая станция — «{venue.metro}». По данным Яндекс Карт, пеший путь составляет около 1 км.</p>
            </article>
            <article>
              <h2>От остановки</h2>
              <p>Остановка «Лермонтовский проспект» находится рядом с домом — около 20 м по данным Яндекс Карт.</p>
            </article>
            <article>
              <h2>Поздний визит</h2>
              <p>Бар работает до 03:00. Время работы кухни и наличие отдельных позиций поздно вечером уточняйте по телефону.</p>
            </article>
          </div>

          <div className="contacts-page-footer">
            <p>Рижский пр., 12 · ежедневно {venue.hours}</p>
            <Link href="/menu" className="btn btn-ghost">Открыть меню</Link>
          </div>
        </section>
      </main>

      <aside className="mobile-cta" aria-label="Быстрое бронирование">
        <a href={venue.phoneHref} className="btn btn-primary" data-conversion="phone-contacts-mobile">Позвонить и забронировать</a>
      </aside>
      <SiteInteractions />
    </>
  );
}
