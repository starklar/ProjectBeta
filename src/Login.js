import logo from './Logo.png';
import './Login.css';
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { signIn, getSession } from "./AwsAuth"

function Login() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    function handleUsernameUpdate(e) {
        setUser({ ...user, username: e.target.value });
    }

    function handlePasswordUpdate(e) {
        setUser({ ...user, password: e.target.value });
    }

    function checkAuthentication(e){
        return localStorage.getItem("AccessToken") != null;
    }

    const FormValidation = async() => {
        try {
            await signIn(user.username, user.password)
            try{
                let session = await getSession();
                localStorage.setItem('AccessToken', JSON.stringify(session.accessToken));
                localStorage.setItem('Username', user.username);
                localStorage.setItem('Cart', "[]");
                localStorage.setItem('CartIdCounter', 0);
                navigate('/Products', {replace:true});
            }
            catch(sessionError){
                alert(sessionError);
            }
        }
        catch (signInError) {
            alert(signInError);
        }
    }

    function submitLogin(e) {
        e.preventDefault();

        FormValidation();
    }

    function redirectToRegister(e) {
        e.preventDefault();

        navigate('/Register', {replace:true});
    }

    return (
        <div className="Login">
            <header className="Login-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Login to your account please.
            </p>
            <form onSubmit={submitLogin}>
                <div>
                <input type = "text"
                name = "username"
                placeholder = "Username"
                onChange={handleUsernameUpdate}
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
                Login
                </button>
            </form>
            <div>
                <button type = "submit" onClick={redirectToRegister}>New? Make an account here.</button>
            </div>
            </header>

            { checkAuthentication() ?
                <Navigate to="/Products" /> : <></>
            }
        </div>
    );
}


export default Login;
