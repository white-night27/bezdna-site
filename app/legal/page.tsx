import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { legalDetails, venue } from "../content";

export const metadata: Metadata = {
  title: "Правовая информация — БЕЗДНА",
  description: "Реквизиты владельца сайта и контактная информация тапрума и кухни «Бездна».",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <>
      <a href="#main" className="skip-link">Перейти к содержимому</a>
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <header className="legal-header">
        <div className="container legal-header-inner">
          <Link href="/" className="legal-logo" aria-label="БЕЗДНА — вернуться на главную">
            <Image src="/logo.svg" alt="БЕЗДНА" width={995} height={826} priority />
          </Link>
          <Link href="/" className="legal-back-link">Вернуться на сайт</Link>
        </div>
      </header>

      <main id="main" className="legal-page">
        <section className="container legal-content" aria-labelledby="legal-title">
          <p className="eyebrow">Документы</p>
          <h1 id="legal-title">Правовая информация</h1>
          <p className="legal-intro">
            Сведения о владельце сайта bezdna-bar.ru и контактные данные заведения.
          </p>

          <dl className="legal-details">
            <div>
              <dt>Владелец сайта</dt>
              <dd>{legalDetails.ownerName}</dd>
            </div>
            <div>
              <dt>ИНН</dt>
              <dd>{legalDetails.inn}</dd>
            </div>
            <div>
              <dt>ОГРН</dt>
              <dd>{legalDetails.ogrn}</dd>
            </div>
            <div>
              <dt>Адрес заведения</dt>
              <dd><address>{venue.address}</address></dd>
            </div>
            <div>
              <dt>Юридический адрес</dt>
              <dd><address>{legalDetails.legalAddress}</address></dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd><a href={`mailto:${legalDetails.email}`}>{legalDetails.email}</a></dd>
            </div>
          </dl>

          <Link href="/" className="legal-return">← На главную</Link>
        </section>
      </main>
    </>
  );
}
