import React, { useEffect, useState } from 'react'
import { Row, Col, Button, FormGroup, Input, FormFeedback } from 'reactstrap'
import SubHeaderCommon from '../common/SubHeaderCommon'
import '../Incorporation/Incorporation_styles/Incorporation_bs.scss'
// import Incorporation_PartB2 from './Incorporation_PartB2'
import { incorporation_data } from '../Mock/incorporation_mock_data'
import { tan_partA_instructions } from "./mockTanJson";
import { useNavigate, useParams } from 'react-router-dom'
import Congratulation_page from '../common/Congratulation_page'
import BSRGooglePage from "../bsrGooglePage";
import { BsFillJournalBookmarkFill, BsClipboardCheck } from "react-icons/bs";
import { ImVideoCamera } from "react-icons/im";
import Status_Report_Bs from '../common/Status_Report_Bs'
import { getBSRActiveCompany, setActiveModule, updateBsrCurrentStatus } from "../bsrUtility";
import { CIN_NEXT_SCREEN, hasValue, BSR_CATEGORY_INCORP } from "../mockBSRJson";
import { getCurrentUser } from '../../utils/Auth'
import axios from '../../utils/axios-config'
import Incorporation_PartA1 from './InCorporation_PartA/Incorporation_PartA1'
import Incorporation_PartB1 from './Incorporation_PartB/Incorporation_PartB1'
import Incorporation_PartA2 from './InCorporation_PartA/Incorporation_PartA2'
import Incorporation_PartB2 from './Incorporation_PartB/Incorporation_PartB2'
import Incorporation_PartA3 from './InCorporation_PartA/Incorporation_PartA3'
import Incorporation_PartA4 from './InCorporation_PartA/Incorporation_PartA4'
import Incorporation_PartB4 from './Incorporation_PartB/Incorporation_PartB4'
import Incorporation_PartA5 from './InCorporation_PartA/Incorporation_PartA5'
import Incorporation_PartB5 from './Incorporation_PartB/Incorporation_PartB5'
import Incorporation_PartA6 from './InCorporation_PartA/Incorporation_PartA6'
import Incorporation_PartB6 from './Incorporation_PartB/Incorporation_PartB6'
import Incorporation_PartA7 from './InCorporation_PartA/Incorporation_PartA7'
import Incorporation_PartB7 from './Incorporation_PartB/Incorporation_PartB7'
import Incorporation_PartA8 from './InCorporation_PartA/Incorporation_PartA8'
import Incorporation_PartB8 from './Incorporation_PartB/Incorporation_PartB8'
import Incorporation_PartA9 from './InCorporation_PartA/Incorporation_PartA9'
import Incorporation_PartB9 from './Incorporation_PartB/Incorporation_PartB9'
import Incorporation_PartA10 from './InCorporation_PartA/Incorporation_PartA10'
import Incorporation_PartB10 from './Incorporation_PartB/Incorporation_PartB10'
import Incorporation_PartA11 from './InCorporation_PartA/Incorporation_PartA11'
import Incorporation_PartB11 from './Incorporation_PartB/Incorporation_PartB11'
import Incorporation_PartA12 from './InCorporation_PartA/Incorporation_PartA12'
import Incorporation_PartB12 from './Incorporation_PartB/Incorporation_PartB12'
import Incorporation_PartA13 from './InCorporation_PartA/Incorporation_PartA13'
import Incorporation_PartB13 from './Incorporation_PartB/Incorporation_PartB13'
import Incorporation_PartA14 from './InCorporation_PartA/Incorporation_PartA14'
import Incorporation_PartB14 from './Incorporation_PartB/Incorporation_PartB14'
import Incorporation_PartA15 from './InCorporation_PartA/Incorporation_PartA15'
import Incorporation_PartA16 from './InCorporation_PartA/Incorporation_PartA16'
import Incorporation_PartB16 from './Incorporation_PartB/Incorporation_PartB16'
import Incorporation_PartA17 from './InCorporation_PartA/Incorporation_PartA17'
import Incorporation_PartB17 from './Incorporation_PartB/Incorporation_PartB17'
import Incorporation_PartA18 from './InCorporation_PartA/Incorporation_PartA18'
import Incorporation_PartB18 from './Incorporation_PartB/Incorporation_PartB18'
import Incorporation_PartA19 from './InCorporation_PartA/Incorporation_PartA19'
import Incorporation_PartB19 from './Incorporation_PartB/Incorporation_PartB19'
import Incorporation_PartA20 from './InCorporation_PartA/Incorporation_PartA20'
import Incorporation_PartB20 from './Incorporation_PartB/Incorporation_PartB20'
import Incorporation_PartA21 from './InCorporation_PartA/Incorporation_PartA21'
import Incorporation_PartB21 from './Incorporation_PartB/Incorporation_PartB21'
import Incorporation_PartA22 from './InCorporation_PartA/Incorporation_PartA22'
import Incorporation_PartB22 from './Incorporation_PartB/Incorporation_PartB22'
import Incorporation_PartA23 from './InCorporation_PartA/Incorporation_PartA23'
import Incorporation_PartB23 from './Incorporation_PartB/Incorporation_PartB23'
import PT_Registration_PartA from '../PT/PT_Registration_PartA'
import RightSide_PartB from '../common/RightSide_PartB'
import { Cin_mock_partB, Cin_mock_partA } from "./mockTanJson";
import cinparta from "./images/cinparta.png"
import { CIN_FORM_MANDATORY_FIELDS, incorporation_partA_data, MOCK_COMPANY_IFNORMATION, MOCK_CORRESPONDENCE_ADDRESS, MOCK_SUBSCRIBER_PARICULAR_DATA, MOCK_DIRECTOR_SUBSCRIBER_DATA, MOCK_INDIVIDUAL_SUBSCRIBER_DATA, MOCK_PARTICULAR_OF_DIRECTORS_DATA, MOCK_PARTICULARS_OF_THE_NAMINE_DATA, MOCK_STAMP_DUTY_DATA } from './Mock/incorporation_partA_mockdata'
import '../../bussiness-setup-and-registration/Incorporation/styles/Incorporation_components_styles.scss'
import Incorporation_PartB3 from './Incorporation_PartB/Incorporation_PartB3'

