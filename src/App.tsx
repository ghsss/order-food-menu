import React, { useEffect, useState } from 'react';
// import Menu from './pages/Menu/';
import './App.css';
import ProductMenu from './pages/ProductMenu/ProductMenu';

function App() {

  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams(window.location.search));
  const [action, setAction] = useState<string>('order-bot');

  useEffect(() => {

  }, []);

  useEffect(() => {

    console.log('searchParams: ', searchParams?.keys());
    setAction(searchParams?.get('action') || 'order-bot');
    console.log('action: ', action);

  }, [searchParams, action]);

  return (
    <div className="App">
      {
        action === 'order-bot' ?
          <ProductMenu />
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
