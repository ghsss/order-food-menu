import React, { useEffect, useState } from 'react';
// import Menu from './pages/Menu/';
import './AdditionalProduct.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCheck, faFilter, faList } from '@fortawesome/free-solid-svg-icons';
// import AccessCodeServiceInstance from '../../../services/AccessCodeService';
import AdditionalProductModel from '../../../models/AdditionalProduct';
import AdditionalProductServiceInstance from '../../../services/AdditionalProductService';
import ProductTypeModel from '../../../models/ProductType';

interface AdditionalProductPageProps {

  record?: AdditionalProductModel;
  productTypeSelectOptions: ProductTypeModel[];

}

function AdditionalProductPage({ record, productTypeSelectOptions }: AdditionalProductPageProps) {

  const [recordRefresh, setRecordRefresh] = useState<AdditionalProductModel | undefined>(record);
  // const [selectedProductTypeId, setSelectedProductTypeId] = useState<string>(record?.availableProductType.id || productTypeSelectOptions[0]?.id || '');
  const [selectedProductTypeIds, setSelectedProductTypeIds] = useState<string[]>(record?.availableProductType.map(it => { return it.id }) || [productTypeSelectOptions[0]?.id] || []);
  // const [productTypeSelectOptions, setproductTypeSelectOptions] = useState<ProductTypeModel[]>([]);

  useEffect(() => {

    // syncCurrentTime();

    setRecordRefresh(record || {
      id: '',
      name: '',
      description: '.',
      price: 2,
      stock: 0,
      availableProductType: typeof productTypeSelectOptions[0] === 'object' ?
        [{ id: productTypeSelectOptions[0].id, name: productTypeSelectOptions[0].name }]
        : [{
          id: '',
          name: '',
        }]
    });

    // setRecordRefresh(record);

  }, []);

  useEffect(() => {

    console.log('record: ', record);
    // if (record?.id !== recordRefresh?.id) {
    setRecordRefresh(record || {
      id: '',
      name: '',
      description: '.',
      price: 2,
      stock: 0,
      availableProductType: typeof productTypeSelectOptions[0] === 'object' ?
        [{ id: productTypeSelectOptions[0].id, name: productTypeSelectOptions[0].name }]
        :
        [{
          id: '',
          name: '',
        }]
    });

    if (typeof record === `object` && Array.isArray(record?.availableProductType) && record?.availableProductType.length > 0) {

      setSelectedProductTypeIds(record.availableProductType.map(it => { return it.id }));

    }

  }, [record, productTypeSelectOptions]);

  useEffect(() => {

    console.log('recordRefresh: ', recordRefresh);

  }, [recordRefresh]);

  useEffect(() => {

    console.log('selectedProductTypeIds: ', selectedProductTypeIds);

    const selectedProductTypes = productTypeSelectOptions.filter(item => selectedProductTypeIds.includes(item.id));

    if (typeof recordRefresh === 'object' && Array.isArray(selectedProductTypes)) {

      recordRefresh.availableProductType = selectedProductTypes;

      // console.log();

      setRecordRefresh({
        ...recordRefresh, availableProductType: [...recordRefresh.availableProductType]
      });

    }

  }, [selectedProductTypeIds]);

  const handleProductTypeSelect = (e: React.MouseEvent<HTMLOptionElement, MouseEvent> | React.ChangeEvent<HTMLSelectElement>) => {

    e.stopPropagation();
    e.preventDefault();

    // const currentTarget = e.target;

    // console.log('currentTarget? ', currentTarget);

    const currentTarget = e.currentTarget;

    const selectedOptions = currentTarget instanceof HTMLSelectElement ? currentTarget.selectedOptions : [];

    console.log('selectedOptions? ', selectedOptions);

    const selectedProductTypeIdRefresh = currentTarget instanceof HTMLOptionElement ?
      currentTarget.value : selectedOptions;

    console.log('Clicked product type value: ', selectedProductTypeIdRefresh);

    if (currentTarget instanceof HTMLOptionElement && typeof selectedProductTypeIdRefresh === 'string') {

      // if (selectedProductTypeIdRefresh !== selectedProductTypeId) {
      if (selectedProductTypeIds.includes(selectedProductTypeIdRefresh)) {

        const idxToDelete = selectedProductTypeIds.indexOf(selectedProductTypeIdRefresh);

        console.log('Removing Clicked product type value: ', idxToDelete);

        if (idxToDelete > -1) {

          selectedProductTypeIds.splice(idxToDelete, 1);
          setSelectedProductTypeIds(JSON.parse(JSON.stringify(selectedProductTypeIds)));

        }

      } else {

        console.log('Adding Clicked product type value: ', selectedProductTypeIdRefresh);
        // if (currentTarget instanceof HTMLSelectElement && Array.isArray(selectedProductTypeIdRefresh)) {
        //   selectedProductTypeIds.push(...selectedProductTypeIdRefresh);
        // } else {
        selectedProductTypeIds.push(selectedProductTypeIdRefresh);
        // }
        // setSelectedProductTypeIds(selectedProductTypeIds);
        setSelectedProductTypeIds(JSON.parse(JSON.stringify(selectedProductTypeIds)));


      }

    } else {

      const newSelectedProductTypeIds = [];

      for (let index = 0; index < selectedOptions.length; index++) {

        const selectedOption = selectedOptions[index];
        newSelectedProductTypeIds.push(selectedOption.value);
        console.log('Updating New Refs of Clicked product type values: ', selectedOption);

      }

      setSelectedProductTypeIds(JSON.parse(JSON.stringify(newSelectedProductTypeIds)));

    }

  }

  return (
    <div className='AdditionalProductPage' style={{
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
      <h1>{typeof recordRefresh?._id !== 'undefined' ? `Atualizar adicional "${recordRefresh.name}"` : `Criar adicional `} 👇🏻</h1>
      <div className='fieldContainer'>
        <label htmlFor="inputId">Código do adicional</label>
        <input className='inputId' type="text" placeholder='Código do produto'
          value={recordRefresh?.id}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, id: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputName">Rótulo do adicional</label>
        <input className='inputName' type="text" placeholder='Rótulo do produto'
          value={recordRefresh?.name}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, name: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputPrice">Preço unitário</label>
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
      {/* <div className='fieldContainer'>
        <label htmlFor="inputDescription">Descrição do produto</label>
        <input id='inputDescription' className='inputDescription' type="text" placeholder='Descrição do produto'
          value={recordRefresh?.description}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, description: e.target.value });
          }} />

      </div> */}
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
            value={selectedProductTypeIds}
            onChange={e => handleProductTypeSelect(e)}
            multiple={true}
          >
            {productTypeSelectOptions.map((ProductTypeSelectOption, ProductTypeSelectOptionIdx) => {
              if (ProductTypeSelectOptionIdx === 0) {

                return (
                  <option style={{ zIndex: '100' }}
                    // onClick={e => handleProductTypeSelect(e)}
                    aria-checked={Array.isArray(record?.availableProductType) &&
                      record?.availableProductType.some(it => it.id === ProductTypeSelectOption.id) ?
                      true : false} key={ProductTypeSelectOption.id} value={ProductTypeSelectOption.id}>{ProductTypeSelectOption.name}</option>
                );

              } else {

                return (
                  <option style={{ zIndex: '100' }}
                    // onClick={e => handleProductTypeSelect(e)}
                    aria-checked={Array.isArray(record?.availableProductType) &&
                      record?.availableProductType.some(it => it.id === ProductTypeSelectOption.id) ?
                      true : false} key={ProductTypeSelectOption.id} value={ProductTypeSelectOption.id}>{ProductTypeSelectOption.name}</option>
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
          const upsertAdditionalProductId = await AdditionalProductServiceInstance.upsertAdditionalProduct(recordRefresh);
          if (upsertAdditionalProductId && upsertAdditionalProductId?.length > 9) {
            setRecordRefresh({ ...recordRefresh, _id: upsertAdditionalProductId });
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

export default AdditionalProductPage;