const Incorporation_bs = () => {
  const data = incorporation_partA_data
  const navigate = useNavigate()
  const [isGooglePage, setGooglePage] = useState(true);
  const [disableNext, setDisableNext] = useState(false)
  const { company, module, currentScreen } = useParams();
  const [showLoader, setShowLoader] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    correspondence_address_line1: '',
    correspondence_address_line2: '',
    'memorundum_of_association': '',
    'articles_of_association': '',
    'declaration': '',
    'proof_of_office_address': '',
    'copy_of_utility_bill': '',
    'copy_of_cert_of_incorporation': ''
  });
  const [cinErrorForm, setCinErrorForm] = useState({});
  const [subsriberData, setSubscriberData] = useState({});
  const [stampDutyData, setStampDutyData] = useState({});
  const [directors, setDirctors] = useState(0);
  const [aoDetails, setAODetails] = useState({});

  const callCINApiOnConfirmation = async () => {
    setShowLoader(true)
    setActiveModule(BSR_CATEGORY_INCORP);
    let apiUrl = `/user_business_setup/category/CIN/${company}`
    await axios.put(apiUrl, {}, {
      headers: {
        "Authorization": "Bearer " + getCurrentUser().token
      }
    })
    setShowLoader(false)
    let navUrl = `/business-setup-registration/StatusReport`;
    navigate(navUrl)
    updateBsrCurrentStatus(navUrl, company, module, 'StatusReport');
  }

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    setApplicationForm({
      ...applicationForm,
      [name]: type === "text" ? value.toUpperCase() : value,
    });
  };

  const VALIDATION_OBJ = {
    'new_company_information': { screenName: 'COMPANY_INFORMATION', mockData: MOCK_COMPANY_IFNORMATION },
    'company_adress': { screenName: 'CORRESPONDENCE_ADDRESS', mockData: MOCK_CORRESPONDENCE_ADDRESS },
    'subscriber&paricular_non_individual': { screenName: 'SUBSCRIBER_PARTICULAR', mockData: MOCK_SUBSCRIBER_PARICULAR_DATA },
    'Particulars_individual_first_subscriber': { screenName: 'DIRECTOR_SUBSCRIBER_PARTICULARS', mockData: MOCK_DIRECTOR_SUBSCRIBER_DATA },
    'Individuals_who_not_Directors': { screenName: 'INDIVIDUAL_DIRECTOR', mockData: MOCK_INDIVIDUAL_SUBSCRIBER_DATA },
    'Particulars_of_directors': { screenName: 'PARTICULAR_OF_DIRECTORS', mockData: MOCK_PARTICULAR_OF_DIRECTORS_DATA },
    'OPC_Nomination': { screenName: 'PARTICULARS_OF_THE_NAMINE', mockData: MOCK_PARTICULARS_OF_THE_NAMINE_DATA },
    'Stamp_Duty': { screenName: 'STAMP_DUTY', mockData: MOCK_STAMP_DUTY_DATA },
  }

  function isInputMatchedWithMock(inputValue, mockValue) {
    if (inputValue && mockValue && inputValue.toLowerCase() !== mockValue.toLowerCase()) {
      return true
    }
    return false;
  }

  function matchNameWithMock(inputValue) {
    let nameFound = false;
    let nameArr = [subsriberData?.person_first_name, subsriberData?.person_middle_name, subsriberData?.person_last_name]
    let inputArr = inputValue.split(' ')
    inputArr.map(i => {
      if (nameArr.indexOf(i) > -1) {
        nameFound = true;
      }
    })
    return nameFound;
  }

  function validateCinCurrentPage(screenName, mockData) {
    let cinForm = applicationForm;
    let errorForm = {}
    CIN_FORM_MANDATORY_FIELDS[screenName].map(mandField => {
      if (!hasValue(cinForm[mandField])) {
        errorForm[`${mandField}_error`] = 'This field is Required'
      } else {
        if (mandField === 'correspondence_address_line1') {
          let inputAddLine1 = cinForm['correspondence_address_line1'];
          let inputAddLine2 = cinForm['correspondence_address_line2'];
          let mockAddress = mockData[mandField];
          if (inputAddLine1.length < 5) {
            errorForm[`${mandField}_error`] = 'Enter Atleaset 5 characters in Address';
          } else if (inputAddLine1.length > 5 && (mockAddress.toLowerCase().indexOf(inputAddLine1.toLowerCase()) === -1 && mockAddress.toLowerCase().indexOf(inputAddLine2.toLowerCase()) === -1)) {
            errorForm[`${mandField}_error`] = 'Please enter correct value';
          }
        } else if (mandField === 'subscriber_Line1') {
          let mockSubscribe = mockData[mandField];
          let inputAddLine3 = cinForm['subscriber_Line1'];
          let inputAddLine4 = cinForm['subscriber_Line2'];
          if (inputAddLine3.length < 10) {
            errorForm[`${mandField}_error`] = 'Enter Atleaset 10 characters in Address';
          } else if (inputAddLine3.length > 10 && (mockSubscribe.toLowerCase().indexOf(inputAddLine3.toLowerCase()) === -1 && mockSubscribe.toLowerCase().indexOf(inputAddLine4.toLowerCase()) === -1)) {
            errorForm[`${mandField}_error`] = 'Please enter correct value';
          }
        } else {
          let mockValue = mockData[mandField]
          if (isInputMatchedWithMock(cinForm[mandField], mockValue)) {
            errorForm[`${mandField}_error`] = 'Please enter correct value';
          }
        }
      }
    })
    setCinErrorForm(errorForm);
    return errorForm;
  };

  function validateAOCodes() {
    let cinForm = applicationForm;
    let errorForm = {}
    CIN_FORM_MANDATORY_FIELDS['AO_CODES'].map(mandField => {
      if (!hasValue(cinForm[mandField])) {
        errorForm[`${mandField}_error`] = 'This field is Required'
      } else {
        let mockValue = aoDetails[mandField]
        if (isInputMatchedWithMock(cinForm[mandField], mockValue)) {
          errorForm[`${mandField}_error`] = 'Please enter correct value';
        }
      }
    })
    setCinErrorForm(errorForm);
    return errorForm
  }

  function setMockDataForValidation() {
    return {
      correspondence_address_line1: `${subsriberData?.address_no}, ${subsriberData?.area} `,
      correspondence_address_line2: `${subsriberData?.address_no}, ${subsriberData?.area} `,
      correspondence_address_city: subsriberData?.city,
      correspondence_address_state: subsriberData?.state,
      correspondence_address_pin_code: subsriberData?.pin,
      correspondence_address_phone_no: subsriberData?.mobile,
      correspondence_address_email: subsriberData?.email,
      subscriber_registration: "",
      subscriber_corporate: `${subsriberData.person_first_name} ${subsriberData.person_middle_name} ${subsriberData.person_last_name}`,
      subscriber_Line1: `${subsriberData.address_no} ${subsriberData.area}${subsriberData.city}`,
      subscriber_Line2: `${subsriberData.address_no} ${subsriberData.area}${subsriberData.city}`,
      subscriber_City: subsriberData.city,
      subscriber_State: subsriberData.state,
      subscriber_Pincode: subsriberData.pin,
      subscriber_Mobile: subsriberData.mobile,
      subscriber_Fax: "",
      subscriber_email_Id: subsriberData.email,
      authorised_First_Name: subsriberData.person_first_name,
      authorised_Middle_Name: subsriberData.person_middle_name,
      authorised_Surname: subsriberData.person_last_name,
      authorised_fathers_first_name: subsriberData.father_first_name,
      authorised_fathers_middle_name: subsriberData.father_middle_name,
      authorised_fathers_surname: subsriberData.father_last_name,
      authorised_Gender: "",
      authorised_DOB: subsriberData.dob,
      authorised_Nationality: "",
      authorised_PAN: subsriberData.PAN,
      authorised_Passport_number: "",
      authorised_Aadhar_number: subsriberData.AADHAR,
      authorised_Place_of_birth: "",
      authorised_Occupation_Type: "",
      authorised_Area_of_Occupation: "",
      authorised_Education_Qualification: "",
      Present_Address_Line1: `${subsriberData.address_no} ${subsriberData.area}${subsriberData.city} `,
      Present_Address_Line2: `${subsriberData.address_no} ${subsriberData.area}${subsriberData.city}`,
      Present_Address_City: subsriberData.city,
      Present_Address_State: subsriberData.state,
      Present_Address_Pincode: subsriberData.pin,
      Present_Address_ISO_Country_code: "",
      Present_Address_Country: "",
      Present_Address_Phone: subsriberData.mobile,
      Present_Address_Mobile: subsriberData.mobile,
      Present_Address_Fax: "",
      Present_Address_email_Id: subsriberData.email,
      Director_Identification: "",
      director_Name: `${subsriberData.person_first_name} ${subsriberData.person_middle_name} ${subsriberData.person_last_name}`,
      director_First_Name: subsriberData.person_first_name,
      director_Middle_Name: subsriberData.person_middle_name,
      director_Surname: subsriberData.person_last_name,
      director_fathers_first_name: subsriberData.father_first_name,
      director_fathers_middle_name: subsriberData.father_middle_name,
      director_fathers_surname: subsriberData.father_last_name,
      director_Gender: "",
      director_DOB: subsriberData.dob,
      director_Nationality: "",
      director_Place_of_Birth: "",
      director_Area_of_Occupation: "",
      director_please_specify: "",
      director_PAN: subsriberData.PAN,
      director_Passport_number: "",
      director_Aadhar_number: subsriberData.AADHAR,
      director_email_ID: subsriberData.email,
      director_Line1: `${subsriberData.address_no} ${subsriberData.area}${subsriberData.city} `,
      director_Line2: `${subsriberData.address_no} ${subsriberData.area}${subsriberData.city} `,
      director_City: subsriberData.city,
      director_State: subsriberData.state,
      director_Pincode: subsriberData.pin,
      director_ISO_Country_code: "",
      director_Country: "",
      director_Phone: subsriberData.mobile,
    }
  }

  const navigateToNext = () => {
    setCinErrorForm({});
    let nextScreen = CIN_NEXT_SCREEN[currentScreen];
    let url = `/ business - setup - registration / ${company} /${module}/${nextScreen} `;
    if (currentScreen === 'Completed') {
      callCINApiOnConfirmation()
    } else if (currentScreen === 'new_company_information'
      || currentScreen === 'subscriber&paricular_non_individual'
      || currentScreen === 'Particulars_individual_first_subscriber'
      || currentScreen === 'Individuals_who_not_Directors'
      || currentScreen === 'Particulars_of_directors'
      || currentScreen === 'OPC_Nomination'
      || currentScreen === 'Stamp_Duty'
    ) {
      let validationObj = VALIDATION_OBJ[currentScreen]
      let validationStatus = validateCinCurrentPage(validationObj.screenName, validationObj.mockData);
      if (Object.keys(validationStatus).length === 0) {
        navigate(url);
        updateBsrCurrentStatus(url, company, module, nextScreen);
      }
    } else if (currentScreen === 'company_adress') {
      let mockData = setMockDataForValidation();
      let validationObj = VALIDATION_OBJ[currentScreen]
      let validationStatus = validateCinCurrentPage(validationObj.screenName, mockData);
      if (Object.keys(validationStatus).length === 0) {
        navigate(url);
        updateBsrCurrentStatus(url, company, module, nextScreen);
      }
    } else if (currentScreen === 'Stamp_Duty') {
      let validationStatus = validateCinCurrentPage('STAMP_DUTY', stampDutyData);
      if (Object.keys(validationStatus).length === 0) {
        navigate(url);
        updateBsrCurrentStatus(url, company, module, nextScreen);
      }
    } else if (currentScreen === 'PAN&TAN_Information') {
      let validationStatus = validateAOCodes();
      if (Object.keys(validationStatus).length === 0) {
        navigate(url);
        updateBsrCurrentStatus(url, company, module, nextScreen);
      }
    } else if (currentScreen === 'CIN_Attachments') {
      let cinForm = applicationForm;
      let errorForm = {}
      CIN_FORM_MANDATORY_FIELDS['CIN_ATTACHMENTS'].map(mandField => {
        if (!hasValue(cinForm[mandField])) {
          errorForm[`${mandField}_error`] = 'Please attach the document'
        }
      })
      setCinErrorForm(errorForm);
      if (Object.keys(errorForm).length === 0) {
        navigate(url);
        updateBsrCurrentStatus(url, company, module, nextScreen);
      }
    } else if (currentScreen === 'CIN_Declaration') {
      let cinForm = applicationForm;
      let errorForm = {}
      CIN_FORM_MANDATORY_FIELDS['CIN_DECLARATIONS_CHECK'].map(mandField => {
        if (!hasValue(cinForm[mandField])) {
          errorForm[`${mandField}_error`] = 'Please check this option'
        }
      })
      CIN_FORM_MANDATORY_FIELDS['CIN_DECLARATIONS_FIELDS'].map(mandField => {
        if (!hasValue(cinForm[mandField])) {
          errorForm[`${mandField}_error`] = 'This field is required'
        } else {
          let mockDin = subsriberData.din;
          if (mandField === 'din_or_pan' && hasValue(mockDin) && isInputMatchedWithMock(cinForm[mandField], mockDin)) {
            errorForm[`${mandField}_error`] = 'Please enter correct value';
          }
          if (mandField === 'director_name_in_attachment' && !matchNameWithMock(cinForm[mandField])) {
            errorForm[`${mandField}_error`] = 'Please enter correct value';
          }
        }
      })
      setCinErrorForm(errorForm);
      if (Object.keys(errorForm).length === 0) {
        navigate(url);
        updateBsrCurrentStatus(url, company, module, nextScreen);
      }
    } else {
      navigate(url);
      updateBsrCurrentStatus(url, company, module, nextScreen);
    }
  }

  const submitCINForm = () => {
    let cinForm = applicationForm;
    let errorForm = {}
    CIN_FORM_MANDATORY_FIELDS['DEC_CER_PROFESSIONAL'].map(mandField => {
      if (!hasValue(cinForm[mandField])) {
        errorForm[`${mandField}_error`] = mandField === 'declaration_name' ? 'This field is required' : 'Please selection any one option'
      } else {
        if (mandField === 'declaration_name' && !matchNameWithMock(cinForm[mandField])) {
          errorForm[`${mandField}_error`] = 'Please enter correct value';
        }
      }
    })
    setCinErrorForm(errorForm);
    if (Object.keys(errorForm).length === 0) {
      setDisableNext(false)
    }
  }

  const navigateToPrevious = () => {
    let prevScreen = '';
    Object.entries(CIN_NEXT_SCREEN).forEach(([key, value]) => {
      if (value === currentScreen) {
        prevScreen = key;
      }
    });
    if (prevScreen !== '') {
      let url = `/ business - setup - registration / ${company} /${module}/${prevScreen} `;
      navigate(url);
      updateBsrCurrentStatus(url, company, module, prevScreen);
    }
  }

  const stamp_duty_field = [
    'payable_form_fee',
    'payable_moa_fee',
    'payable_aoa_fee',
    'paid_form_fee',
    'paid_moa_fee',
    'paid_aoa_fee',
    'paid_other_fee'
  ]

  const matchNumberAndLength = (name, value, length) => {
    let pattern = /^[0-9]+$/;
    let result = value.match(pattern);
    if (result !== null && value.length <= length) {
      setApplicationForm({
        ...applicationForm,
        [name]: value
      })
    }
  }

  const handleValueChange = (e) => {
    const { name, value } = e.target
    if (name === 'correspondence_address_phone_no' || name === 'subscriber_Mobile ') {
      matchNumberAndLength(name, value, 10)
    } else if (name === 'correspondence_address_pin_code' || name === 'subscriber_Pincode') {
      matchNumberAndLength(name, value, 6)
    } else if (stamp_duty_field.indexOf(name) !== -1) {
      matchNumberAndLength(name, value, 5)
    } else {
      setApplicationForm({
        ...applicationForm,
        [name]: value
      })
    }
  }

  const renderFormErrorMessage = (field) => {
    return (
      cinErrorForm[field] !== undefined && cinErrorForm[field] !== '' &&
      <FormFeedback>
        <span style={{ color: '#f00', fontSize: 12 }}> {cinErrorForm[field]}</span>
      </FormFeedback>
    )
  }

  const renderErrorMessage = (field) => {
    return (
      cinErrorForm[field] !== undefined && cinErrorForm[field] !== '' &&
      <span style={{ color: '#f00', fontSize: 12, marginBottom: 10 }}> {cinErrorForm[field]}</span>
    )
  }

  const renderTextField = (type, name, isDisabled) => {

    return (
      <FormGroup >
        <Input type={type}
          name={name}
          value={applicationForm[name]}
          onChange={handleValueChange}
          className="inputcin_bg border-1"
          disabled={isDisabled}
          invalid={cinErrorForm[`${name} _error`] !== undefined && cinErrorForm[`${name} _error`] !== '' ? true : false}
        />
        {renderFormErrorMessage(`${name} _error`)}
      </FormGroup>
    )
  }

  const renderSelectField = (name, dropdownList, isDisabled) => {
    return (
      <FormGroup >
        <Input type='select'
          name={name}
          value={applicationForm[name]}
          onChange={handleValueChange}
          className="inputcin_bg border-1"
          disabled={isDisabled}
          invalid={cinErrorForm[`${name} _error`] !== undefined && cinErrorForm[`${name} _error`] !== '' ? true : false}
        >
          <option value=''>{''}</option>
          {dropdownList !== undefined && dropdownList.length > 0 && dropdownList.map(option => {
            return <option value={option.value}>{option.label}</option>
          })}
        </Input>
        {renderFormErrorMessage(`${name} _error`)}
      </FormGroup>
    )
  }

  const renderCheckBoxField = (name) => {
    return (
      <Input
        type='checkbox'
        name={name}
        value="Yes"
        className="bsr-pl-10"
        checked={applicationForm[name] === "Yes" ? true : false}
        onChange={handleValueChange} />
    )
  }

  const renderRadioBoxDCField = (name, value) => {
    return (
      <Input
        type='radio'
        name={name}
        value={value}
        className="bsr-pl-10 mx-2"
        checked={applicationForm[name] === value ? true : false}
        onChange={handleValueChange} />
    )
  }

  const renderRadioField = (name) => {
    return (
      <>
        <div style={{ display: 'flex' }}>
          {/* <FormGroup>
            <Input
              type='radio'
              name={name}
              value="Yes"
              checked={applicationForm[name] === "Yes"}
              onChange={handleValueChange} />
            <Label className="gst-label bsr-pl-10 bsr-pr-15" check> Yes </Label>
          </FormGroup> */}
          <FormGroup>
            <Input
              type='radio'
              name={name}
              value="No"
              className="bsr-pl-10"
              checked={applicationForm[name] === "No"}
              onChange={handleValueChange} />
            {/* <Label className="gst-label bsr-pl-10 bsr-pr-15" check>No </Label> */}
          </FormGroup>
          <div>
            {renderErrorMessage(`${name} _error`)}
          </div>
        </div>
      </>
    )
  }

  const handleRadioChange = (e) => {
    const { name, value } = e.target
    setApplicationForm({
      ...applicationForm,
      [name]: value
    })
  }

  const renderPaymentModeField = (name) => {
    return (
      <>
        <Row>
          <Col md={1} className='py-3'><Input type='radio' value={'Yes'} name={name} onChange={handleRadioChange} checked={applicationForm[name] === "Yes"} /> Yes</Col>
          <Col md={1} className='py-3'><Input type='radio' value={'No'} name={name} onChange={handleRadioChange} checked={applicationForm[name] === "No"} /> No</Col>
          <Col md={2} className='py-3'><Input type='radio' value={'NA'} name={name} onChange={handleRadioChange} checked={applicationForm[name] === "NA"} /> Not applicable</Col>
          <Col md={8} className='py-1'></Col>
          <div>
            {renderErrorMessage(`${name}_error`)}
          </div>
        </Row>
      </>
    )
  }

  const fetchSubscriberData = (index) => {
    let activeCompany = getBSRActiveCompany();
    let director = activeCompany['directors'][index];
    setSubscriberData(director);
  }

  useEffect(() => {
    setDisableNext(false);
    if (currentScreen === 'subscriber&paricular_non_individual' || currentScreen === 'company_adress' || currentScreen === 'Individuals_who_not_Directors' || currentScreen === 'subscriber&director_company'
      || currentScreen === 'subscriber&director_company' || currentScreen === 'Particulars_individual_first_subscriber' || currentScreen === 'Particulars_of_directors'
      || currentScreen === 'OPC_Nomination'
      || currentScreen === 'PAN&TAN_Information'
      || currentScreen === 'CIN_Attachments'
      || currentScreen === 'CIN_Declaration'
      || currentScreen === 'Professional_Declaration'
      || currentScreen === 'Visit_MCA_Portal2'
    ) {
      let activeCompany = getBSRActiveCompany();
      let total_num_directors = activeCompany.directors.length
      setDirctors(total_num_directors)
      let director = activeCompany['directors'][0];
      setSubscriberData(director);
    }

    if (currentScreen === 'Stamp_Duty') {
      let activeCompany = getBSRActiveCompany();
      let director = activeCompany['directors'][0];
      setSubscriberData(director);
      setStampDutyData({
        stamp_duty_state: director.state,
        payment_mode: 'Yes',
        payable_form_fee: '200',
        payable_moa_fee: '1000',
        payable_aoa_fee: '1000'
      })
    }
    if (currentScreen === 'PAN&TAN_Information') {
      let activeCompany = getBSRActiveCompany();
      let dashboards = activeCompany['dashboard'];
      let panDetails = dashboards && dashboards['PAN']['details']
      let tanDetails = dashboards && dashboards['TAN']['details']
      let cinAODetails = {}
      if (panDetails && panDetails.length > 0) {
        let aoDetails = panDetails[0];
        cinAODetails = {
          ...cinAODetails,
          pan_area_code: aoDetails.area_code.toString().toUpperCase(),
          pan_ao_type: aoDetails.ao_type.toString().toUpperCase(),
          pan_range_code: aoDetails.range_code.toString().toUpperCase(),
          pan_ao_no: aoDetails.ao_number.toString().toUpperCase()
        }
      }
      if (tanDetails && tanDetails.length > 0) {
        let aoDetails = tanDetails[0];
        cinAODetails = {
          ...cinAODetails,
          tan_area_code: aoDetails.tan_area_code.toString().toUpperCase(),
          tan_ao_type: aoDetails.tan_ao_type.toString().toUpperCase(),
          tan_range_code: aoDetails.tan_range_code.toString().toUpperCase(),
          tan_ao_no: aoDetails.tan_ao_number.toString().toUpperCase()
        }
      }
      setAODetails(cinAODetails)
    }
    if (currentScreen === 'Professional_Declaration') {
      setDisableNext(true);
    }
  }, [currentScreen])

  return (
    <div>
      {showLoader ? (
        <div className="loading">
          <span className="LoadingMask"></span>{' '}
        </div>
      ) : null}
      {currentScreen === 'About' && <>
        <SubHeaderCommon commonSubHead={incorporation_data} />
        <div className="pan_aplictingrid1">
          <div className="pramotors_parta_background">
            <PT_Registration_PartA data={Cin_mock_partA} Iecdata={cinparta} />
          </div>
          <div className="pramotors_parta_1">
            <RightSide_PartB common_mock_data={Cin_mock_partB} />
          </div>
        </div>
      </>}
      {/* {currentScreen === 'Google' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <BSRPartA instructions={tan_partA_instructions} title="Apply for Company Incorporation" />
          </div>
          <div className="partB_panapli">
            <BSRGooglePage
              httpLink="https://incorporationregistration.gov.in"
              setGooglePage={setGooglePage}
              nextScreen='new_company_information'
              instructions={tan_partA_instructions}
            />
          </div>
        </div>
      </>
      } */}
      {currentScreen === 'new_company_information' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA1 subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB1 renderTextField={renderTextField} renderSelectField={renderSelectField} />

          </div>
        </div>
      </>
      }
      {currentScreen === 'company_structure' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA2 subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB2 applicationForm={applicationForm} handleInputChange={handleInputChange} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'company_adress' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA3 subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB3 renderTextField={renderTextField} renderSelectField={renderSelectField} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'subscriber&director_company' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA4 subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB4 />
          </div>
        </div>
      </>
      }
      {currentScreen === 'subscriber&paricular_non_individual' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA5 subsriberData={subsriberData}
              fetchSubscriberData={fetchSubscriberData} directors={directors} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB5 renderTextField={renderTextField} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Particulars_individual_first_subscriber' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA6 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB6 renderTextField={renderTextField} renderRadioField={renderRadioField} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Individuals_who_not_Directors' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA7 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB7 renderTextField={renderTextField} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Particulars_of_directors' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA8 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB8 renderTextField={renderTextField} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'OPC_Nomination' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA9 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB9 renderTextField={renderTextField} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Stamp_Duty' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA10 data={data} stampDutyData={stampDutyData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB10
              renderTextField={renderTextField}
              setApplicationForm={setApplicationForm}
              applicationForm={applicationForm}
              renderPaymentModeField={renderPaymentModeField} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'PAN&TAN_Information' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA11 data={data} subsriberData={subsriberData} aoDetails={aoDetails} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB11
              setApplicationForm={setApplicationForm}
              applicationForm={applicationForm}
              renderTextField={renderTextField}
              renderErrorMessage={renderErrorMessage} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'CIN_Attachments' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA12 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB12
              setApplicationForm={setApplicationForm}
              applicationForm={applicationForm}
              renderErrorMessage={renderErrorMessage} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'CIN_Declaration' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA13 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB13 renderTextField={renderTextField}
              renderCheckBoxField={renderCheckBoxField}
              renderErrorMessage={renderErrorMessage} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Professional_Declaration' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA14 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB14
              renderTextField={renderTextField}
              submitCINForm={submitCINForm}
              renderRadioBoxDCField={renderRadioBoxDCField}
              renderErrorMessage={renderErrorMessage} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Visit_MCA_Portal1' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA15 data={data} />
          </div>
          <div className="partB_panapli">
            <BSRGooglePage
              httpLink="www.MCA.Org"
              setGooglePage={setGooglePage}
              nextScreen='Visit_MCA_Portal2'
              instructions={tan_partA_instructions}
            />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Visit_MCA_Portal2' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA16 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB16 data={data} />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Upload_E-Form' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA17 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB17 />
          </div>
        </div>
      </>
      }
      {currentScreen === 'attach_forms' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA18 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB18 />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Complete_Upload' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA19 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB19 />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Upload_in_Progress' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA20 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB20 />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Challan_Payments' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA21 data={data} subsriberData={subsriberData} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB21 />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Submit_Payments' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA22 data={data} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB22 />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Challan_receipt' && <>
        <div className="pan_aplictingrid">
          <div className="partA_panapli">
            <Incorporation_PartA23 data={data} />
          </div>
          <div className="partB_panapli">
            <Incorporation_PartB23 />
          </div>
        </div>
      </>
      }
      {currentScreen === 'Congratulations' && <Congratulation_page />}
      {currentScreen === 'Completed' && <Status_Report_Bs hide_nav={true} />}
      <div className="bsrFooter ">
        <div style={{ padding: "0.4rem 0rem", width: '100%' }}>
          <Row>
            <Col md={5} className="py-1">
              <div
                className="d-flex gap-4 Bsr_Stl">
                <button className=" py-1 clr_btn_blu rounded-pill"><BsFillJournalBookmarkFill className="clr_icn" />&nbsp;Read Theory</button>
                <button className=" py-1 clr_btn_blu rounded-pill"><BsClipboardCheck className="clr_icn" />&nbsp;Check Instructions</button>
                <button className=" py-1 clr_btn_blu rounded-pill"><ImVideoCamera className="text-dark" />&nbsp;Vedio Tutorials</button>
              </div>
            </Col>
            <Col md={5}>
            </Col>
            <Col md={2}>
              <div className="d-flex gap-4" style={{ float: 'right', marginRight: '3rem' }}>
                <Button color="primary" className="bsr-next-button" onClick={navigateToPrevious}
                  disabled={currentScreen === 'About' ? true : false}
                >Back</Button>
                <Button color="primary" className="bsr-next-button" disabled={disableNext} onClick={navigateToNext}
                //disabled={isValidationRequired !== undefined && isValidationRequired === false ? false : disableNext}
                >Next</Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
export default Incorporation_bs

























