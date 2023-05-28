import { FormGroup, Input, Label, Card, FormFeedback } from "reactstrap";
import { useContext, useEffect, useState } from "react";
import { contact_Feilds, ED_MANDATORY_FIELDS } from "../Components/userFeildsData.js";
import feilderrors from "../Components/feilderrors.json";
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { getBy_data, userContext } from "./useContext.js";
// import { userContextProvide } from "./useContext.js";
export default function UserRegister() {
  const [formFeilds, setFormFeilds] = useState(contact_Feilds.Reigister_User);
  const data = formFeilds.reigister_feilds;
  const navigate = useNavigate();
  const [feildValue, setFeildValue] = useState({});
  const [stored_Data, setStored_Data] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [user, setUser] = useState({})
  const [passShow, setPassShow] = useState(false)




  const hasValue = (value) => {
    return value !== undefined && value !== "";
  };
  const handlePassword = () => {
    setPassShow(!passShow)
    console.log("Password")
  }
  const data_Usecontext = useContext(userContext)
  // console.log("data_Usecontext...",data_Usecontext)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeildValue({
      ...feildValue,
      [name]: value
    });
  };
  const isMatchedDetails = (inputValue, mockValue) => {
    if (
      inputValue &&
      mockValue &&
      inputValue !== mockValue
    ) {
      return true;
    }
    return false;
  }
  const validateNavigate = (mandatoryFieldsList) => {
    setErrorMessage({});
    let errObj = {};
    mandatoryFieldsList.map((key) => {
      if (!hasValue(feildValue[key])) {
        let name = `${key}_error`;
        errObj = {
          ...errObj,
          [name]: feilderrors[key]
        };
        return;
      } else {
        setFeildValue({
          ...feildValue
        })
      }
    });
    if (Object.keys(errObj).length > 0) {
      setErrorMessage({
        ...errObj
      });
    } else {
      navigate('/home')
    }
  };
  const handleSubmit = (isNext) => {
    if (!isNext) {
      validateNavigate(ED_MANDATORY_FIELDS);
      let get_data = localStorage.getItem('user')
      if (!get_data) {
        return setFeildValue({})
      }
      // console.log("obj_data....", get_data)
      let stored_data = JSON.parse(get_data)
      // getBy_data(stored_data)
      setStored_Data(stored_data)
      // navigate('/home')
    }
  };
  // console.log("storedData...", stored_Data)
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(feildValue))
  }, [feildValue])
  const renderErrorMessage = (feild) => {
    return (
      errorMessage[feild] !== undefined &&
      errorMessage[feild] !== "" && (
        <FormFeedback>
          <p>{errorMessage[feild]}</p>
        </FormFeedback>
      )
    );
  };
  // console.log("userDetails..", feildValue)
  return (
    <>
      <div className="d-flex justify-content-center w-100 mt-5">
        <Card className="p-3 m-3 shadow w-50 border-2 border-info border">
          <h5 className="text-center">{formFeilds.title}</h5>
          <div>
            {data.map((feilds, i) => {
              // console.log("first,feil", feilds.name)
              // if (feilds.name === 'user_password') {
              //  return;
              // }
              return (
                <>
                  <FormGroup>
                    <Label>{feilds.label}</Label>
                    <Input
                      type={feilds.type === "password" ? passShow : !passShow}
                      name={feilds.name}
                      onChange={handleChange}
                      value={feildValue[feilds.name]}
                      invalid={
                        errorMessage[`${feilds.name}_error`] !== undefined &&
                          errorMessage[`${feilds.name}_error`] !== ""
                          ? true
                          : false
                      }
                      disabled={
                        (true && feilds.isDisableForESI) ||
                        (true && feilds.isDisableForPF)
                      }
                    />
                    {renderErrorMessage(`${feilds.name}_error`)}
                  </FormGroup>
                </>
              );
            })}
            <Button className="shadow border " size="small" onClick={handlePassword}>{passShow ? "Hide" : "Show"}</Button>
            <div className="d-flex align-items-center justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => handleSubmit(false)}
              >
                Reigister
              </button>
              <Link to='/login' className="ms-5">already have an account</Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
