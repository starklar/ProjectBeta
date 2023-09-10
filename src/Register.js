import logo from './Logo.png';
import './Register.css';
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { signUp } from "./AwsAuth"

function Register() {
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: ""
    });

    function handleUsernameUpdate(e) {
        setNewUser({ ...newUser, username: e.target.value });
    }

    function handleEmailUpdate(e) {
        setNewUser({ ...newUser, email: e.target.value });
    }
    
    function handlePasswordUpdate(e) {
        setNewUser({ ...newUser, password: e.target.value });
    }

    const FormValidation = async() => {
        try {
            await signUp(newUser.username, newUser.email, newUser.password)
            localStorage.setItem('Username', newUser.username);
            navigate('/ConfirmRegistration', {replace:true});
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

        navigate('/', {replace:true});
    }

    return (
        <div className="Register">
        <header className="Register-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
            Create an account here.
            </p>
            <form onSubmit={submitAccount}>
            <div>
            <input type = "text"
                name = "username"
                placeholder = "Username"
                onChange={handleUsernameUpdate}
            />
            </div>
            <div>
            <input type="text"
                name = "email_user"
                placeholder = "Email@email.com" 
                onChange={handleEmailUpdate}
            />
            </div>
            <div>
            <input type="password"
                name = "password_user"
                placeholder = "Password" 
                onChange={handlePasswordUpdate}
            />
            </div>
            <button type = "submit">
                Create Account
            </button>
            </form>
            <div>
                <button type = "submit" onClick={redirectToLogin}>Already Have an Account? Login here</button>
            </div>
        </header>
        </div>
    );
}

export default Register;