import React, { useEffect, useState } from 'react';
// import Menu from './pages/Menu/';
import './AccessCode.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import AccessCodeServiceInstance from '../../../services/AccessCodeService';
// import ProductMenu from './pages/ProductMenu/ProductMenu';
// import AdminMenu from './pages/Admin/AdminMenu';

const requestNewAccesCodeLimit = 3;
const wrongAccessCodeLimit = 5;
const accesCodeTimeoutInMs = 1000 * 60 * 5;
const requestNewAccesCodeMinIntervalInMs = 1000 * 60;
// const accesCodeTimeoutInMs = 1000 * 10;
// const requestNewAccesCodeMinIntervalInMs = 1000 * 3;

function AccessCodePage() {

  const [lastAccessCodeRequestTimestamp, setLastAccessCodeRequestTimestamp] = useState<number>();
  const [requestedAccessCodeCount, setRequestedAccessCodeCount] = useState<number>(0);
  const [wrongAccessCodeCount, setWrongAccessCodeCount] = useState<number>(0);
  const [canRequestNewAccesCode, setCanRequestNewAccesCode] = useState<boolean>(true);
  // const [accessCodeExpired, setAccessCodeExpired] = useState<boolean>(false);
  const [now, setNow] = useState<number>(new Date().getTime());
  const [phone, setPhone] = useState<string>(``);
  const [email, setEmail] = useState<string>(``);
  const [accessCode, setAccessCode] = useState<string>(``);
  const [syncIntervalId, setSyncIntervalId] = useState<NodeJS.Timer>();
  const [receiveThrough, setReceiveThrough] = useState<string>('whatsapp');

  const syncCurrentTime = async () => {

    clearInterval(syncIntervalId);

    const timerId = setTimeout(() => {

      setNow(new Date().getTime());

      console.log(`lastAccessCodeRequestTimestamp? `, lastAccessCodeRequestTimestamp);

      if (typeof lastAccessCodeRequestTimestamp !== `undefined`) {

        const secondsFromLastRequest = ((now - lastAccessCodeRequestTimestamp) / 1000);
        console.log(`secondsFromLastRequest: `, secondsFromLastRequest);

        if (secondsFromLastRequest >= (requestNewAccesCodeMinIntervalInMs / 1000)) {

          setCanRequestNewAccesCode(true);

        }

        if (requestedAccessCodeCount >= requestNewAccesCodeLimit) {

          clearInterval(syncIntervalId);
          window.alert(`Você atingiu o número máximo de solicitações de código de acesso (${requestNewAccesCodeLimit}).`);
          window.location.href = '/';

        }

        if (now - lastAccessCodeRequestTimestamp >= accesCodeTimeoutInMs) {

          clearInterval(syncIntervalId);
          window.alert(`O tempo máximo para confirmação do código de acesso expirou.`);
          // clearInterval(syncIntervalId);
          // setCanRequestNewAccesCode(true);
          window.location.href = '/admin/access-code?action=requestAccessCode';

        }

      }
    }, 1000);

    setSyncIntervalId(timerId);

    return;
    // setSyncIntervalId(intervalIdRef);

  }

  useEffect(() => {

    // syncCurrentTime();

  }, []);

  useEffect(() => {

    // console.log(`now: `, now);
    // console.log(`lastAccessCodeRequestTimestamp: `, lastAccessCodeRequestTimestamp);
    // console.log(`canRequestNewAccesCode: `, canRequestNewAccesCode);
    // console.log(`requestedAccessCodeCount: `, requestedAccessCodeCount);
    syncCurrentTime();

  }, [now, lastAccessCodeRequestTimestamp, canRequestNewAccesCode, requestedAccessCodeCount]);

  useEffect(() => {

    console.log('accessCode: ', accessCode);

  }, [accessCode, phone]);


  // if (canRequestNewAccesCode) {

  if (typeof lastAccessCodeRequestTimestamp === 'undefined') {

    return (
      <div className='AcccessCodeContainer' style={{
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
        <h1>Solicite seu código de acesso a área de administradores 👇🏻</h1>
        <input className='inputAccessCode'
          type={receiveThrough === 'whatsapp' ? "number" : "email"}
          placeholder={receiveThrough === 'whatsapp' ? '555499991111' : 'exemplo@gmail.com'}
          value={receiveThrough === 'whatsapp' ? phone : email}
          onChange={e => {
            if (receiveThrough === 'whatsapp') {
              setPhone(e.target.value);
            } else {
              setEmail(e.target.value);
            }
          }} />
        <br />
        <button className='submitButton' type="submit" onClick={async e => {
          if (receiveThrough === 'whatsapp') {
            if (phone.length > 11) {
              const requestedSuccessfully = await AccessCodeServiceInstance.requestAccessCode(phone);
              if (requestedSuccessfully) {
                setLastAccessCodeRequestTimestamp(new Date().getTime());
                setCanRequestNewAccesCode(false);

              }
            } else {
              window.alert(`Número inválido.`);
            }
          } else {
            const requestedSuccessfully = await AccessCodeServiceInstance.requestAccessCode(email);
            if (requestedSuccessfully) {
              setLastAccessCodeRequestTimestamp(new Date().getTime());
              setCanRequestNewAccesCode(false);

            }
          }
        }}>
          {'Solicitar código de acesso'}
        </button>
        <button style={{ transform: 'scale(0.5)' }} className='submitButton' type="submit" onClick={async e => {
          e.stopPropagation();
          setReceiveThrough(receiveThrough === 'whatsapp' ? 'email' : 'whatsapp');
          setPhone('');
          setEmail('');
        }}>
          {receiveThrough === 'whatsapp' ? 'Receber código por e-mail' : 'Receber código por WhatsApp'}
        </button>
      </div>
    );

  } else {

    return (
      <div className='AcccessCodeContainer' style={{
        position: `absolute`, height: `100%`, display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        flexDirection: `column`,
        color: `#000`
      }}>
        <h1>Digite o código de acesso recebido via WhatsApp 👇🏻</h1>
        <div className="fieldContainer">
          <label style={{ border: 'none' }}>{`Tempo limite para informar o código de acesso `}
            <span style={{ color: `red` }}>
              {`(${((accesCodeTimeoutInMs / 1000) - (now - lastAccessCodeRequestTimestamp) / 1000).toFixed(0).replace(`-`, ``)})`}
            </span>
          </label>
          <input className='inputAccessCode' type="text" placeholder='Digite o código de acesso recebido'
            value={accessCode}
            onChange={e => setAccessCode(e.target.value)}
          />
        </div>
        <button className='submitButton' disabled={!canRequestNewAccesCode} type="submit"
          onClick={async e => {
            if (phone.length > 11) {
              setRequestedAccessCodeCount(requestedAccessCodeCount + 1);
              setLastAccessCodeRequestTimestamp(new Date().getTime());
              const requestedSuccessfully = await AccessCodeServiceInstance.requestAccessCode(phone);
              if (requestedSuccessfully) {
                setLastAccessCodeRequestTimestamp(new Date().getTime());
                setCanRequestNewAccesCode(false);

              }
            } else {
              window.alert(`Número inválido.`);
            }
          }}
        >
          {`Reenviar código de acesso `}
          {
            !canRequestNewAccesCode ?
              `(${((requestNewAccesCodeMinIntervalInMs / 1000) - (now - lastAccessCodeRequestTimestamp) / 1000).toFixed(0).replace(`-`, ``)})`
              :
              <FontAwesomeIcon color='green' icon={faCheck} />
          }
        </button>
        <input style={{ color: `green` }} className='submitButton' type="submit" value={'Confirmar código de acesso'}
          onClick={async (e) => {

            const accessCodeIsValid = await AccessCodeServiceInstance.accessCodeIsValid(accessCode);

            if (accessCodeIsValid) {

              window.location.href = `/admin?action=menu`;

            } else {

              if (wrongAccessCodeCount >= wrongAccessCodeLimit) {

                window.location.href = `/`;

              }

              setWrongAccessCodeCount(wrongAccessCodeCount + 1);

            }

          }}
        />
      </div >
    );

  }

  // }

}

export default AccessCodePage;
