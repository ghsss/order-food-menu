import React, { useEffect, useState } from 'react';
// import Menu from './pages/Menu/';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowLeft, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import AccessCodeServiceInstance from '../../../../services/AccessCodeService';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import RobotModel from '../../../../models/Robot';
// import ProductMenu from './pages/ProductMenu/ProductMenu';
// import AdminMenu from './pages/Admin/AdminMenu';

const requestNewAccesCodeLimit = 3;
const wrongAccessCodeLimit = 5;
const accesCodeTimeoutInMs = 1000 * 60 * 5;
const requestNewAccesCodeMinIntervalInMs = 1000 * 60;
// const accesCodeTimeoutInMs = 1000 * 10;
// const requestNewAccesCodeMinIntervalInMs = 1000 * 3;

interface LoginProps {
  robot: RobotModel;
  showCartPage: boolean;
  showOrdersPage: boolean;
  setShowCartPage: (show: boolean) => void;
  setShowOrdersPage: (show: boolean) => void;
}

function Login({ robot, showCartPage, showOrdersPage, setShowCartPage, setShowOrdersPage }: LoginProps) {

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
          window.location.href = '/';

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
          onClick={async e => {

            if (AccessCodeServiceInstance.getStoredAccessCode()) {

              // window.history.back()

              if (showCartPage) {
                setShowCartPage(false);
              } else {
                setShowOrdersPage(false);
              }

            } else {

              if (showCartPage) {
                setShowCartPage(false);
              } else {
                setShowOrdersPage(false);
              }

            }
            window.location.href = '/';
          }}
        >
          <FontAwesomeIcon icon={faArrowCircleLeft} /> {` Voltar`}
        </button>
        <h1><span style={{ color: '#000' }}>{`Solicite seu acesso via WhatsApp `}<FontAwesomeIcon icon={faWhatsapp} color='green' style={{ fontSize: '1.5em' }} /></span></h1>
        <br />
        <button className='submitButton' type="submit"
          // style={{background: "orange"}}
          onClick={async e => {
            const requestAccessCodeTxt = `Envie a mensagem como está para receber seu acesso.                                          —————————————————          ** CODIGO-DE-ACESSO **`;

            window.location.href = `https://wa.me/${robot.phone}?text=${requestAccessCodeTxt}`;
            // if (receiveThrough === 'whatsapp') {
            //   if (phone.length > 11) {
            //     const requestedSuccessfully = await AccessCodeServiceInstance.requestAccessCode(phone);
            //     if (requestedSuccessfully) {
            //       setLastAccessCodeRequestTimestamp(new Date().getTime());
            //       setCanRequestNewAccesCode(false);

            //     }
            //   } else {
            //     window.alert(`Número inválido.`);
            //   }
            // } else {
            //   const requestedSuccessfully = await AccessCodeServiceInstance.requestAccessCode(email);
            //   if (requestedSuccessfully) {
            //     setLastAccessCodeRequestTimestamp(new Date().getTime());
            //     setCanRequestNewAccesCode(false);

            //   }
            // }
          }}>
          {'Acessar via WhatsApp '} <FontAwesomeIcon icon={faArrowRight} color='#000' scale={2} />
        </button>
        {/* <button style={{ transform: 'scale(0.5)' }} className='submitButton' type="submit" onClick={async e => {
          e.stopPropagation();
          setReceiveThrough(receiveThrough === 'whatsapp' ? 'email' : 'whatsapp');
          setPhone('');
          setEmail('');
        }}>
          {receiveThrough === 'whatsapp' ? 'Receber código por e-mail' : 'Receber código por WhatsApp'}
        </button> */}
      </div >
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
        <h1>Cole o código de acesso recebido via WhatsApp 👇🏻</h1>
        <div className="fieldContainer">
          <label style={{ border: 'none' }}>{`Tempo limite para informar o código de acesso `}
            <span style={{ color: `red` }}>
              {`(${((accesCodeTimeoutInMs / 1000) - (now - lastAccessCodeRequestTimestamp) / 1000).toFixed(0).replace(`-`, ``)})`}
            </span>
          </label>
          <input className='inputAccessCode' type="text" placeholder='Cole o código de acesso recebido'
            value={accessCode}
            onChange={e => setAccessCode(e.target.value)}
          />
        </div>
        <button className='submitButton' disabled={!canRequestNewAccesCode} type="submit"
          onClick={async e => {
            if (receiveThrough === 'whatsapp') {

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
            } else {

              setRequestedAccessCodeCount(requestedAccessCodeCount + 1);
              setLastAccessCodeRequestTimestamp(new Date().getTime());
              const requestedSuccessfully = await AccessCodeServiceInstance.requestAccessCode(phone.length > 11 ? phone : email);
              if (requestedSuccessfully) {
                setLastAccessCodeRequestTimestamp(new Date().getTime());
                setCanRequestNewAccesCode(false);

              }

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
        <input style={{ color: `green` }} className='submitButton' type="submit" value={'Confirmar código'}
          onClick={async (e) => {

            const accessCodeIsValid = await AccessCodeServiceInstance.customerAccessCodeIsValid(accessCode);

            if (accessCodeIsValid) {

              // window.location.href = `/`;

              if (showCartPage) {

                window.location.href = `/?action=cart`;
                // setShowOrdersPage(true);
                // setShowCartPage(true);
                // setShowOrdersPage(false);

              } else {

                window.location.href = `/?action=orders`;
                // setShowCartPage(true);
                // setShowOrdersPage(true);
                // setShowCartPage(false);

              }

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

export default Login;
