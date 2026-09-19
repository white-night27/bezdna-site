import Image from "next/image";
import { features, legalDetails, menuCategories, navigation, venue } from "./content";

const atmosphere = [
  {
    time: "16:00",
    label: "открытие",
    title: "Поверхность",
    text: "Двери открываются, на кранах уже налиты крафтовые новинки дня. Тихо, спокойно, можно занять место у стойки и без спешки изучить, что сегодня разливают.",
  },
  {
    time: "22:00",
    label: "пик",
    title: "Толща",
    text: "Самое оживлённое время вечера: экраны показывают спортивные трансляции, кухня работает без пауз, у стойки собирается очередь за следующим бокалом. При этом разговор всё ещё слышно — громкую музыку здесь не жалуют.",
  },
  {
    time: "03:00",
    label: "закрытие",
    title: "Дно",
    text: "Последние бокалы, тихие разговоры, щупальца на стенах и красный свет — единственное, что остаётся до самого закрытия. Бар работает так каждый день, без выходных.",
  },
] as const;

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Перейти к содержимому
      </a>
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <header className="site-header" id="siteHeader">
        <div className="container nav-inner">
          <a href="#hero" className="logo" aria-label="БЕЗДНА — на главную">
            <Image src="/logo.svg" alt="БЕЗДНА" width={995} height={826} priority />
          </a>
          <nav aria-label="Основная навигация">
            <ul className="nav-links">
              {navigation.map(([label, href]) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a href={venue.phoneHref} className="nav-cta" data-conversion="phone-header">
            Позвонить
          </a>
          <button
            className="nav-toggle"
            id="navToggle"
            aria-label="Открыть меню"
            aria-expanded="false"
            aria-controls="navDrawer"
          >
            ☰
          </button>
        </div>
      </header>

      <div className="nav-drawer" id="navDrawer" hidden aria-hidden="true">
        <button className="nav-drawer-close" id="navClose" aria-label="Закрыть меню">
          ✕
        </button>
        <ul>
          {navigation.map(([label, href]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
        <a href={venue.phoneHref} className="btn btn-primary" data-conversion="phone-menu">
          Позвонить и забронировать
        </a>
      </div>

      <main id="main">
        <section className="hero" id="hero" aria-label="Заглавный экран">
          <div className="hero-visual" aria-hidden="true" id="heroVisual">
            <svg className="hero-rings" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="fade" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#e0392f" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#e0392f" stopOpacity="0" />
                </radialGradient>
              </defs>
              {[120, 200, 280, 360].map((radius, index) => (
                <circle
                  key={radius}
                  cx="400"
                  cy="400"
                  r={radius}
                  fill="none"
                  stroke="#7a1414"
                  strokeOpacity={0.5 - index * 0.1}
                  strokeWidth="1"
                />
              ))}
              <circle cx="400" cy="400" r="60" fill="url(#fade)" />
              <g stroke="#b32020" strokeOpacity="0.35" strokeWidth="1">
                <line x1="400" y1="400" x2="400" y2="20" />
                <line x1="400" y1="400" x2="400" y2="780" />
                <line x1="400" y1="400" x2="20" y2="400" />
                <line x1="400" y1="400" x2="780" y2="400" />
                <line x1="400" y1="400" x2="130" y2="130" />
                <line x1="400" y1="400" x2="670" y2="670" />
                <line x1="400" y1="400" x2="130" y2="670" />
                <line x1="400" y1="400" x2="670" y2="130" />
              </g>
            </svg>
          </div>

          <div className="hero-content">
            <div className="container">
              <p className="eyebrow">{venue.label}</p>
              <h1 className="hero-title">
                БЕЗ
                <br />
                <em>ДНА</em>
              </h1>
              <p className="hero-sub">
                Комната с кранами на Рижском проспекте — и куда больше, чем кажется с порога. <strong>Крафтовое пиво</strong>, кухня без полуфабрикатов и щупальца на стенах вместо декора.
              </p>
              <div className="hero-ctas">
                <a href={venue.phoneHref} className="btn btn-primary" data-conversion="phone-hero">
                  Позвонить и забронировать
                </a>
                <a href="#menu" className="btn btn-ghost">
                  Посмотреть меню
                </a>
              </div>
              <div className="hero-badges">
                <span><b>Поздние</b> часы работы</span>
                <span className="dot" aria-hidden="true" />
                <span>Крафт на кранах</span>
                <span className="dot" aria-hidden="true" />
                <span>Кухня полного цикла</span>
              </div>
            </div>
          </div>

          <div className="hero-meta">
            <div className="container">
              <span className="scroll-cue">Пролистайте вниз</span>
              <span>Рижский пр., 12 · м. Балтийская · ежедневно {venue.hours}</span>
            </div>
          </div>
        </section>

        <section id="about" aria-labelledby="about-title">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">О баре</p>
              <h2 className="section-title" id="about-title">
                Комната с кранами.<br /><span className="accent">И не только.</span>
              </h2>
            </div>
            <div className="about-grid">
              <p className="about-quote">Название формата — тапрум. По сути — стена кранов с крафтовым пивом. По ощущениям — гораздо больше, чем просто бар.</p>
              <div className="about-divider" aria-hidden="true" />
              <div className="about-body">
                <p className="lead">«Бездна» открылась как тапрум одноимённой пивоварни, но быстро обзавелась полноценной кухней, трансляциями и своей ночной атмосферой.</p>
                <p>Внутри — тёмный зал, красные акценты, растения и щупальца на стенах. На кранах — собственные и гостевые сорта, на кухне — бургеры, рёбра, пицца и закуски без полуфабрикатов.</p>
                <p>Сюда приходят после работы, на матч, встретиться с друзьями или просто занять место у стойки до закрытия.</p>
                <div className="about-stats">
                  <div><b>16:00</b><span>открываемся</span></div>
                  <div><b>03:00</b><span>закрываемся</span></div>
                  <div><b>7/7</b><span>без выходных</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="menu" aria-labelledby="menu-title">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Меню</p>
              <h2 className="section-title" id="menu-title">
                Кухня <span className="accent">Бездны</span>
              </h2>
            </div>
            <p className="menu-note">Рёбра, бургеры, пицца, горячее и закуски. Цены, состав и вес собраны на отдельной странице — её удобнее открыть за столом или перед визитом.</p>
            <ul className="menu-category-cards" aria-label="Разделы меню">
              {menuCategories.map((category) => (
                <li key={category.id}>
                  <span>{category.number}</span>
                  <strong>{category.title}</strong>
                  <small>{category.items.length} позиций</small>
                </li>
              ))}
            </ul>
            <div className="menu-actions">
              <a href="/menu" className="btn btn-primary" data-conversion="menu-full">Открыть полное меню</a>
              <a href={venue.phoneHref} className="btn btn-ghost" data-conversion="phone-menu-section">Уточнить наличие</a>
            </div>
            <div className="food-gallery">
              <figure className="food-card food-card-wide">
                <picture>
                  <source srcSet="/food/ribs-hq.avif" type="image/avif" />
                  <source srcSet="/food/ribs-hq.webp" type="image/webp" />
                  <img
                    src="/food/ribs-hq.webp"
                    alt="Фирменные свиные рёбра Бездны с картофелем и салатом"
                    width="1600"
                    height="1200"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <figcaption><strong>Свиные рёбра</strong><span>550/70 г · соус на выбор</span></figcaption>
              </figure>
              <figure className="food-card">
                <picture>
                  <source srcSet="/food/burger-dvabro-hq.avif" type="image/avif" />
                  <source srcSet="/food/burger-dvabro-hq.webp" type="image/webp" />
                  <img
                    src="/food/burger-dvabro-hq.webp"
                    alt="Бургер Двабро с говяжьей котлетой, беконом и сыром чеддер"
                    width="1600"
                    height="1200"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <figcaption><strong>Бургер «Двабро»</strong><span>Говядина · бекон · чеддер</span></figcaption>
              </figure>
              <figure className="food-card">
                <picture>
                  <source srcSet="/food/pizza-dyavolitsa-hq.avif" type="image/avif" />
                  <source srcSet="/food/pizza-dyavolitsa-hq.webp" type="image/webp" />
                  <img
                    src="/food/pizza-dyavolitsa-hq.webp"
                    alt="Острая пицца Дьяволица с чоризо и халапеньо"
                    width="1600"
                    height="1200"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <figcaption><strong>Пицца «Дьяволица»</strong><span>Чоризо · халапеньо · шрирача</span></figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="atmosphere" aria-labelledby="atmos-title">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Атмосфера</p>
              <h2 className="section-title" id="atmos-title">
                Один <span className="accent">день</span>, три глубины
              </h2>
            </div>
            <div className="atmos-timeline">
              {atmosphere.map((item) => (
                <div className="atmos-row" key={item.time}>
                  <div className="atmos-time">{item.time}<span>{item.label}</span></div>
                  <div className="atmos-text">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" aria-labelledby="features-title">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Особенности</p>
              <h2 className="section-title" id="features-title">
                Что здесь <span className="accent">ценят</span>
              </h2>
            </div>
            <ul className="feature-tags">
              {features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <div className="impressions-grid first-visit-grid">
              <div className="impression">
                <h3>Первый визит</h3>
                <p className="impression-text">Посмотрите меню заранее, откройте точку на карте и позвоните, если нужен стол на конкретное время.</p>
              </div>
              <div className="impression">
                <h3>Отзывы и фотографии</h3>
                <p className="impression-text">Проверьте свежие впечатления гостей и фотографии заведения в карточке 2ГИС.</p>
                <a className="source-link" href={venue.twoGisUrl} target="_blank" rel="noopener noreferrer">Открыть 2ГИС →</a>
              </div>
            </div>
          </div>
        </section>

        <section id="contacts" aria-labelledby="contacts-title">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Контакты</p>
              <h2 className="section-title" id="contacts-title">Найти <span className="accent">вход</span></h2>
            </div>
            <div className="contacts-grid">
              <div className="contact-block">
                <h3>Адрес</h3>
                <address>{venue.address}<br />ближайшее метро — «{venue.metro}»</address>
                <p className="contact-phone"><a href={venue.phoneHref}>{venue.phone}</a></p>
                <p className="route-link"><a href={venue.mapUrl} target="_blank" rel="noopener noreferrer" data-conversion="route-yandex">Открыть на Яндекс Картах →</a></p>
                <p className="route-link"><a href="/contacts" data-conversion="route-details">Подробный маршрут и ориентиры →</a></p>
              </div>
              <div className="contact-block">
                <h3>Часы работы</h3>
                <div className="hours-row"><span>Ежедневно</span><span>{venue.hours}</span></div>
                <p className="contact-note">Время работы кухни и наличие отдельных позиций лучше уточнить по телефону перед поздним визитом.</p>
              </div>
              <div className="contact-block">
                <h3>Бронирование</h3>
                <p>Позвоните сотруднику, чтобы уточнить свободный стол на нужные дату и время.</p>
                <a href={venue.phoneHref} className="btn btn-primary booking-button" data-conversion="phone-contacts">Позвонить и забронировать</a>
                <div className="socials">
                  <a href={venue.telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Сообщество Бездны в Telegram">Telegram-сообщество</a>
                </div>
                <p className="contact-note">Telegram — новости и общение. Для брони используйте телефон.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-word" aria-hidden="true">БЕЗДНА</span>
          <div className="footer-meta">
            <span>© {new Date().getFullYear()} Тапрум и кухня «Бездна»</span>
            <span><b>Адрес заведения:</b> Санкт-Петербург, Рижский пр., 12</span>
            <span>
              18+ · <a href={venue.phoneHref}>{venue.phone}</a> ·{" "}
              <a href={venue.telegramUrl} target="_blank" rel="noopener noreferrer">Telegram</a>
            </span>
            <span className="footer-legal-owner">Владелец сайта: {legalDetails.ownerShortName}</span>
            <a className="footer-legal-link" href="/legal">Правовая информация</a>
          </div>
        </div>
      </footer>

      <aside className="mobile-cta" aria-label="Быстрое бронирование">
        <a href={venue.phoneHref} className="btn btn-primary" data-conversion="phone-mobile">Позвонить и забронировать</a>
      </aside>

      <script src="/site.js" defer />
    </>
  );
}
