import React, { useEffect, useState } from 'react';
// import Menu from './pages/Menu/';
import './Company.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
// import AccessCodeServiceInstance from '../../../services/AccessCodeService';
import CompanyModel, { WorkingDay } from '../../../models/Company';
import CompanyServiceInstance from '../../../services/CompanyService';
// import AccessCodeServiceInstance from '../../../services/AccessCodeService';

// interface CompanyPageProps {

//   record?: CompanyModel;

// }

function CompanyPage(
  // { record }: CompanyPageProps
) {

  const [availableDaysOfWork, setAvailableDaysOfWork] = useState<WorkingDay[]>([
    {
      alwaysOpen: false,
      day: 0,
      dayLabel: `Domingo`,
      startHour: `18:30`,
      endHour: `23:30`,
    },
    {
      alwaysOpen: false,
      day: 1,
      dayLabel: `Segunda-feira`,
      startHour: `18:30`,
      endHour: `23:30`,
    },
    {
      alwaysOpen: false,
      day: 2,
      dayLabel: `Terça-feira`,
      startHour: `18:30`,
      endHour: `23:30`,
    },
    {
      alwaysOpen: false,
      day: 3,
      dayLabel: `Quarta-feira`,
      startHour: `18:30`,
      endHour: `23:30`,
    },
    {
      alwaysOpen: false,
      day: 4,
      dayLabel: `Quinta-feira`,
      startHour: `18:30`,
      endHour: `23:30`,
    },
    {
      alwaysOpen: false,
      day: 5,
      dayLabel: `Sexta-feira`,
      startHour: `18:30`,
      endHour: `23:30`,
    },
    {
      alwaysOpen: false,
      day: 6,
      dayLabel: `Sábado`,
      startHour: `18:30`,
      endHour: `23:30`,
    },
  ]);
  const [recordRefresh, setRecordRefresh] = useState<CompanyModel | undefined>();

  useEffect(() => {

    const getCompany = async () => {

      const company = await CompanyServiceInstance.getCompany();
      setRecordRefresh(company);

    }

    getCompany();

  }, []);

  // useEffect(() => {

  //   console.log('record: ', record);
  //   // if (record?.id !== recordRefresh?.id) {
  //   setRecordRefresh(record);
  //   // }

  // }, [record]);

  function displayCNPJ(cnpj: string) {
    return cnpj.substring(0, 2) + '.' + cnpj.substring(2, 5) + '.' + + cnpj.substring(5, 8) + '/' + cnpj.substring(8, 12) + '-' + cnpj.substring(12, 14);
  }

  useEffect(() => {

    console.log('recordRefresh: ', recordRefresh);

  }, [recordRefresh, recordRefresh?.timezone]);

  return (
    <div className='CompanyPage' style={{
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
      <h1>{`Atualizar dados da empresa "${recordRefresh?.name}"`} 👇🏻</h1>
      <div className='fieldContainer'>
        <label htmlFor="inputName">Nome</label>
        <input className='inputName' type="text" placeholder='Nome'
          value={recordRefresh?.name}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, name: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputCNPJ">CNPJ</label>
        <input data-mask="00.000.000/0000-00" pattern="[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{4}-[0-9]{2}" disabled={typeof recordRefresh?._id !== 'undefined'} className='inputCNPJ' type="text" placeholder='CNPJ'
          value={displayCNPJ(recordRefresh?.cnpj || '')}
          // value={recordRefresh?.cnpj}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, cnpj: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputEmail">E-mail</label>
        <input className='inputEmail' type="email" placeholder='example@gmail.com'
          value={recordRefresh?.email}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, cnpj: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputId">Número do WhatsApp (O robô enviará os pedidos para o número informado)</label>
        <input className='inputId' type="tel" pattern="[0-9]{12}" placeholder='555499999999'
          value={recordRefresh?.phoneNumber}
          onChange={e => {
            if (typeof recordRefresh === 'object') {
              const value = e.target.value;
              if (!isNaN(Number(value))) {
                setRecordRefresh({ ...recordRefresh, phoneNumber: e.target.value });
              }
            }
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputHaveDelivery">Possui tele-entrega? 🚚</label>
        <input id='inputHaveDelivery' className='inputHaveDelivery' type="checkbox"
          defaultChecked={recordRefresh?.haveDelivery || false}
          checked={recordRefresh?.haveDelivery || false}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, haveDelivery: e.target.checked });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputSite">Site (O robô redirecionará para o site)</label>
        <input type="url" className='inputSite' placeholder='https://example.com'
          value={recordRefresh?.site}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, site: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputWorkingToday">Trabalhando hoje?</label>
        <input id='inputWorkingToday' className='inputWorkingToday' type="checkbox"
          defaultChecked={recordRefresh?.workingToday || false}
          checked={recordRefresh?.workingToday || false}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, workingToday: e.target.checked });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <h3 style={{ transform: 'scale(1.25)' }}>Dias de trabalho</h3>
        {/* TODO: CREATE CONTAINERS WITH DAYS OF WEEK OPTIONS, CHECKED ACCORDANLY TO THE RECORD WORKING DAYS */}
        <div>
          {recordRefresh?.workingDays ?
            availableDaysOfWork.map(availableDayOfWork => {
              const workingInAvailableDay = recordRefresh?.workingDays.some(workingDay => workingDay.day === availableDayOfWork.day) || false;
              const alwaysOpenInAvailableDay = recordRefresh?.workingDays.some(workingDay => workingDay.day === availableDayOfWork.day && workingDay.alwaysOpen === true) || false;
              const workingDayIdx = recordRefresh?.workingDays.findIndex(workingDay => workingDay.day === availableDayOfWork.day);
              console.log('availableDayOfWork: ', availableDayOfWork.day);
              console.log('alwaysOpenInAvailableDay: ', alwaysOpenInAvailableDay);
              console.log('workingInAvailableDay: ', workingInAvailableDay);
              console.log('workingDayIdx: ', workingDayIdx);
              return (
                <div className="workingDayContainer">
                  <div className='inputWorkingDay'>
                    <label htmlFor={`inputWorkingDay${availableDayOfWork.day}`}>{availableDayOfWork.dayLabel}</label>
                    <input id={`inputWorkingDay${availableDayOfWork.day}`} type="checkbox"
                      defaultChecked={workingInAvailableDay}
                      checked={workingInAvailableDay}
                      onChange={e => {
                        if (typeof recordRefresh === 'object') {

                          const workingDays = recordRefresh?.workingDays;

                          if (e.target.checked) {

                            if (workingDays.every(workingDay => workingDay.day !== availableDayOfWork.day))
                              workingDays.push(JSON.parse(JSON.stringify(availableDayOfWork)));

                          } else {

                            const idxToDelete = workingDays.findIndex(workingDay => workingDay.day === availableDayOfWork.day);

                            if (idxToDelete > -1) {
                              workingDays.splice(idxToDelete, 1);
                            }

                          }

                          workingDays.sort((a, b) => a.day - b.day);
                          setRecordRefresh({ ...recordRefresh, workingDays });
                        }
                      }} />
                    {
                      workingInAvailableDay && recordRefresh ?
                        <div className="inputWorkingDay">
                          <label htmlFor={`inputWorkingDay${availableDayOfWork.day}AlwaysOpen`}>Aberto 24h</label>
                          <input id={`inputWorkingDay${availableDayOfWork.day}AlwaysOpen`} type="checkbox"
                            defaultChecked={alwaysOpenInAvailableDay}
                            checked={alwaysOpenInAvailableDay}
                            onChange={e => {
                              if (typeof recordRefresh === 'object') {

                                const workingDays = recordRefresh?.workingDays;

                                if (e.target.checked) {

                                  // const aa = workingDays.findIndex(item => item.day === availableDayOfWork.day);
                                  workingDays[workingDayIdx].alwaysOpen = true;
                                  // if (workingDays.every(workingDay => workingDay.day !== availableDayOfWork.day))
                                  //   workingDays.push(JSON.parse(JSON.stringify(availableDayOfWork)));

                                } else {

                                  workingDays[workingDayIdx].alwaysOpen = false;
                                  // const idxToDelete = workingDays.findIndex(workingDay => workingDay.day === availableDayOfWork.day);

                                  // if (idxToDelete > -1) {
                                  //   workingDays.splice(idxToDelete, 1);
                                  // }

                                }

                                workingDays.sort((a, b) => a.day - b.day);
                                setRecordRefresh({ ...recordRefresh, workingDays });

                              }
                            }} />
                        </div>
                        :
                        <></>
                    }
                    {workingInAvailableDay && workingDayIdx > -1 && recordRefresh && !alwaysOpenInAvailableDay ?
                      <div className='inputWorkingDayHours'>
                        <div className='column'>
                          <label htmlFor={`inputWorkingDay${availableDayOfWork.day}StartHour`}>Início</label>
                          <input type="time" id={`inputWorkingDay${availableDayOfWork.day}StartHour`} value={recordRefresh?.workingDays[workingDayIdx].startHour} onChange={e => {
                            const workingDays = recordRefresh.workingDays;
                            const workingDayIdx = workingDays.findIndex(workingDay => workingDay.day === availableDayOfWork.day);
                            if (workingDayIdx > -1) {
                              workingDays[workingDayIdx].startHour = e.target.value;
                              workingDays.sort((a, b) => a.day - b.day);
                              setRecordRefresh({ ...recordRefresh, workingDays });
                            }
                          }} />
                        </div>
                        <div className="column">
                          <label htmlFor={`inputWorkingDay${availableDayOfWork.day}EndHour`}>Fim</label>
                          {/* <input aria-label="Time" type="time" /> */}
                          <input type="time" id={`inputWorkingDay${availableDayOfWork.day}EndHour`} value={recordRefresh?.workingDays[workingDayIdx].endHour} onChange={e => {
                            const workingDays = recordRefresh.workingDays;
                            const workingDayIdx = workingDays.findIndex(workingDay => workingDay.day === availableDayOfWork.day);
                            if (workingDayIdx > -1) {
                              workingDays[workingDayIdx].endHour = e.target.value;
                              workingDays.sort((a, b) => a.day - b.day);
                              setRecordRefresh({ ...recordRefresh, workingDays });
                            }
                          }} />
                        </div>
                      </div>
                      :
                      <></>
                    }
                  </div>
                </div>
              );
            })
            :
            <></>
          }
        </div>
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputAddressNumber">Número do endereço</label>
        <input className='inputAddressNumber' type="text" placeholder='9123'
          value={recordRefresh?.addressNumber}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, addressNumber: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputStreet">Rua</label>
        <input className='inputStreet' type="text" placeholder='Rua'
          value={recordRefresh?.street}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, street: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputNeighborhood">Bairro</label>
        <input className='inputNeighborhood' type="text" placeholder='Bairro'
          value={recordRefresh?.neighborhood}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, neighborhood: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputPostalCode">CEP</label>
        <input className='inputPostalCode' type="text" placeholder='CEP'
          value={recordRefresh?.postalCode ? (recordRefresh?.postalCode.length > 5 ? recordRefresh?.postalCode?.substring(0, 5) + '-' + recordRefresh?.postalCode?.substring(5, 8) : recordRefresh?.postalCode) : ''}
          onChange={e => {
            if (typeof recordRefresh === 'object') {
              const postalCode = e.target.value.replace('-', '').substring(0, 8);
              if (!isNaN(Number(postalCode))) {
                setRecordRefresh({ ...recordRefresh, postalCode: postalCode });
              }
            }
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputCity">Cidade</label>
        <input className='inputCity' type="text" placeholder='City'
          value={recordRefresh?.city}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, city: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputState">Estado (UF)</label>
        <input className='inputState' type="text" placeholder='UF'
          value={recordRefresh?.state}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, state: e.target.value });
          }} />
      </div>
      <br />
      <div className='fieldContainer'>
        <label htmlFor="inputCountry">País</label>
        <input className='inputCountry' type="text" placeholder='Country'
          value={recordRefresh?.country}
          onChange={e => {
            if (typeof recordRefresh === 'object')
              setRecordRefresh({ ...recordRefresh, country: e.target.value });
          }} />
      </div>
      <br />
      {/* let ary = Intl.supportedValuesOf('timeZone'); */}
      <div className='fieldContainer'>
        <label htmlFor="inputTimezone">Timezone</label>
        <label htmlFor="inputTimezone">{recordRefresh?.timezone}</label>
        <div className="column">
          <label htmlFor="utcSignal">- </label>
          <input value="-" checked={recordRefresh?.timezone.split('UTC')[1].substring(0, 1) === '-'} type="radio" name="utcSignal" id="utcSignal"
            onChange={e => {
              console.log(e.target.value);
              if (typeof recordRefresh === 'object') {
                const recordRefreshTimezone = recordRefresh.timezone.replace('UTC+', 'UTC-');
                setRecordRefresh({ ...recordRefresh, timezone: recordRefreshTimezone });

              }
            }}
          />
          <label htmlFor="utcSignal">+ </label>
          <input value="+" checked={recordRefresh?.timezone.split('UTC')[1].substring(0, 1) === '+'} type="radio" name="utcSignal" id="utcSignal"
            onChange={e => {
              console.log(e.target.value);
              if (typeof recordRefresh === 'object') {
                const recordRefreshTimezone = recordRefresh.timezone.replace('UTC-', 'UTC+');
                setRecordRefresh({ ...recordRefresh, timezone: recordRefreshTimezone });

              }
            }}
          />
        </div>
        <br />
        <div className="row">
          <input className='inputTimezone' type="time" placeholder='UTC(-3:00)'
            value={recordRefresh?.timezone.split('UTC')[1].replace('-', '').replace('+', '')}
            onChange={e => {
              if (typeof recordRefresh === 'object') {
                const recordRefreshTimezone = recordRefresh?.timezone.includes('-') ? `UTC-${e.target.value}` : `UTC+${e.target.value}`;
                setRecordRefresh({ ...recordRefresh, timezone: recordRefreshTimezone });
              }
            }} />
        </div>
        {/* <select className='filterByProductType' name="filterByProductType" id="filterByProductType"
          onChange={e => {

          }}
          value={recordRefresh?.timezone}
        >
          {
            Intl.supportedValuesOf("timeZone").map((timeZone: string) => {
              return (
                <option defaultChecked={timeZone === recordRefresh?.timezone} value={timeZone}>{timeZone}</option>
              );
            })
          }
        </select> */}
      </div>
      <br />
      <button disabled={recordRefresh?._id === 'undefined'} className='submitButton' type="submit" onClick={async e => {
        console.log('recordRefresh: ', recordRefresh);
        if (recordRefresh) {
          const updated = await CompanyServiceInstance.upsertCompany(recordRefresh);
          if (updated) {
            window.alert(`Alterações salvas com sucesso!`);
          } else {

          }
        }
      }}>
        {'Salvar'}
      </button>
    </div>
  );

}

export default CompanyPage;
