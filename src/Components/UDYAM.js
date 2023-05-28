import React, { useEffect, useState } from "react";
import { Button, Col, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import { UDYAM_NEXT_SCREEN, hasValue } from "../mockBSRJson";
import { ADD_PLANT_FIELDS, UDYAM_REG_TABLE_DATA, UDYAM_REG_TABLE_HEADERS } from "./mockUdyamJson";
import './udyamStyles.scss';
import { ic_clear } from 'react-icons-kit/md/ic_clear'
import { Icon } from 'react-icons-kit'
import BSRGooglePage from "../bsrGooglePage";
import { useNavigate, useParams } from "react-router-dom";
import Udyam_landing_screen from "./Udyam_landing_screen";
import Congratulation_page from "../common/Congratulation_page";
import Udyam_PartA from "./Udyam_PartA";
import { BsFillJournalBookmarkFill, BsClipboardCheck } from "react-icons/bs";
import { ImVideoCamera } from "react-icons/im";
import { getBSRActiveCompany, getBsrGlobalValidation, setActiveModule, updateBsrCurrentStatus } from "../bsrUtility";
import axios from "../../utils/axios-config";
import { getCurrentUser } from "../../utils/Auth";
import Udyam_GooglePartA from "./Udyam_GooglePartA";
import Udyam_PartA1 from "./Udyam_PartA1";
import Udyam_PartA2 from "./Udyam_PartA2";
import moment from "moment";
import videoBs from '../Bank/images/videoBs.png'
export const UdyamApplication = (props) => {
    const [isGooglePage, setGooglePage] = useState(true);
    const [disableNext, setDisableNext] = useState(false)
    const [screenIndex, setScreenIndex] = useState(0)
    const [udyamForm, setUdyamForm] = useState({
        declaration_date: '18-08-2022',
        aadhar_number: '',
        name_in_aadhar: '',
        aadhar_otp: '',
        type_of_organiation: 'Private Limited Company',
        plant_state: '',
        plant_district: '',
    });
    const [udyamErrorForm, setUdyamErrorForm] = useState({});
    const [aadharOtpStatus, setAadharOtpStatus] = useState("Not Sent");
    const [panOtpStatus, setPanOtpStatus] = useState("Not Sent");
    const [showUdyamRegistration, setShowUdyamRegistration] = useState(null);
    const [unitList, setUnitList] = useState([]);
    let isValidationRequired = getBsrGlobalValidation();
    const navigate = useNavigate()
    const { company, module, currentScreen } = useParams();
    const [showLoader, setShowLoader] = useState(false);
    const callESIApiOnConfirmation = async () => {
        setShowLoader(true)
        setActiveModule(module);
        let apiUrl = `/user_business_setup/category/${module}/${company}`
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
    const navigateToNext = () => {
        let nextScreen = UDYAM_NEXT_SCREEN[currentScreen];
        let url = `/business-setup-registration/${company}/${module}/${nextScreen}`;
        if (currentScreen === 'About' || currentScreen === 'Google') {
            navigate(url);
            updateBsrCurrentStatus(url, company, module, nextScreen);
        } else if (currentScreen === 'Registration') {
            navigate(url);
            updateBsrCurrentStatus(url, company, module, nextScreen);
        } else if (currentScreen === 'Congratulations') {
            callESIApiOnConfirmation()
        }
    }
    const navigateToPrevious = () => {
        let prevScreen = '';
        Object.entries(UDYAM_NEXT_SCREEN).forEach(([key, value]) => {
            if (value === currentScreen) {
                prevScreen = key;
            }
        });
        if (prevScreen !== '') {
            let url = `/business-setup-registration/${company}/${module}/${prevScreen}`;
            navigate(url);
            updateBsrCurrentStatus(url, company, module, prevScreen);
        }
    }
    const disableNextButton = (data) => {
        setDisableNext(data)
    }
    var current_date = moment().add(-10, 'days').format("DD-MM-YYYY")
    let activeCompany = getBSRActiveCompany();
    let directors = activeCompany?.directors
    const HandleFinalSubmit = () => {
        let mockData = {
            // 'plant_flat_no': directors[0].block,
            // 'plant_road_street_lane': directors[0].street,
            // 'plant_block': directors[0].block,
            'plant_city': directors[0].city,
            'plant_pin': directors[0].pin,
            'plant_state': directors[0].state,
            'plant_district': directors[0].city,
        }
        let errorForm = {}
        if (!hasValue(udyamForm.phone_number)) {
            errorForm['phone_number_error'] = 'Enter Mobile Number'
        } else if (udyamForm.phone_number != directors[0].mobile) {
            errorForm['phone_number_error'] = 'Please enter correct value';
        }
        if (!hasValue(udyamForm.email_id)) {
            errorForm['email_id_error'] = 'Enter Email'
        } else if (udyamForm.email_id != directors[0].email) {
            errorForm['email_id_error'] = 'Please enter correct value';
        }
        if (!hasValue(udyamForm.name_of_enterpise)) {
            errorForm['name_of_enterpise_error'] = 'Enter Name of Enterprise'
        } else if (udyamForm.name_of_enterpise != activeCompany?.details?.companyname) {
            errorForm['name_of_enterpise_error'] = 'Please enter correct value';
        }
        ADD_PLANT_FIELDS.map(d => {
            if (!hasValue(udyamForm[d.name])) {
                errorForm[`${d.name}_error`] = 'This field is Required'
            } else {
                let mockValue = mockData[d.name]
                if (isInputMatchedWithMock(udyamForm[d.name], mockValue)) {
                    errorForm[`${d.name}_error`] = 'Please enter correct value';
                }
            }
        })
        if (!hasValue(udyamForm.bank_name)) {
            errorForm['bank_name_error'] = 'Enter Bank Name'
        } else if (udyamForm.bank_name != activeCompany?.details?.bank_name) {
            errorForm['bank_name_error'] = 'Please enter correct value';
        }
        if (!hasValue(udyamForm.bank_ifsc_code)) {
            errorForm['bank_ifsc_code_error'] = 'Enter IFS Code'
        } else if (udyamForm.bank_ifsc_code != activeCompany?.details?.ifsc_code) {
            errorForm['bank_ifsc_code_error'] = 'Please enter correct value';
        }
        if (!hasValue(udyamForm.bank_account_number)) {
            errorForm['bank_account_number_error'] = 'Enter Bank Account Number'
        } else if (udyamForm.bank_account_number != activeCompany?.details?.account_no) {
            errorForm['bank_account_number_error'] = 'Please enter correct value';
        }
        if (!hasValue(udyamForm.date_of_registration)) {
            errorForm['date_of_registration_error'] = 'Enter Date of Incorporation'
        } else if (udyamForm.date_of_registration != current_date) {
            errorForm['date_of_registration_error'] = 'Please enter correct value';
        }
        if (!hasValue(udyamForm.date_of_commencement)) {
            errorForm['date_of_commencement_error'] = 'Enter Date of commencement'
        } else if (udyamForm.date_of_commencement != current_date) {
            errorForm['date_of_commencement_error'] = 'Please enter correct value';
        }
        if (!hasValue(udyamForm.Gender)) {
            errorForm['Gender_error'] = 'Please Select Gender'
        }
        // else if (udyamForm.Gender != directors[0].gender) {
        //     errorForm['Gender_error'] = 'Please enter correct value';
        // }
        if (!hasValue(udyamForm.interested_in_gem_portal)) {
            errorForm['interested_in_gem_portal_error'] = 'Please Select this Fild'
        }
        if (!hasValue(udyamForm.interested_in_treds_portal)) {
            errorForm['interested_in_treds_portal_error'] = 'Please Select this Fild'
        }
        if (!hasValue(udyamForm.interested_in_ncs_portal)) {
            errorForm['interested_in_ncs_portal_error'] = 'Please Select this Fild'
        }
        if (!hasValue(udyamForm.udyam_reg_confirmation)) {
            errorForm['udyam_reg_confirmation_error'] = 'Please Select this Fild'
        }
        if (!hasValue(udyamForm.majority_activity_of_unit)) {
            errorForm['majority_activity_of_unit_error'] = 'Please Select this Fild'
        }
        if (Object.keys(errorForm).length > 0) {
            setUdyamErrorForm(errorForm)
        } else {
            setUdyamErrorForm({})
            setShowUdyamRegistration('Validated');

        }
        disableNextButton(false)
    }
    const handleValueChange = (e) => {
        const { name, value } = e.target
        if (name === 'aadhar_number') {
            let pattern = /^[0-9]+$/;
            let result = value.match(pattern);
            if (result !== null && value.length <= 12) {
                setUdyamForm({
                    ...udyamForm,
                    [name]: value
                })
            }
        } else if (name === 'pan_number') {
            if (value.length <= 10) {
                setUdyamForm({
                    ...udyamForm,
                    [name]: value
                })
            }
        } else {
            setUdyamForm({
                ...udyamForm,
                [name]: value
            })
        }
    }
    function isInputMatchedWithMock(inputValue, mockValue) {
        if (inputValue && mockValue && inputValue.toLowerCase().trim() !== mockValue.toLowerCase().trim()) {
            return true
        }
        return false;
    }
    const handleValidateAadhar = () => {
        let errorForm = {}
        if (!hasValue(udyamForm.aadhar_number)) {
            errorForm['aadhar_number_error'] = 'Enter Aadhar Number'
        } else if (udyamForm.aadhar_number != directors[0].AADHAR) {
            errorForm['aadhar_number_error'] = 'Please enter correct value';
        }
        if (!hasValue(udyamForm.name_in_aadhar)) {
            errorForm['name_in_aadhar_error'] = 'Enter Aadhar Number'
        } else if (udyamForm.name_in_aadhar != `${directors[0].person_first_name} ${directors[0].person_middle_name} ${directors[0].person_last_name}`) {
            errorForm['name_in_aadhar_error'] = 'Please enter correct value';
        }
        if (!udyamForm.aadhar_declaration_tick) {
            errorForm['aadhar_declaration_tick_error'] = 'Please Select Fild'
        }
        if (Object.keys(errorForm).length > 0) {
            setUdyamErrorForm(errorForm)
        } else {
            setUdyamErrorForm({})
            setAadharOtpStatus('Requested')
        }
    }
    const handleAadharOtp = () => {
        let errorForm = {}
        if (!hasValue(udyamForm.aadhar_otp)) {
            errorForm['aadhar_otp_error'] = 'Enter Aadhar Number'
        } else if (udyamForm.aadhar_otp != directors[0].OTP) {
            errorForm['aadhar_otp_error'] = 'Please enter correct value';
        }
        if (Object.keys(errorForm).length > 0) {
            setUdyamErrorForm(errorForm)
        } else {
            setUdyamErrorForm({})
            setAadharOtpStatus('Validated')
        }
        // if (udyamForm.aadhar_otp === '6252') {
        //     setAadharOtpStatus('Validated')
        // }
    }
    const handleValidatePAN = () => {
        let errorForm = {}
        if (!hasValue(udyamForm.type_of_organiation)) {
            errorForm['type_of_organiation_error'] = 'Select type of Organization'
        }
        if (!hasValue(udyamForm.pan_number)) {
            errorForm['pan_number_error'] = 'Enter PAN Number'
        } else {
            var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
            let result = udyamForm.pan_number
            if (result != directors[0].PAN) {
                errorForm['pan_number_error'] = 'Enter Valid PAN Number'
            }
        } if (!udyamForm.aadhar_declaration_tick1) {
            errorForm['aadhar_declaration_tick1_error'] = 'Please Select Fild'
        }
        if (Object.keys(errorForm).length > 0) {
            setUdyamErrorForm(errorForm)
        } else {
            setUdyamErrorForm({})
            setPanOtpStatus('Validated')
        }
    }
    const handleContinue = () => {
        setShowUdyamRegistration('Validated');
        setUdyamForm({
            ...udyamForm,
            name_as_per_pan_aadhar: `SHRI ${udyamForm.name_in_aadhar.toUpperCase()} `
        })
    }
    const handleAddUnit = () => {
        if (hasValue(udyamForm.plan_unit_name)) {
            setUnitList([...unitList, udyamForm.plan_unit_name])
            setUdyamForm({
                ...udyamForm,
                plan_unit_name: ''
            })
        }
    }
    useEffect(() => {
        setDisableNext(false);
        if (currentScreen === 'Google' || currentScreen === 'Registration') {
            setDisableNext(true);
        }
    }, [currentScreen])
    const renderFormField = (type, label, name, placeholder, isDisabled) => {
        return (
            <FormGroup >
                <Label className={"udyam-form-label"}> {label} </Label>
                <Input type={type} name={name}
                    value={udyamForm[{ name }]}
                    onChange={handleValueChange}
                    className="udyam-form-field"
                    disabled={isDisabled}
                    invalid={udyamErrorForm[`${name}_error`] !== undefined && udyamErrorForm[`${name}_error`] !== '' ? true : false}
                    placeholder={placeholder}
                />
                {renderErrorMessage(`${name}_error`)}
            </FormGroup>
        )
    }
    const renderSelectField = (type, label, name, placeholder, dropdownList, defaultOption) => {
        return (
            <FormGroup >
                <Label className={"udyam-form-label"}> {label} </Label>
                <Input type={type} name={name}
                    value={udyamForm[{ name }]}
                    onChange={handleValueChange}
                    className="udyam-form-field"
                    invalid={udyamErrorForm[`${name}_error`] !== undefined && udyamErrorForm[`${name}_error`] !== '' ? true : false}
                    placeholder={placeholder}
                >
                    <option value=''>{defaultOption}</option>
                    {dropdownList.length > 0 && dropdownList.map(option => {
                        return <option value={option.value}>{option.label}</option>
                    })}
                </Input>
                {renderErrorMessage(`${name}_error`)}
            </FormGroup>
        )
    }
    const renderRadioButton = (label, name) => {
        return (
            <>
                <Label className={"udyam-form-label"}> {label} </Label>
                <div style={{ display: 'flex' }}>
                    <FormGroup style={{ marginBottom: '1rem' }}>
                        <Input type="radio" name={name} value="Yes" checked={udyamForm[name] === 'Yes' ? true : false} onChange={handleValueChange} />
                        <Label className="tin-form-input-label"> Yes {`  `} </Label>
                    </FormGroup>
                    <FormGroup style={{ marginBottom: '1rem' }}>
                        <Input type="radio" name={name} value="No" checked={udyamForm[name] === 'No' ? true : false} onChange={handleValueChange} />
                        <Label className="tin-form-input-label"> No  {`  `} </Label>
                    </FormGroup>
                </div>
            </>
        )
    }
    const renderErrorMessage = (field) => {
        return (
            udyamErrorForm[field] !== undefined && udyamErrorForm[field] !== '' &&
            <FormFeedback>
                <span style={{ color: '#f00', fontSize: 12 }}> {udyamErrorForm[field]}</span>
            </FormFeedback>
        )
    }
    return (
        <>
            {showLoader ? (
                <div className="loading">
                    <span className="LoadingMask"></span>{' '}
                </div>
            ) : null}
            {currentScreen == 'About' && <Udyam_landing_screen />}
            {currentScreen == 'Google' &&
                <>
                    <div className="pan_aplictingrid1">
                        <div className="pramotors_parta_background">
                            <Udyam_GooglePartA />
                        </div>
                        <div className="pramotors_parta_1">
                            <BSRGooglePage httpLink="https://udyamregistration.gov.in"
                                setGooglePage={setGooglePage}
                                nextScreen='Registration' />
                        </div>
                    </div>
                </>
            }
            {currentScreen == 'Registration' &&
                <>
                    <div className="pan_aplictingrid">
                        <div className="partA_panapli">
                            {(aadharOtpStatus === 'Not Sent' ||
                                aadharOtpStatus === 'Requested') && <>
                                    <Udyam_PartA />
                                </>}
                            {aadharOtpStatus === 'Validated' && !showUdyamRegistration && <>
                                <Udyam_PartA1 />
                            </>}
                            {aadharOtpStatus === 'Validated' && showUdyamRegistration && <>
                                <Udyam_PartA2 />
                            </>}
                        </div>
                        <div className="partB_panapli" >
                            <div className="udyam-body" style={{ overflow: "scroll", overflowX: "hidden", height: "72vh" }}>
                                <div className="udyam-header">
                                    UDYAM REGISTRATION FORM - For New Enterprise who are not Registered yet as MSME
                                </div>
                                <section className="udyam-section">
                                    <Row style={{ margin: '1px 4rem' }}>
                                        <Col md='12'>
                                            <div className="udyam-card">
                                                <div className="udyam-card-header">
                                                    <h3 className="udyam-aadhar-title"> Aadhaar Verification With OTP </h3>
                                                </div>
                                                <div className="udyam-body-container" >
                                                    <Row>
                                                        <Col md='6'>
                                                            <FormGroup >
                                                                <Label className={"udyam-form-label"}>  1. Aadhaar Number </Label>
                                                                <Input type="text" name="aadhar_number"
                                                                    value={udyamForm["aadhar_number"]}
                                                                    onChange={handleValueChange}
                                                                    disabled={aadharOtpStatus === 'Validated'}
                                                                    invalid={udyamErrorForm[`aadhar_number_error`] !== undefined && udyamErrorForm[`aadhar_number_error`] !== '' ? true : false}
                                                                    className="udyam-form-field"
                                                                    placeholder="Your Aadhar Number" />
                                                                {renderErrorMessage(`aadhar_number_error`)}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='6'>
                                                            <FormGroup >
                                                                <Label className={"udyam-form-label"}>  2. Name of Entrepreneur </Label>
                                                                <Input type="text" name="name_in_aadhar"
                                                                    value={udyamForm["name_in_aadhar"]}
                                                                    onChange={handleValueChange}
                                                                    className="udyam-form-field"
                                                                    disabled={aadharOtpStatus === 'Validated'}
                                                                    invalid={udyamErrorForm[`name_in_aadhar_error`] !== undefined && udyamErrorForm[`name_in_aadhar_error`] !== '' ? true : false}
                                                                    placeholder="Name as per Aadhar" />
                                                                {renderErrorMessage(`name_in_aadhar_error`)}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='12'>
                                                            <ul style={{ marginLeft: 20, paddingBottom: 15 }}>
                                                                <li><Label>Aadhaar number shall be required for Udyam Registration.</Label></li>
                                                                <li><Label>The Aadhaar number shall be of the proprietor in the case of a proprietorship firm, of the managing partner in the case of a partnership firm and of a karta in the case of a Hindu Undivided Family (HUF).</Label></li>
                                                                <li><Label>In case of a Company or a Limited Liability Partnership or a Cooperative Society or a Society or a Trust, the organisation or its authorised signatory shall provide its GSTIN(As per applicablity of CGST Act 2017 and as notified by the ministry of MSME vide S.O. 1055(E) dated 05th March 2021) and PAN along with its Aadhaar number.</Label></li>
                                                            </ul>
                                                        </Col>
                                                        <Col md='12'>
                                                            <FormGroup>
                                                                <Input type="checkbox"
                                                                    name="aadhar_declaration_tick"
                                                                    checked={udyamForm["aadhar_declaration_tick"] === "Yes" ? true : false}
                                                                    disabled={aadharOtpStatus === 'Validated'}
                                                                    value="Yes" onChange={handleValueChange}
                                                                    invalid={udyamErrorForm[`aadhar_declaration_tick_error`] !== undefined && udyamErrorForm[`aadhar_declaration_tick_error`] !== '' ? true : false}
                                                                    style={{ marginRight: 10 }} />
                                                                <Label> I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME, Government of India, for using my Aadhaar number as alloted by UIDAI for Udyam Registration. NIC / Ministry of MSME, Government of India, have informed me that my aadhaar data will not be stored/shared. </Label>
                                                                {renderErrorMessage(`aadhar_declaration_tick_error`)}
                                                            </FormGroup>
                                                        </Col>
                                                        {aadharOtpStatus === 'Not Sent' &&
                                                            <Col md='12' style={{ paddingTop: 10, paddingLeft: 10 }}>
                                                                <Button className="udyam-primary-button" onClick={handleValidateAadhar}> Validate & Generate OTP </Button>
                                                            </Col>
                                                        }{aadharOtpStatus === 'Requested' &&
                                                            <Col md='12' style={{ paddingTop: 10, paddingLeft: 10 }}>
                                                                <div>
                                                                    <Label className={"udyam-form-label required"}>  Enter One Time Password(OTP) Code  </Label>
                                                                </div>
                                                                <div>
                                                                    <Input type="text" name="aadhar_otp"
                                                                        value={udyamForm["aadhar_otp"]}
                                                                        onChange={handleValueChange}
                                                                        className="udyam-form-field"
                                                                        disabled={aadharOtpStatus === 'Validated'}
                                                                        invalid={udyamErrorForm[`aadhar_otp_error`] !== undefined && udyamErrorForm[`aadhar_otp_error`] !== '' ? true : false}
                                                                        placeholder="OTP code (Hint: 123456)" />
                                                                    {renderErrorMessage(`aadhar_otp_error`)}
                                                                </div>
                                                                <div>
                                                                    <Label>OTP has been sent to *******{directors[0].OTP}</Label>
                                                                </div>
                                                                <div style={{ paddingTop: 10 }}>
                                                                    <Button className="udyam-primary-button" onClick={handleAadharOtp}> Validate</Button>
                                                                </div>
                                                            </Col>
                                                        }{aadharOtpStatus === 'Validated' &&
                                                            <Col md='12' style={{ paddingTop: 10, paddingLeft: 10 }}>
                                                                <Label className={"udyam-form-label"} style={{ color: 'green' }}>Your Aadhaar has been successfully verified. You can continue Udyam Registration process.</Label>
                                                            </Col>
                                                        }
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        {aadharOtpStatus === 'Validated' &&
                                            <Col md='12'>
                                                <div className="udyam-card">
                                                    <div className="udyam-card-header" style={{ background: '#28a745 !important' }}>
                                                        <h3 className="udyam-aadhar-title"> PAN Verification </h3>
                                                    </div>
                                                    <div className="udyam-body-container" >
                                                        <Row>
                                                            <Col md='4'>
                                                                <FormGroup >
                                                                    <Label className={"udyam-form-label"}> 3. Type of Organisation</Label>
                                                                    <Input type="select"
                                                                        name="type_of_organiation"
                                                                        value={udyamForm["type_of_organiation"]}
                                                                        onChange={handleValueChange}
                                                                        invalid={udyamErrorForm[`type_of_organiation_error`] !== undefined && udyamErrorForm[`type_of_organiation_error`] !== '' ? true : false}
                                                                        disabled={panOtpStatus === 'Validated'}
                                                                        placeholder="Select Type of Organization" >
                                                                        <option value="" disabled>{'Select Type of Organization'}</option>
                                                                        <option value="proprietary">Proprietary</option>
                                                                        <option value="hindu_undivided_family">Hindu Undivided Family </option>
                                                                        <option value="partnership">Partnership </option>
                                                                        <option value="cooperative ">Co-Operative </option>
                                                                        <option value="private_ltd_company">Private Limited Company </option>
                                                                        <option value="public_ltd_company">Public Limited Company </option>
                                                                        <option value="self_help_group">Self Help Group </option>
                                                                        <option value="limited_liability">Limited Liability Partenership </option>
                                                                        <option value="society">Society </option>
                                                                        <option value="trust">Trust </option>
                                                                        <option value="others">Others </option>
                                                                    </Input>
                                                                    {renderErrorMessage(`type_of_organiation_error`)}
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md='4'>
                                                                <FormGroup >
                                                                    <Label className={"udyam-form-label"}> 4.1 PAN </Label>
                                                                    <Input type="text" name="pan_number"
                                                                        value={udyamForm["pan_number"]}
                                                                        onChange={handleValueChange}
                                                                        className="udyam-form-field"
                                                                        disabled={panOtpStatus === 'Validated'}
                                                                        invalid={udyamErrorForm[`pan_number_error`] !== undefined && udyamErrorForm[`pan_number_error`] !== '' ? true : false}
                                                                        placeholder="Enter PAN Number" />
                                                                    {renderErrorMessage(`pan_number_error`)}
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md='4' />
                                                            <Col md='12'>
                                                                <FormGroup>
                                                                    <Input type="checkbox" name="aadhar_declaration_tick1" checked={udyamForm["aadhar_declaration_tick1"] === "Yes" ? true : false}
                                                                        disabled={panOtpStatus === 'Validated'}
                                                                        invalid={udyamErrorForm[`aadhar_declaration_tick1_error`] !== undefined && udyamErrorForm[`aadhar_declaration_tick1_error`] !== '' ? true : false}
                                                                        value="Yes" onChange={handleValueChange} style={{ marginRight: 10 }} />
                                                                    <Label> I, the holder of the above PAN, hereby give my consent to Ministry of MSME, Government of India, for using my data/ information available in the Income Tax Returns filed by me, and also the same available in the GST Returns and also from other Government organizations, for MSME classification and other official purposes, in pursuance of the MSMED Act, 2006. </Label>
                                                                    {renderErrorMessage(`aadhar_declaration_tick1_error`)}
                                                                </FormGroup>
                                                            </Col>
                                                            {
                                                                panOtpStatus === 'Not Sent' &&
                                                                <Col md='12' style={{ paddingTop: 10 }}>
                                                                    <Button className="udyam-primary-button" onClick={handleValidatePAN}> PAN Validate</Button>
                                                                </Col>
                                                            }
                                                            {
                                                                panOtpStatus === 'Validated' &&
                                                                <Col md='12' style={{ paddingTop: 10 }}>
                                                                    <div>
                                                                        <Label className={"udyam-form-label"} style={{ color: 'green' }}> Your PAN has been successfully verified. Some fields of the form will be disabled. Disabled fields will be automatically filled after verification from PAN data. GSTIN (As per applicablity of CGST Act 2017 and as notified by the ministry of MSME vide S.O. 1055(E) dated 05th March 2021) is required for Udyam Registration w.e.f. 01.04.2021. You are advised to apply for GSTIN suitably to avoid any inconvineance. </Label>
                                                                    </div>
                                                                    <div>
                                                                        <Button className="udyam-primary-button" onClick={handleContinue}>Continue</Button>
                                                                    </div>
                                                                </Col>
                                                            }
                                                        </Row>
                                                    </div>
                                                </div>
                                            </Col>
                                        }
                                        {showUdyamRegistration &&
                                            <Col md='12'>
                                                <div className="udyam-card">
                                                    <div className="udyam-card-header" style={{ background: '#6c757d !important' }}>
                                                        <h3 className="udyam-aadhar-title"> Udyam Registration </h3>
                                                    </div>
                                                    <div className="udyam-body-container" >
                                                        <Row>
                                                            <Col md='6'>
                                                                <FormGroup >
                                                                    <Label className={"udyam-form-label"}> 5. Name of Entrepreneur as per PAN/Aadhaar </Label>
                                                                    <Input type="text" name="name_as_per_pan_aadhar"
                                                                        value={udyamForm["name_as_per_pan_aadhar"]}
                                                                        onChange={handleValueChange}
                                                                        className="udyam-form-field"
                                                                    // disabled
                                                                    />
                                                                    {renderErrorMessage(`pan_number_error`)}
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md='6'>
                                                                <FormGroup >
                                                                    <Label className={"udyam-form-label"}> 6. Mobile Number </Label>
                                                                    <Input type="text" name="phone_number"
                                                                        value={udyamForm["phone_number"]}
                                                                        onChange={handleValueChange}
                                                                        className="udyam-form-field"
                                                                        // disabled={showUdyamRegistration === 'Validated'}
                                                                        invalid={udyamErrorForm[`phone_number_error`] !== undefined && udyamErrorForm[`phone_number_error`] !== '' ? true : false}
                                                                        placeholder="Example: 9999999999 "
                                                                    />
                                                                    {renderErrorMessage(`phone_number_error`)}
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md='6'>
                                                                <FormGroup >
                                                                    <Label className={"udyam-form-label"}> 7. Email </Label>
                                                                    <Input type="text" name="email_id"
                                                                        value={udyamForm["email_id"]}
                                                                        onChange={handleValueChange}
                                                                        className="udyam-form-field"
                                                                        invalid={udyamErrorForm[`email_id_error`] !== undefined && udyamErrorForm[`email_id_error`] !== '' ? true : false}
                                                                        placeholder="Example: abcd@gmail.com "
                                                                    />
                                                                    {renderErrorMessage(`email_id_error`)}
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: 10 }}>
                                                                <Label className={"udyam-form-label"} style={{ color: 'green' }}> Categorization of ownership of the MSMEs on the basis of %age Share/Member/Contribution of amount </Label>
                                                                <table className="identifier-table" style={{ width: '100%', float: 'left' }} title="Establishment Identifiers">
                                                                    <tbody>
                                                                        <tr className="titleHead" style={{ background: 'lightgrey' }} >
                                                                            {UDYAM_REG_TABLE_HEADERS.map(header => {
                                                                                return <th align="left" valign='top' > <strong>{header}</strong> </th>
                                                                            })}
                                                                        </tr>
                                                                        {
                                                                            UDYAM_REG_TABLE_DATA.map(data => {
                                                                                return (
                                                                                    <tr>
                                                                                        <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}><strong>{data.rowId}</strong></td>
                                                                                        <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}><strong>{data.huf}</strong></td>
                                                                                        <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}>{data.partnership}</td>
                                                                                        <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}>{data.cooperative}</td>
                                                                                        <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}>{data.private_ltd_cmp}</td>
                                                                                        <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}>{data.public_ltd_cmp}</td>
                                                                                        <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}>{data.self_help_group}</td>
                                                                                        <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}>{data.society}</td>
                                                                                        <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}>{data.trust}</td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                        <tr>
                                                                            <td colSpan={9}>In Case of proprietorship enterprise, the category of the unit would be the social category of the owner.</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 8. Social Category </Label>
                                                                <div style={{ display: 'flex', padding: 10 }}>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="social_category" value="general" checked={udyamForm["social_category"] === 'general' ? true : false} onChange={handleValueChange} />
                                                                        <Label className="tin-form-input-label"> General	 {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="social_category" value="sc" checked={udyamForm["social_category"] === 'sc' ? true : false} onChange={handleValueChange} />
                                                                        <Label className="tin-form-input-label"> SC 	  {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="social_category" value="st" checked={udyamForm["social_category"] === 'st' ? true : false} onChange={handleValueChange} />
                                                                        <Label className="tin-form-input-label"> ST 	  {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="social_category" value="obc" checked={udyamForm["social_category"] === 'obc' ? true : false} onChange={handleValueChange} />
                                                                        <Label className="tin-form-input-label"> OBC 	  {`  `} </Label>
                                                                    </FormGroup>
                                                                </div>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 9. Gender </Label>
                                                                <div style={{ display: 'flex', padding: 10 }}>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="gender" value="male" checked={udyamForm["gender"] === 'male' ? true : false} onChange={handleValueChange} invalid={udyamErrorForm[`gender_error`] !== undefined && udyamErrorForm[`gender_error`] !== '' ? true : false} />
                                                                        <Label className="tin-form-input-label"> Male	 {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="gender" value="female" checked={udyamForm["gender"] === 'female' ? true : false} onChange={handleValueChange} invalid={udyamErrorForm[`gender_error`] !== undefined && udyamErrorForm[`gender_error`] !== '' ? true : false} />
                                                                        <Label className="tin-form-input-label"> Female 	  {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="gender" value="others" checked={udyamForm["gender"] === 'others' ? true : false} onChange={handleValueChange} invalid={udyamErrorForm[`gender_error`] !== undefined && udyamErrorForm[`gender_error`] !== '' ? true : false} />
                                                                        <Label className="tin-form-input-label"> Others 	  {`  `} </Label>
                                                                    </FormGroup>
                                                                    {renderErrorMessage(`gender_error`)}
                                                                </div>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 10. Specially Abled(DIVYANG) </Label>
                                                                <div style={{ display: 'flex', padding: 10 }}>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="specially_abled" value="yes" checked={udyamForm["specially_abled"] === 'yes' ? true : false} onChange={handleValueChange} />
                                                                        <Label className="tin-form-input-label"> Yes	 {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="specially_abled" value="no" checked={udyamForm["specially_abled"] === 'no' ? true : false} onChange={handleValueChange} />
                                                                        <Label className="tin-form-input-label"> No 	  {`  `} </Label>
                                                                    </FormGroup>
                                                                </div>
                                                            </Col>
                                                            <Col md='12'>
                                                                <Label className={"udyam-form-label"} style={{ color: 'green' }}> Data in field 11 will be auto filled (as received during PAN verification) but it is editable.</Label>
                                                            </Col>
                                                            <Col md='12'>
                                                                <FormGroup >
                                                                    <Label className={"udyam-form-label"}> 11. Name of Enterprise</Label>
                                                                    <Input type="text" name="name_of_enterpise"
                                                                        value={udyamForm["name_of_enterpise"]}
                                                                        onChange={handleValueChange}
                                                                        className="udyam-form-field"
                                                                        invalid={udyamErrorForm[`name_of_enterpise_error`] !== undefined && udyamErrorForm[`name_of_enterpise_error`] !== '' ? true : false}
                                                                        placeholder="ENTER Name of Enterprise"
                                                                    />
                                                                    {renderErrorMessage(`name_of_enterpise_error`)}
                                                                </FormGroup>
                                                                {/* {renderFormField('text', '11. Name of Enterprise ', 'name_of_enterpise', 'ENTER Name of Enterprise', false)} */}
                                                            </Col>
                                                            <Col md='12'>
                                                                <Label className={"udyam-form-label"} style={{ color: 'green' }}>Data in field 12 to be filled on self decleration basis.</Label>
                                                            </Col>
                                                            <Col md='9'>
                                                                {renderFormField('text', 'Plant/Unit Name ', 'plan_unit_name', 'Unit Name', false)}
                                                            </Col>
                                                            <Col md='3'>
                                                                <Label>{''}</Label>
                                                                <Button className="udyam-primary-button" style={{ marginTop: 9 }} onClick={handleAddUnit}>Add Unit</Button>
                                                            </Col>
                                                            {unitList.length > 0 &&
                                                                <Col md='12' >
                                                                    <table className="identifier-table" style={{ width: '100%', float: 'left' }} title="Establishment Identifiers">
                                                                        <tbody>
                                                                            <tr className="titleHead" style={{ background: 'lightgrey' }} >
                                                                                <th align="left" valign='top' width="10%"> <strong>SN</strong> </th>
                                                                                <th align="left" valign='top' > <strong>Unit Name</strong> </th>
                                                                                <th align="left" valign='top' width="25%"> <strong>Delete</strong> </th>
                                                                            </tr>
                                                                            {
                                                                                unitList.map((data, index) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}><strong>{index + 1}</strong></td>
                                                                                            <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}><strong>{data}</strong></td>
                                                                                            <td align="left" valign='top' style={{ border: '1px solid #dee2e6', padding: '0.75rem' }}><Icon icon={ic_clear} size="25" style={{ color: '#dc3545' }} />{' '}</td>
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </Col>
                                                            }
                                                        </Row>
                                                        <Row style={{ paddingTop: '1em' }}>
                                                            <Col md='12'>
                                                                <Label className={"udyam-form-label"}> 12. Location of Plant(s)/Unit(s)</Label>
                                                            </Col>
                                                            {
                                                                ADD_PLANT_FIELDS.map(plant => {
                                                                    return (
                                                                        <>
                                                                            {plant.type === 'select' &&
                                                                                <Col md='4'>
                                                                                    <FormGroup >
                                                                                        <Label className={"udyam-form-label"}> {plant.label} </Label>
                                                                                        <Input type={plant.type} name={plant.name}
                                                                                            value={udyamForm[`${plant.name}`]}
                                                                                            onChange={handleValueChange}
                                                                                            invalid={udyamErrorForm[`${plant.name}_error`] !== undefined && udyamErrorForm[`${plant.name}_error`] !== '' ? true : false}
                                                                                            placeholder={plant.placeholder}
                                                                                        >
                                                                                            <option value="" readOnly>{plant.placeholder}</option>
                                                                                        </Input>
                                                                                        {renderErrorMessage(`${plant.name}_error`)}
                                                                                    </FormGroup>
                                                                                </Col>
                                                                            }
                                                                            {plant.type === 'text' &&
                                                                                <Col md='4'>
                                                                                    <FormGroup >
                                                                                        <Label className={"udyam-form-label"}> {plant.label} </Label>
                                                                                        <Input type={plant.type} name={plant.name}
                                                                                            value={udyamForm[`${plant.name}`]}
                                                                                            onChange={handleValueChange}
                                                                                            className="udyam-form-field"
                                                                                            invalid={udyamErrorForm[`${plant.name}_error`] !== undefined && udyamErrorForm[`${plant.name}_error`] !== '' ? true : false}
                                                                                            placeholder={plant.placeholder}
                                                                                        />
                                                                                        {renderErrorMessage(`${plant.name}_error`)}
                                                                                    </FormGroup>
                                                                                </Col>
                                                                            }
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                            <Col md='12' style={{ paddingTop: 10 }}>
                                                                <Button className="udyam-primary-button" disabled>Add Plant</Button>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 14. Previous EM-II/UAM Registration Number, If Any EM-II/UAM </Label>
                                                                <div style={{ display: 'flex', padding: 10 }}>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Label className="tin-form-input-label"> N/A	 {`  `} </Label>
                                                                        <Input type="radio" name="previous_em_uam_reg_number" value="N/A" checked={udyamForm["previous_em_uam_reg_number"] === 'N/A' ? true : false} onChange={handleValueChange} />
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Label className="tin-form-input-label"> EM-II	  {`  `} </Label>
                                                                        <Input type="radio" name="previous_em_uam_reg_number" value="EM-II" checked={udyamForm["previous_em_uam_reg_number"] === 'EM-II' ? true : false} onChange={handleValueChange} />
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Label className="tin-form-input-label"> Previous UAM	  {`  `} </Label>
                                                                        <Input type="radio" name="previous_em_uam_reg_number" value="Previous_UAM" checked={udyamForm["previous_em_uam_reg_number"] === 'Previous_UAM' ? true : false} onChange={handleValueChange} />
                                                                    </FormGroup>
                                                                </div>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 15. Status of Enterprise </Label>
                                                            </Col>
                                                            <Col md='4' style={{ paddingLeft: '1.2em' }}>
                                                                <FormGroup >
                                                                    <Label className={"udyam-form-label"}> a. Date of Incorporation/registration </Label>
                                                                    <Input type="text" name="date_of_registration"
                                                                        value={udyamForm["date_of_registration"]}
                                                                        onChange={handleValueChange}
                                                                        className="udyam-form-field"
                                                                        invalid={udyamErrorForm[`date_of_registration_error`] !== undefined && udyamErrorForm[`date_of_registration_error`] !== '' ? true : false}
                                                                        placeholder="DD-MM-YYYY"
                                                                    />
                                                                    {renderErrorMessage(`date_of_registration_error`)}
                                                                </FormGroup>
                                                                {/* {renderFormField('date', 'a. Date of Incorporation/registration ', 'date_of_registration', 'DD-MM-YYYY', false)} */}
                                                            </Col>
                                                            <Col md='4' >
                                                                {renderRadioButton('b. Whether production/business commenced ', 'is_prod_business_commenced', false)}
                                                            </Col>
                                                            <Col md='4' >
                                                                <FormGroup >
                                                                    <Label className={"udyam-form-label"}> Date of commencement </Label>
                                                                    <Input type="text" name="date_of_commencement"
                                                                        value={udyamForm["date_of_commencement"]}
                                                                        onChange={handleValueChange}
                                                                        className="udyam-form-field"
                                                                        invalid={udyamErrorForm[`date_of_commencement_error`] !== undefined && udyamErrorForm[`date_of_commencement_error`] !== '' ? true : false}
                                                                        placeholder="DD-MM-YYYY"
                                                                    />
                                                                    {renderErrorMessage(`date_of_commencement_error`)}
                                                                </FormGroup>
                                                                {/* {renderFormField('date', 'Date of commencement ', 'date_of_commencement', 'DD/MM/YYYY', false)} */}
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 16. Bank Details </Label>
                                                            </Col>
                                                            <Col md='4' style={{ paddingLeft: '1.2em' }}>
                                                                <FormGroup >
                                                                    <Label className={"udyam-form-label"}> Bank Name </Label>
                                                                    <Input type="text" name="bank_name"
                                                                        value={udyamForm["bank_name"]}
                                                                        onChange={handleValueChange}
                                                                        className="udyam-form-field"
                                                                        invalid={udyamErrorForm[`bank_name_error`] !== undefined && udyamErrorForm[`bank_name_error`] !== '' ? true : false}
                                                                        placeholder="ENTER BANK NAME"
                                                                    />
                                                                    {renderErrorMessage(`bank_name_error`)}
                                                                </FormGroup>
                                                                {/* {renderFormField('text', 'Bank Name ', 'bank_name', 'ENTER BANK NAME', false)} */}
                                                            </Col>
                                                            <Col md='4' >
                                                                <FormGroup >
                                                                    <Label className={"udyam-form-label"}> IFS Code </Label>
                                                                    <Input type="text" name="bank_ifsc_code"
                                                                        value={udyamForm["bank_ifsc_code"]}
                                                                        onChange={handleValueChange}
                                                                        className="udyam-form-field"
                                                                        invalid={udyamErrorForm[`bank_ifsc_code_error`] !== undefined && udyamErrorForm[`bank_ifsc_code_error`] !== '' ? true : false}
                                                                        placeholder="EXMAPLE: SBIN00001155"
                                                                    />
                                                                    {renderErrorMessage(`bank_ifsc_code_error`)}
                                                                </FormGroup>
                                                                {/* {renderFormField('text', 'IFS Code ', 'bank_ifsc_code', 'EXMAPLE: SBIN00001155', false)} */}
                                                            </Col>
                                                            <Col md='4' >
                                                                <FormGroup >
                                                                    <Label className={"udyam-form-label"}> Bank Account Number </Label>
                                                                    <Input type="text" name="bank_account_number"
                                                                        value={udyamForm["bank_account_number"]}
                                                                        onChange={handleValueChange}
                                                                        className="udyam-form-field"
                                                                        invalid={udyamErrorForm[`bank_account_number_error`] !== undefined && udyamErrorForm[`bank_account_number_error`] !== '' ? true : false}
                                                                        placeholder="EXAMPLE: 5511785211155"
                                                                    />
                                                                    {renderErrorMessage(`bank_account_number_error`)}
                                                                </FormGroup>
                                                                {/* {renderFormField('text', 'Bank Account Number', 'bank_account_number', 'EXAMPLE: 5511785211155', false)} */}
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 17. Major Activity of Unit</Label>
                                                                <div style={{ display: 'flex', padding: 10 }}>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="majority_activity_of_unit" value="Manufacturing" checked={udyamForm["majority_activity_of_unit"] === 'Manufacturing' ? true : false} onChange={handleValueChange} invalid={udyamErrorForm[`majority_activity_of_unit_error`] !== undefined && udyamErrorForm[`majority_activity_of_unit_error`] !== '' ? true : false} />
                                                                        <Label className="tin-form-input-label"> Manufacturing	 {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="majority_activity_of_unit" value="Services" checked={udyamForm["majority_activity_of_unit"] === 'Services' ? true : false} onChange={handleValueChange} invalid={udyamErrorForm[`majority_activity_of_unit_error`] !== undefined && udyamErrorForm[`majority_activity_of_unit_error`] !== '' ? true : false} />
                                                                        <Label className="tin-form-input-label"> Services 	  {`  `} </Label>
                                                                    </FormGroup>
                                                                </div>
                                                                {renderErrorMessage(`majority_activity_of_unit_error`)}
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 18. National Industrial Classification (NIC) Code for Activities(One or more activities can be added)</Label>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                {renderFormField('text', 'Search NIC Code in Lesser Steps (To Avoid 3 Step Selection of NIC Activities)', 'nic_search_code', 'Search NIC Code', false)}
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '0.55em' }}>
                                                                <div style={{ display: 'flex', paddingLeft: '1em' }}>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="nic_activity" value="Manufacturing" checked={udyamForm["nic_activity"] === 'Manufacturing' ? true : false} onChange={handleValueChange} />
                                                                        <Label className="tin-form-input-label"> Manufacturing	 {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="nic_activity" value="Services" checked={udyamForm["nic_activity"] === 'Services' ? true : false} onChange={handleValueChange} />
                                                                        <Label className="tin-form-input-label"> Services 	  {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="nic_activity" value="Trading" checked={udyamForm["nic_activity"] === 'Trading' ? true : false} onChange={handleValueChange} />
                                                                        <Label className="tin-form-input-label"> Trading 	  {`  `} </Label>
                                                                    </FormGroup>
                                                                </div>
                                                            </Col>
                                                            <Col md='4' style={{ paddingTop: '1em' }}>
                                                                {renderSelectField('select', 'NIC 2 Digit Code', 'nic_2_digit_code', 'Choose 2 Digit NIC Code', [], 'Choose 2 Digit NIC Code')}
                                                            </Col>
                                                            <Col md='4' style={{ paddingTop: '1em' }}>
                                                                {renderSelectField('select', 'NIC 4 Digit Code', 'nic_4_digit_code', 'Choose 4 Digit NIC Code', [], 'Choose 4 Digit NIC Code')}
                                                            </Col>
                                                            <Col md='4' style={{ paddingTop: '1em' }}>
                                                                {renderSelectField('select', 'NIC 5 Digit Code', 'nic_5_digit_code', 'Choose 5 Digit NIC Code', [], 'Choose 5 Digit NIC Code')}
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: 10 }}>
                                                                <Button className="udyam-primary-button" disabled>Add Activity</Button>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1.2em' }}>
                                                                <Label className={"udyam-form-label"}> 19. Number of persons employed </Label>
                                                            </Col>
                                                            <Col md='3' style={{ paddingTop: '1em' }}>
                                                                {renderFormField('text', 'Male', 'no_of_male_persons', 'Example: 20', false)}
                                                            </Col>
                                                            <Col md='3' style={{ paddingTop: '1em' }}>
                                                                {renderFormField('text', 'Female', 'no_of_female_persons', 'Example: 20', false)}
                                                            </Col>
                                                            <Col md='3' style={{ paddingTop: '1em' }}>
                                                                {renderFormField('text', 'Others', 'no_of_other_persons', 'Example: 20', false)}
                                                            </Col>
                                                            <Col md='3' style={{ paddingTop: '1em' }}>
                                                                {renderFormField('text', 'Total', 'total_persons', 'Example: 20', true)}
                                                            </Col>
                                                            <Col md='12'>
                                                                <FormGroup>
                                                                    <Input type="checkbox" name="udyam_reg_tick" checked disabled value={udyamForm["udyam_reg_tick"]} onChange={handleValueChange} style={{ marginRight: 10 }} />
                                                                    <Label className="gst-label bsr-pl-10 bsr-pr-15"> I hereby declare that I am fully aware of the provisions of Child & Adolescent Labour (Prohibition and Regulation) Act, 1986 and no child is employed in my enterprise. </Label>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: 10, paddingLeft: 10 }}>
                                                                <Label className={"udyam-form-label"} style={{ color: 'green' }}>Since you have PAN, your Written Down Value (WDV) & Total Turnover would be auto-filled from your ITR (for ITRs file in ITR-3, 5 & 6 forms) if the same has been filed for the relevant Previous Year; if it has not been filed in that particular previous year, then these boxes may be filled in on self-declaration basis. In case the ITR filed in ITR-4 form, your Total Turnover would be auto-filled but Written Down Value (WDV) would have to be filled in on self decleration basis. If you have GSTIN, you may avail of exports benefits if you have exports declared on the GSTN and it would be auto-filled. It is mandatory to fill in the 2020-21 Previous Year(PY) data for new registration, now since 2021-22 PY ITRs are yet to be filed but, for continuation change and/or classification as per Udyam Registration beyond 31.03.2023 would be effected on the basis of data from ITR of 2021-22 PY ITR.</Label>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1.2em' }}>
                                                                <div><Label className={"udyam-form-label"}> 20. Investment in Plant and Machinery OR Equipment (in Rs.)</Label></div>
                                                                <div><Label className={"udyam-form-label"} style={{ color: '#0056b3', fontSize: 16 }}> Ref. OM dated 06/08/2020 </Label></div>
                                                            </Col>
                                                            <Col md='4' style={{ paddingTop: '1em' }}>
                                                                {renderFormField('text', 'Written Down Value (WDV) as on 31st March of the Previous Year 2020-21 (A)', 'wdv_value', 'Example: 200000.00', false)}
                                                            </Col>
                                                            <Col md='4' style={{ paddingTop: '1em' }}>
                                                                {renderFormField('text', `Exclusion of cost of Pollution Control, Research & Development and Industrial Safety Devices during 2020-21(To be filled in on self-declaration basis) (B)`, 'cost_of_pollution_control', 'Example: 200000.00', false)}
                                                            </Col>
                                                            <Col md='4' style={{ paddingTop: '1em' }}>
                                                                {renderFormField('text', `Net Investment in Plant and Machinery OR Equipment [(A)-(B)]`, 'net_investment_in_plant', 'Example: 2000000.00', false)}
                                                            </Col>
                                                            <Col md='3' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 21. Turnover (in Rs.)</Label>
                                                                <Label className={"udyam-form-label"} style={{ color: '#0056b3', fontSize: 16 }}> Ref. OM dated 06/08/2020 </Label>
                                                            </Col>
                                                            <Col md='3' style={{ paddingTop: '1em' }}>
                                                                {renderFormField('text', 'Total Turnover (A) during 2020-21', 'total_turn_over_a', 'Example: 20', false)}
                                                            </Col>
                                                            <Col md='3' style={{ paddingTop: '1em' }}>
                                                                {renderFormField('text', 'Export Turnover (B) during 2020-21', 'total_turn_over_a', 'Example: 20', true)}
                                                            </Col>
                                                            <Col md='3' style={{ paddingTop: '1em' }}>
                                                                {renderFormField('text', 'Net Turnover [(A)-(B)]', 'net_turnover', 'Example: 20', true)}
                                                            </Col>
                                                            <Col md='8' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 22. Are you interested in getting registered on Government e-Market (GeM) Portal</Label>
                                                                {renderErrorMessage(`interested_in_gem_portal_error`)}
                                                            </Col>
                                                            <Col md='4'>
                                                                <div style={{ display: 'flex' }}>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="interested_in_gem_portal" value="Yes" checked={udyamForm["interested_in_gem_portal"] === 'Yes' ? true : false} onChange={handleValueChange} invalid={udyamErrorForm[`interested_in_gem_portal_error`] !== undefined && udyamErrorForm[`interested_in_gem_portal_error`] !== '' ? true : false} />
                                                                        <Label className="tin-form-input-label"> Yes {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="interested_in_gem_portal" value="No" checked={udyamForm["interested_in_gem_portal"] === 'No' ? true : false} onChange={handleValueChange} invalid={udyamErrorForm[`interested_in_gem_portal_error`] !== undefined && udyamErrorForm[`interested_in_gem_portal_error`] !== '' ? true : false} />
                                                                        <Label className="tin-form-input-label"> No  {`  `} </Label>
                                                                    </FormGroup>
                                                                </div>
                                                            </Col>
                                                            <Col md='8' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 23. Are you interested in getting registered on TReDS Portals(one or more)</Label>
                                                                {renderErrorMessage(`interested_in_treds_portal_error`)}
                                                            </Col>
                                                            <Col md='4'>
                                                                <div style={{ display: 'flex' }}>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="interested_in_treds_portal" value="Yes" checked={udyamForm["interested_in_treds_portal"] === 'Yes' ? true : false} onChange={handleValueChange} invalid={udyamErrorForm[`interested_in_treds_portal_error`] !== undefined && udyamErrorForm[`interested_in_treds_portal_error`] !== '' ? true : false} />
                                                                        <Label className="tin-form-input-label"> Yes {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="interested_in_treds_portal" value="No" checked={udyamForm["interested_in_treds_portal"] === 'No' ? true : false} onChange={handleValueChange} invalid={udyamErrorForm[`interested_in_treds_portal_error`] !== undefined && udyamErrorForm[`interested_in_treds_portal_error`] !== '' ? true : false} />
                                                                        <Label className="tin-form-input-label"> No  {`  `} </Label>
                                                                    </FormGroup>
                                                                </div>
                                                            </Col>
                                                            <Col md='8' style={{ paddingTop: '1em' }}>
                                                                <Label className={"udyam-form-label"}> 24. Are you interested in getting registered on National Career Service(NCS) Portal</Label>
                                                                {renderErrorMessage(`interested_in_ncs_portall_error`)}
                                                            </Col>
                                                            <Col md='4'>
                                                                <div style={{ display: 'flex' }}>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="interested_in_ncs_portal" value="Yes" checked={udyamForm["interested_in_ncs_portal"] === 'Yes' ? true : false} onChange={handleValueChange} invalid={udyamErrorForm[`interested_in_ncs_portal_error`] !== undefined && udyamErrorForm[`interested_in_ncs_portal_error`] !== '' ? true : false} />
                                                                        <Label className="tin-form-input-label"> Yes {`  `} </Label>
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: '1rem' }}>
                                                                        <Input type="radio" name="interested_in_ncs_portal" value="No" checked={udyamForm["interested_in_ncs_portal"] === 'No' ? true : false} onChange={handleValueChange} invalid={udyamErrorForm[`interested_in_ncs_portal_error`] !== undefined && udyamErrorForm[`interested_in_ncs_portal_error`] !== '' ? true : false} />
                                                                        <Label className="tin-form-input-label"> No  {`  `} </Label>
                                                                    </FormGroup>
                                                                </div>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                {renderSelectField('select', '25. District Industries Centre', 'district_industries_centre', 'Choose DIC', [], 'Choose DIC')}
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                <FormGroup>
                                                                    <Input type="checkbox" name="udyam_reg_confirmation" onChange={handleValueChange} style={{ marginRight: 10 }}
                                                                        checked={udyamForm["udyam_reg_confirmation"] === "Yes" ? true : false}
                                                                        invalid={udyamErrorForm[`udyam_reg_confirmation_error`] !== undefined && udyamErrorForm[`udyam_reg_confirmation_error`] !== '' ? true : false}
                                                                        value="Yes" />
                                                                    <Label className="gst-label bsr-pl-10 bsr-pr-15"> I hereby declare that information given above are true to the best of my knowledge. For any information, that may be required to be verified, proof/evidence shall be produced immediately before the concerned authority. </Label>
                                                                    {renderErrorMessage(`udyam_reg_confirmation_error`)}
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md='12' style={{ paddingTop: '1em' }}>
                                                                <Button className="udyam-primary-button" onClick={HandleFinalSubmit}>Submit & Get Final OTP</Button>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </Col>
                                        }
                                    </Row>
                                </section>
                            </div>
                        </div>
                    </div>
                    {/* <Row>
                        <Col md='4'>
                            <div style={{ background: '#FFFFFF', borderRadius: 10, height: '24.5rem', border: '1px solid white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', padding: 10, margin: '10px 0px 10px 15px', overflowY: 'scroll', overflowX: 'hidden', height: '80vh' }} >
                            </div>
                        </Col>
                        <Col md='8' >
                            <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', padding: '10px 0px 10px 0px', margin: '10px 10px 10px 0px', height: '80vh', overflowY: 'scroll', overflowX: 'hidden' }}>
                            </div>
                        </Col>
                    </Row> */}
                </>
            }
            {currentScreen === 'Congratulations' && <Congratulation_page />}
            <div className="bsrFooter ">
                <div style={{ padding: "0.4rem 0rem", width: '100%' }}>
                    <Row>
                        <Row>
                            <Col md={5} className="py-1">
                                <div
                                    className="d-flex gap-4 Bsr_Stl">
                                    <button className=" py-1 clr_btn_blu rounded-pill"><BsFillJournalBookmarkFill className="clr_icn" />&nbsp;Read Theory</button>
                                    <button className=" py-1 clr_btn_blu rounded-pill"><BsClipboardCheck className="clr_icn" />&nbsp;Check Instructions</button>
                                    <button className=" py-1 clr_btn_blu rounded-pill"><img src={videoBs} alt="videoBs" width={18} /> &nbsp;Vedio Tutorials</button>
                                </div>
                            </Col>
                            <Col md={5} />
                            <Col md={2}>
                                <div className="d-flex gap-4" style={{ float: 'right', marginRight: '3rem' }}>
                                    <Button color="primary" onClick={navigateToPrevious} className="bsr-next-button"
                                        disabled={currentScreen === 'About' ? true : false}
                                    >Back</Button>
                                    <Button color="primary" className="bsr-next-button" onClick={navigateToNext}
                                        disabled={isValidationRequired !== undefined && isValidationRequired === false ? false : disableNext} >Next</Button>
                                </div>
                            </Col>
                        </Row>
                    </Row>
                </div>
            </div>
        </>
    )
}
export default UdyamApplication;







export const updateBsrCurrentStatus = (url, company, module, currentScreen) => {
    let bsrDetails = getBSRDetails();
    bsrDetails = {
        ...bsrDetails,
        progress: {
            url,
            company,
            module,
            currentScreen
        }
    }
    console.log('After Update Progress = ', bsrDetails);
    setBSRDetails(bsrDetails);
}









export const getBSRDetails = () => {
    return window.localStorage.bsr_details ? JSON.parse(window.localStorage.bsr_details) : {}
}





export const UDYAM_NEXT_SCREEN = {
  'About': 'Google',
  'Google': 'Registration',
  'Registration': 'Congratulations',
  'Congratulations': 'Completed'
}






//  <Route exact path="/business-setup-registration/:bsrType" element={<PrivateRoute><BusinessSetupAndRegistration /></PrivateRoute>} />