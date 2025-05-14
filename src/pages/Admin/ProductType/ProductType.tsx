import React, { useEffect, useState } from 'react';
// import Menu from './pages/Menu/';
import './ProductType.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
// import AccessCodeServiceInstance from '../../../services/AccessCodeService';
import ProductTypeModel from '../../../models/ProductType';
import ProductTypeServiceInstance from '../../../services/ProductTypeService';

interface ProductTypePageProps {

  record?: ProductTypeModel;

}

function ProductTypePage({ record }: ProductTypePageProps) {

  const [recordRefresh, setRecordRefresh] = useState<ProductTypeModel | undefined>(record);

  useEffect(() => {

    // syncCurrentTime();

    setRecordRefresh(record || {
      id: '',
      name: ''
    });

    // setRecordRefresh(record);

  }, []);

  useEffect(() => {

    console.log('record: ', record);
    // if (record?.id !== recordRefresh?.id) {
    setRecordRefresh(record || {
      id: '',
      name: ''
    });
    // }

  }, [record]);

  useEffect(() => {

    console.log('recordRefresh: ', recordRefresh);

  }, [recordRefresh]);

  return (
    <div className='ProductTypePage' style={{
      backgroundColor: 'orange',
      position: `absolute`, height: `100%`, display: `flex`,
      justifyContent: `center`,
      alignItems: `center`,
      flexDirection: `column`,
      color: `#000`
    }}>
      <button className='goBackButton' style={{ justifySelf: `flex-start`, alignSelf: `flex-start`, marginLeft: `1em`, marginBottom: '1em', marginTop: '1em' }}
        onClick={e => window.history.back()}>
        <FontAwesomeIcon icon={faArrowCircleLeft} /> {` Voltar`}
      </button>
      <h1>{typeof recordRefresh?._id !== 'undefined' ? `Atualizar tipo de produto "${recordRefresh.name}"` : `Criar tipo de produto `} 👇🏻</h1>
      <div className='fieldContainer'>
        <label htmlFor="inputId">Código do tipo de produto</label>
        <input className='inputId' type="text" placeholder='Código do tipo de produto'
          value={recordRefresh?.id}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, id: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputName">Rótulo do tipo de produto</label>
        <input className='inputName' type="text" placeholder='Rótulo do tipo de produto'
          value={recordRefresh?.name}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, name: e.target.value });
          }} />
      </div>
      <br />
      <button className='submitButton' type="submit" onClick={async e => {
        console.log('recordRefresh: ', recordRefresh);
        if (typeof recordRefresh === 'object' && recordRefresh?.id.length > 1 && recordRefresh?.name.length > 1) {
          const upsertProductTypeId = await ProductTypeServiceInstance.upsertProductType(recordRefresh);
          if (upsertProductTypeId && upsertProductTypeId?.length > 9) {
            setRecordRefresh({ ...recordRefresh, _id: upsertProductTypeId });
            window.alert('Registro salvo com sucesso!');
          }
        } else {
          window.alert('Erro ao salvar registro');
        }
      }}>
        {'Salvar'}
      </button>
    </div>
  );

}

export default ProductTypePage;
