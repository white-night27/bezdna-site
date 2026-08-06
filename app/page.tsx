import { features, menuCategories, navigation, venue } from "./content";
import SiteInteractions from "./site-interactions";

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
            <img src="/logo.svg" alt="БЕЗДНА" width="995" height="826" />
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
          <a href="#contacts" className="nav-cta">
            Забронировать стол
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
        <a href="#contacts" className="btn btn-primary">
          Забронировать стол
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
                <a href={venue.telegramUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  Забронировать стол
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
            <p className="menu-note">Цены и состав блюд приведены по актуальному меню. Наличие отдельных позиций уточняйте в баре.</p>
            <nav className="menu-nav" aria-label="Категории меню">
              {menuCategories.map((category) => (
                <a href={`#${category.id}`} key={category.id}>{category.title}</a>
              ))}
            </nav>

            {menuCategories.map((category) => (
              <article className="menu-category" id={category.id} key={category.id}>
                <div className="menu-category-head">
                  <span className="menu-category-num">{category.number}</span>
                  <h3 className="menu-category-title">{category.title}</h3>
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

            <p className="menu-drinks-note">Выбор напитков и заказ — на баре.</p>
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
            <div className="impressions-grid">
              <div className="impression">
                <p className="impression-text">Гости отмечают, что здесь можно услышать собеседника — музыка звучит фоном, а не перекрикивает разговор.</p>
                <span className="impression-source">— из отзывов на Яндекс Картах</span>
              </div>
              <div className="impression">
                <p className="impression-text">Отдельно хвалят порции: бургеры с томлёным мясом называют одними из лучших в городе, а рёбра и наливки — поводом вернуться снова.</p>
                <span className="impression-source">— из отзывов на Яндекс Картах</span>
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
                <address>{venue.address}<br />м. «{venue.metro}», {venue.distance}</address>
                <p className="contact-phone"><a href={venue.phoneHref}>{venue.phone}</a></p>
                <p className="route-link"><a href={venue.mapUrl} target="_blank" rel="noopener noreferrer">Проложить маршрут →</a></p>
              </div>
              <div className="contact-block">
                <h3>Часы работы</h3>
                <div className="hours-row"><span>Ежедневно</span><span>{venue.hours}</span></div>
                <p className="rating-note">5.0 ★ на Яндекс Картах, 521 отзыв, награда «Лучшее место 2026»</p>
              </div>
              <div className="contact-block">
                <h3>Бронирование</h3>
                <p>Столы бронируются по телефону или в Telegram. Заведение можно посетить с собакой.</p>
                <a href={venue.telegramUrl} className="btn btn-primary booking-button" target="_blank" rel="noopener noreferrer">Забронировать стол</a>
                <div className="socials">
                  <a href={venue.telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Бездна в Telegram">Telegram</a>
                </div>
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
            <span>Рижский пр., 12, Санкт-Петербург</span>
            <span>18+ · {venue.phone} · t.me/abyss_calling</span>
          </div>
        </div>
      </footer>

      <div className="mobile-cta">
        <a href={venue.telegramUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Забронировать стол</a>
      </div>

      <SiteInteractions />
    </>
  );
}
