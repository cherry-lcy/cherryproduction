import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const NotFound = () => {
  const navigate = useNavigate();
  const {t, language} = useLanguage();

  return (
    <>
    <section className="header-section w-100">
        <NavBar mode="dark"/>
        <section className="section-text">
            <div className="h2 pt-5 mb-3">{t('notFound.title')}</div>
        </section>
    </section>
    <section className="p-4 px-5 pb-5 search-page">
        <p>{t('notFound.content')}</p>
        <p>
            {t('notFound.return')[0].toUpperCase()+t('notFound.return').slice(1)}
            <span
            className='pointer nav link'
            onClick={()=>{
                navigate('/');
            }}
            >{t('notFound.home')}</span>
            {t('notFound.or')}
            {t('notFound.goBack')}
            <span
            className='pointer nav link'
            onClick={()=>{
                navigate(-1);
            }}
            >{t('notFound.previous')}</span>
        </p>
    </section>
    <Footer />
    </>
  );
};

export default NotFound;