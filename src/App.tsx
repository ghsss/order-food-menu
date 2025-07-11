/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
// import Menu from './pages/Menu/';
import './App.css';
import ProductMenu from './pages/ProductMenu/ProductMenu';
import AdminMenu from './pages/Admin/AdminMenu';
import AccessCodePage from './pages/Admin/AccessCode/AccessCode';
import AccessCodeServiceInstance from './services/AccessCodeService';

function App() {

  const [urlPath, setUrlPath] = useState<string>(``);
  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams(window.location.search));
  const [action, setAction] = useState<string>('');
  const [orderChannel, setOrderChannel] = useState<string>('');
  const [id, setId] = useState<string>(searchParams?.get('id') || '');
  const [collection, setCollection] = useState<string>(searchParams?.get('collection') || '');
  const [filter, setFilter] = useState<string>(searchParams?.get('filter') || '');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | undefined>(undefined);
  const [accessCodeSHA512Hash, setAccessCodeSHA512Hash] = useState<string | null>(null);

  const verifyAccess = async () => {
    if (urlPath.indexOf('/admin') === 0 && urlPath.indexOf('/admin/access') === -1) {
      const accessCode = AccessCodeServiceInstance.getStoredAccessCode();
      if (accessCode) {
        const accessCodeIsValid = await AccessCodeServiceInstance.accessCodeIsValid(accessCode);
        console.log(`accessCodeIsValid: `, accessCodeIsValid);
        if (!accessCodeIsValid) {
          window.location.href = `/admin/access-code?action=requestAccessCode`;
          return;
        }
        const isSuperAdminRefresh = await AccessCodeServiceInstance.isSuperAdmin();
        setIsSuperAdmin(isSuperAdminRefresh);
        setAccessCodeSHA512Hash(accessCode);
        setIsAdmin(accessCodeIsValid);
      } else {
        window.location.href = `/admin/access-code?action=requestAccessCode`;
      }
    }
  }

  useEffect(() => {

    // verifyAccess();

  }, []);

  useEffect(() => {

    if (urlPath !== window.location.pathname) {
      setUrlPath(window.location.pathname);
    }
    verifyAccess()
      .then(() => {
        console.log('searchParams: ', searchParams?.keys());
        setAction(searchParams?.get('action') || 'order-bot');
        setOrderChannel(searchParams?.get('orderChannel') || 'WhatsApp');
        setId(searchParams?.get('id') || '');
        setCollection(searchParams?.get('collection') || '');
        setFilter(searchParams?.get('filter') || '');
      });
    console.log('urlPath: ', urlPath);

  }, [searchParams, urlPath]);

  useEffect(() => {

    console.log('orderChannel: ', orderChannel);
    console.log('action: ', action);
    console.log('collection: ', collection);
    console.log('id: ', id);

    if (action === 'order-bot') {
      // if (!window.location.href.includes('#listScroll')) {
      //   window.location.href = '/?#listScroll';
      // }
      // document.getElementById('listScroll')?.focus({ preventScroll: true });
    }
    if (collection === 'user' && typeof isSuperAdmin !== 'undefined' && isSuperAdmin === false) {
      window.location.href = '/admin?action=menu';
    }

  }, [action, orderChannel, collection, id]);

  return (
    <div className="App">
      {
        action === 'order-bot' || action === 'orders' || action === 'cart' ?
          <ProductMenu prefilledOrderChannel={orderChannel} action={action} />
          :
          urlPath.indexOf('/admin') === 0 ?
            // action === `menu` ?
            urlPath.indexOf(`/admin/access-code`) === 0 ?
              <AccessCodePage />
              :
              isAdmin && accessCodeSHA512Hash ?
                <AdminMenu isSuperAdmin={isSuperAdmin || false} accessCodeSHA512Hash={accessCodeSHA512Hash} action={action} collection={collection} filter={filter} id={id} />
                :
                <div className='page404'>
                  <p>
                    Página não encontrada.
                  </p>
                </div>
            :
            <div className='page404'>
              <p>
                Página não encontrada.
              </p>
            </div>
      }
    </div>
  );
}

export default App;
