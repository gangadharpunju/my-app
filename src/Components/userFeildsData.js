export const contact_Feilds = {
    Reigister_User: {
      title: "Reigister",
      reigister_feilds: [
        {
          name: "user_name",
          label: "User Name",
          type: "text",
          disabled: false,
          isDisableForESI: false,
          isDisableForPF: false,
          isRequiredForPF: true,
          isRequiredForESI: true
        },
        {
          name: "user_email",
          label: "Email",
          type: "text",
          disabled: false,
          isDisableForESI: false,
          isDisableForPF: false,
          isRequiredForPF: false,
          isRequiredForESI: true
        },
        {
          name: "user_mobile",
          label: "Mobile",
          type: "text",
          disabled: false,
          isDisableForESI: false,
          isDisableForPF: false,
          isRequiredForPF: true,
          isRequiredForESI: true
        },
        {
          name: "user_password",
          label: "Password",
          type: "password",
          disabled: false,
          isDisableForESI: false,
          isDisableForPF: false,
          isRequiredForPF: true,
          isRequiredForESI: true
        }
      ]
    },
    login_User: {
      title: "Login",
      reigister_feilds: [
       
        {
          name: "user_email",
          label: "Email",
          type: "text",
          disabled: false,
          isDisableForESI: false,
          isDisableForPF: false,
          isRequiredForPF: false,
          isRequiredForESI: true
        },
       
        {
          name: "user_password",
          label: "Password",
          type: "password",
          disabled: false,
          isDisableForESI: false,
          isDisableForPF: false,
          isRequiredForPF: true,
          isRequiredForESI: true
        }
      ]
    }
  };
  export const ED_MANDATORY_FIELDS = [
    "user_name",
    "user_email",
    "user_mobile",
    "user_password",
    // "login_email",
    // "password"
  ];
  export const Login_MANDATORY_FIELDS = [
    
    "login_email",
    "password"
  ];
  