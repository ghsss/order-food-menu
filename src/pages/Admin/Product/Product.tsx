import React, { useEffect, useState } from 'react';
// import Menu from './pages/Menu/';
import './Product.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCheck, faFilter, faList } from '@fortawesome/free-solid-svg-icons';
// import AccessCodeServiceInstance from '../../../services/AccessCodeService';
import ProductModel from '../../../models/Product';
import ProductServiceInstance from '../../../services/ProductService';
import ProductTypeModel from '../../../models/ProductType';

interface ProductPageProps {

  record?: ProductModel;
  productTypeSelectOptions: ProductTypeModel[];

}

function ProductPage({ record, productTypeSelectOptions }: ProductPageProps) {

  const [recordRefresh, setRecordRefresh] = useState<ProductModel | undefined>(record);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<string>(record?.productType.id || productTypeSelectOptions[0]?.id || '');
  // const [productTypeSelectOptions, setProductTypeSelectOptions] = useState<ProductTypeModel[]>([]);

  useEffect(() => {

    // syncCurrentTime();

    setRecordRefresh(record || {
      id: '',
      name: '',
      description: '',
      price: 2,
      stock: 0,
      productType: productTypeSelectOptions[0] || {
        id: '',
        name: '',
      }
    });

    // setRecordRefresh(record);

  }, []);

  useEffect(() => {

    console.log('record: ', record);
    // if (record?.id !== recordRefresh?.id) {
    setRecordRefresh(record || {
      id: '',
      name: '',
      description: '',
      price: 2,
      stock: 0,
      productType: productTypeSelectOptions[0] || {
        id: '',
        name: '',
      }
    });

    if (typeof record?.productType?.id !== `undefined` && record?.productType?.id?.length > 0) {

      setSelectedProductTypeId(record?.productType?.id);

    }

  }, [record, productTypeSelectOptions]);

  useEffect(() => {

    console.log('recordRefresh: ', recordRefresh);

  }, [recordRefresh]);

  useEffect(() => {

    console.log('selectedProductTypeId: ', selectedProductTypeId);
    const selectedProductType = productTypeSelectOptions.find(item => item.id === selectedProductTypeId);
    if (typeof recordRefresh === 'object' && typeof selectedProductType === 'object') {

      recordRefresh.productType = selectedProductType;

      setRecordRefresh({
        ...recordRefresh, productType: {
          id: selectedProductType.id,
          name: selectedProductType.name,
        }
      });

    }

  }, [selectedProductTypeId]);

  const handleProductTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const selectedProductTypeIdRefresh = e.target.value;

    if (selectedProductTypeIdRefresh !== selectedProductTypeId) {

      setSelectedProductTypeId(selectedProductTypeIdRefresh);

    }

  }

  return (
    <div className='ProductPage' style={{
      backgroundColor: 'orange',
      // position: `absolute`, 
      height: `100%`,
      display: `flex`,
      justifyContent: `center`,
      alignItems: `center`,
      flexDirection: `column`,
      color: `#000`
    }}>
      <button className='goBackButton' style={{ justifySelf: `flex-start`, alignSelf: `flex-start`, marginLeft: `1em`, marginBottom: '1em', marginTop: '1em' }}
        onClick={e => window.history.back()}>
        <FontAwesomeIcon icon={faArrowCircleLeft} /> {` Voltar`}
      </button>
      <h1>{typeof recordRefresh?._id !== 'undefined' ? `Atualizar produto "${recordRefresh.name}"` : `Criar produto `} 👇🏻</h1>
      <div className='fieldContainer'>
        <label htmlFor="inputId">Código do produto</label>
        <input className='inputId' type="text" placeholder='Código do produto'
          value={recordRefresh?.id}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, id: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputName">Rótulo do produto</label>
        <input className='inputName' type="text" placeholder='Rótulo do produto'
          value={recordRefresh?.name}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, name: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputPrice">Preço do produto</label>
        <input className='inputPrice' type="number" step={'.01'} placeholder='Preço do produto'
          value={recordRefresh?.price || 0}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, price: parseFloat(parseFloat(e.target.value).toFixed(2)) });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputStock">Quantidade em estoque</label>
        <input className='inputStock' type="number" step={'1'} placeholder='199'
          value={recordRefresh?.stock || 0}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, stock: parseFloat(parseFloat(e.target.value).toFixed(2)) });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputDescription">Descrição do produto</label>
        <input id='inputDescription' className='inputDescription' type="text" placeholder='Descrição do produto'
          value={recordRefresh?.description}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, description: e.target.value });
          }} />

      </div>
      <br />
      <div className='fieldContainer'>

        <label htmlFor="inputImageURL">URL da imagem do produto</label>
        {
          recordRefresh?.image_url ?
            <img draggable={false} className='itemImage' src={recordRefresh?.image_url || './no-image.png'} alt={'Imagem do produto'} about={'Imagem do produto '} />
            :
            <h4 style={{ color: `red` }}>Pré-visualização da imagem indisponível.</h4>
        }
        <input id='inputImageURL' className='inputImageURL' type="text" placeholder='URL da imagem do produto'
          value={recordRefresh?.image_url}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, image_url: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <div className='filterByProductTypeContainer'>
          <label style={{ color: `#000` }} htmlFor="filterByProductType">{`Tipo de produto `}
            <FontAwesomeIcon icon={faList} />
          </label>
          <select className='filterByProductType' name="filterByProductType" id="filterByProductType"
            onChange={e => handleProductTypeSelect(e)}
            value={selectedProductTypeId}
          >
            {productTypeSelectOptions.map((productTypeSelectOption, productTypeSelectOptionIdx) => {
              if (productTypeSelectOptionIdx === 0) {

                return (
                  <option defaultChecked={typeof record?.productType.id !== `undefined` &&
                    record?.productType.id !== productTypeSelectOption.id ?
                    false : true} key={productTypeSelectOption.id} value={productTypeSelectOption.id}>{productTypeSelectOption.name}</option>
                );

              } else {

                return (
                  <option defaultChecked={typeof record?.productType.id !== `undefined` &&
                    record?.productType.id !== productTypeSelectOption.id ?
                    false : true} key={productTypeSelectOption.id} value={productTypeSelectOption.id}>{productTypeSelectOption.name}</option>
                );

              }
            })}
          </select>
        </div>
      </div>
      <br />
      <button className='submitButton' type="submit" onClick={async e => {
        console.log('recordRefresh: ', recordRefresh);
        if (typeof recordRefresh === 'object' && recordRefresh?.id.length > 1 && recordRefresh?.name.length > 1) {
          const upsertProductId = await ProductServiceInstance.upsertProduct(recordRefresh);
          if (upsertProductId && upsertProductId?.length > 9) {
            setRecordRefresh({ ...recordRefresh, _id: upsertProductId });
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

export default ProductPage;
