import { FormGroup, Input, Label, Card, FormFeedback } from "reactstrap";
import { useContext, useState } from "react";
import { contact_Feilds, ED_MANDATORY_FIELDS } from "../Components/userFeildsData.js";
import feilderrors from "../Components/feilderrors.json";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { getBy_data, userContext } from "./useContext.js";
export default function UserRegister() {
  const [formFeilds, setFormFeilds] = useState(contact_Feilds.login_User);
  const data = formFeilds.reigister_feilds;
  const navigate = useNavigate();
  const [feildValue, setFeildValue] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [user, setUser] = useState({})
  const [passShow, setPassShow] = useState(false)

  let data_storage = localStorage.getItem("user")
  let stored_data = JSON.parse(data_storage)
  // console.log("data_storage..", stored_data.user_name)
  const hasValue = (value) => {
    return value !== undefined && value !== "";
  };

  const handlePassword = () => {

    setPassShow(!passShow)
    console.log("Password")
  }

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
 
  var mock_data = {
    'user_email': stored_data.user_email,
    'user_password': stored_data.user_password,

  }
  const validateNavigate = (mandatoryFieldsList) => {

    let mock = mock_data
   

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
        let mockvalue = mock[key]
        // console.log("mockvalue..", mockvalue)
        if (isMatchedDetails(feildValue[key], mockvalue)) {
          errObj[`${key}_error`] = 'Please Enter Correct Value'
        }

      }
    });
    if (Object.keys(errObj).length > 2) {
      setErrorMessage({
        ...errObj
      });
      setUser({ ...mock })
      console.log("if")
  
    } else {
      navigate("/home");
      console.log("else..")
    }
  };

  const handleSubmit = (isNext) => {
    if (!isNext) {
      validateNavigate(ED_MANDATORY_FIELDS);
    }
  };
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

  // console.log("userDetails..", user)
  const AutofillClick = () => {
    // console.log("first")
    setFeildValue({
      'user_email': stored_data.user_email,
      // 'user_email': 'gangadhar@123',
      // 'user_mobile': '9493990783',
      'user_password': stored_data.user_password,
    })
  }
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
                      type={passShow ? "password" : "text"}
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
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => handleSubmit(false)}
              >
                Login
              </button>
              <Button
                variant="contained"
                className="btn btn-primary ms-3"
                onClick={AutofillClick}
              >
                Autofill
              </Button>
            </div>
          </div>
        </Card>
        <Card className="w-25 p-3 m-3 shadow h-25 border-2 border-warning border">

          {Object.values(mock_data).map((u, i) => {
            // console.log("uuuuuu",u)
            return (
              <h5 className="fw-bold ms-5 shadow p-1" key={i}> {u}</h5>
            );
          })}
        </Card>
      </div>
    </>
  );
}
