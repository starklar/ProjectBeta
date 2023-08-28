import logo from './Logo.png';
import './ConfirmRegistration.css';
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { confirmSignUp } from "./AwsAuth"

function ConfirmRegistration() {
    const navigate = useNavigate();

    const [confirmCode, setConfirmCode] = useState("");
    
    function handleCodeUpdate(e) {
        setConfirmCode(e.target.value);
    }

    const FormValidation = async() => {
        try {
            await confirmSignUp(localStorage.getItem("Username"), confirmCode)
            alert("Success, you may now login with your new account.");
            navigate('/', {replace:true});
        }
        catch (error) {
            alert(error);
        }
    }

    function submitAccount(e) {
        e.preventDefault();

        FormValidation();
    }

    function redirectToLogin(e) {
        e.preventDefault();

        navigate('/');
    }

    function checkAuthentication(e){
        return localStorage.getItem("AccessToken") != null;
  }

    return (
        <div className="ConfirmRegistration">
          <header className="ConfirmRegistration-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Enter in code sent to email to finish sign in process.
            </p>
            <form onSubmit={submitAccount}>
                <div>
                    <input type="text"
                        name = "code"
                        placeholder = "code123" 
                        onChange={handleCodeUpdate}
                    />
                </div>
                <button type = "submit">
                    Submit
                </button>
            </form>
            <div>
                <button type = "submit" onClick={redirectToLogin}>Already Have a verified Account? Login here</button>
            </div>
            </header>
            { checkAuthentication() ?
                <Navigate to="/Products" /> : <></>
            }
        </div>
    );
}

export default ConfirmRegistration;