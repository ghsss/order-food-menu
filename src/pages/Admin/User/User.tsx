import React, { useEffect, useState } from 'react';
// import Menu from './pages/Menu/';
import './User.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
// import AccessCodeServiceInstance from '../../../services/AccessCodeService';
import UserModel from '../../../models/User';
import AccessCodeServiceInstance from '../../../services/AccessCodeService';

interface UserPageProps {

  record?: UserModel;

}

function UserPage({ record }: UserPageProps) {

  const [recordRefresh, setRecordRefresh] = useState<UserModel | undefined>(record);

  useEffect(() => {

    // syncCurrentTime();

    setRecordRefresh(record || {
      phoneNumber: '',
      chatId: ``,
      name: '',
      isAdmin: true,
      isSuperAdmin: false,
      adminLevel: 0,
    });

    // setRecordRefresh(record);

  }, []);

  useEffect(() => {

    console.log('record: ', record);
    // if (record?.id !== recordRefresh?.id) {
    setRecordRefresh(record || {
      phoneNumber: '',
      chatId: ``,
      name: '',
      isAdmin: true,
      isSuperAdmin: false,
      adminLevel: 0,
    });
    // }

  }, [record]);

  useEffect(() => {

    console.log('recordRefresh: ', recordRefresh);

  }, [recordRefresh]);

  return (
    <div className='UserPage' style={{
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
      <h1>{typeof recordRefresh?._id !== 'undefined' ? `Atualizar administrador "${recordRefresh.phoneNumber}"` : `Criar administrador `} 👇🏻</h1>
      <div className='fieldContainer'>
        <label htmlFor="inputId">Número do WhatsApp</label>
        <input disabled={typeof recordRefresh?._id !== 'undefined'} className='inputId' type="text" placeholder='Número do WhatsApp'
          value={recordRefresh?.phoneNumber}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, phoneNumber: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputId">E-mail</label>
        <input className='inputId' type="email" placeholder='exemplo@gmail.com'
          value={recordRefresh?.email}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, email: e.target.value });
          }} />
      </div>
      <br />
      {
        recordRefresh?._id ?
          <div className='fieldContainer'>
            <label htmlFor="inputSuperAdmin">É super-administrador (Pode alterar dados da empresa e gerenciar outros administradores)</label>
            <input id='inputSuperAdmin' className='inputSuperAdmin' type="checkbox"
              defaultChecked={recordRefresh?.isSuperAdmin || false}
              checked={recordRefresh?.isSuperAdmin || false}
              onChange={e => {
                if (typeof recordRefresh === 'object')
                  setRecordRefresh({ ...recordRefresh, isSuperAdmin: e.target.checked });
              }} />
            <br />
          </div>
          :
          <></>
      }
      <button className='submitButton' type="submit" onClick={async e => {
        console.log('recordRefresh: ', recordRefresh);
        if (typeof recordRefresh?._id !== 'undefined') {
          const updated = recordRefresh.isSuperAdmin ? await AccessCodeServiceInstance.grantSuperAdmin(recordRefresh.phoneNumber) : await AccessCodeServiceInstance.revokeSuperAdmin(recordRefresh.phoneNumber);
          if (updated === true) {
            if (recordRefresh.email) {
              const update2 = await AccessCodeServiceInstance.updateEmail(recordRefresh.phoneNumber, recordRefresh.email);
              if (update2 === true) {
                window.alert('Registro salvo com sucesso!');
                // window.location.href = `/admin?action=list&collection=user#`;
              }
            }
            // setRecordRefresh({ ...recordRefresh, _id: upsertUserId });
          } else {
            window.alert('Erro ao salvar registro');
          }
          return;
        } else {
          if (typeof recordRefresh === 'object'
            && recordRefresh?.phoneNumber.length > 11) {
            const created = await AccessCodeServiceInstance.createAdmin(recordRefresh.phoneNumber, recordRefresh.email);
            if (created === true) {
              // setRecordRefresh({ ...recordRefresh, _id: upsertUserId });
              window.alert('Registro salvo com sucesso!');
              window.location.href = `/admin?action=list&collection=user#`;
            }
            else {
              window.alert('Erro ao salvar registro');
            }
          } else {
            window.alert('Verifique o campo celular.');
          }
        }
      }}>
        {'Salvar'}
      </button>
    </div>
  );

}

export default UserPage;
