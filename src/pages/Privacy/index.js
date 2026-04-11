import { useLanguage } from '../../contexts/LanguageContext';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const Privacy = () => {
  const {t, language} = useLanguage();

  return (
    <>
    <section className="header-section w-100">
        <NavBar mode="dark"/>
        <section className="section-text">
            <div className="h2 pt-5 mb-3">{t('privacy.title')}</div>
        </section>
    </section>
    <section className="p-4 px-5 pb-5 search-page">
        <h1>{t('privacy.title')}</h1>
        <p>{t('privacy.lastUpdated')}</p>

        <h2>{t('privacy.intro.title')}</h2>
        <p>{t('privacy.intro.content')}</p>

        <h2>{t('privacy.dataCollected.title')}</h2>
        <p>{t('privacy.dataCollected.description')}</p>

        <ul>
            <li><strong>{t('privacy.dataCollected.urlPath')}</strong> {t('privacy.dataCollected.urlPathDesc')}</li>
            <li><strong>{t('privacy.dataCollected.method')}</strong> {t('privacy.dataCollected.methodDesc')}</li>
            <li><strong>{t('privacy.dataCollected.statusCode')}</strong> {t('privacy.dataCollected.statusCodeDesc')}</li>
            <li><strong>{t('privacy.dataCollected.userAgent')}</strong> {t('privacy.dataCollected.userAgentDesc')}</li>
            <li><strong>{t('privacy.dataCollected.referrer')}</strong> {t('privacy.dataCollected.referrerDesc')}</li>
            <li><strong>{t('privacy.dataCollected.duration')}</strong> {t('privacy.dataCollected.durationDesc')}</li>
            <li><strong>{t('privacy.dataCollected.ip')}</strong> {t('privacy.dataCollected.ipDesc')}</li>
        </ul>

        <h2>{t('privacy.purpose.title')}</h2>
        <p>{t('privacy.purpose.content')}</p>

        <h2>{t('privacy.retention.title')}</h2>
        <p>{t('privacy.retention.content')}</p>

        <h2>{t('privacy.sharing.title')}</h2>
        <p>{t('privacy.sharing.content')}</p>

        <h2>{t('privacy.rights.title')}</h2>
        <p>{t('privacy.rights.content')}</p>

        <h2>{t('privacy.contact.title')}</h2>
        <p>{t('privacy.contact.content')}</p>
    </section>
    <Footer />
    </>
  );
};

export default Privacy;