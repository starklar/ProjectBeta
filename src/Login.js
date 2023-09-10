import logo from './Logo.png';
import './Login.css';
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { signIn, getSession } from "./AwsAuth"
import axios from "axios";

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

    const FormValidation = async() => {
        try {
            await signIn(user.username, user.password)
            try{
                let session = await getSession();
                try{
                    const params = {username: user.username, cart: []};
                    await axios.post(
                        'https://ybdifhdaol.execute-api.us-east-2.amazonaws.com/users',
                        params,
                        {
                            headers: {
                                'authorization': session.accessToken.jwtToken,
                                'Accept' : 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                    .then(() => {
                        localStorage.setItem('Username', user.username);
                        navigate('/Products', {replace:true});
                    });
                }
                catch(error){
                    alert("Axios error: " + error);
                }
            }
            catch(sessionError){
                alert("Session error: " + sessionError);
            }
        }
        catch (signInError) {
            alert("Sign in error: " + signInError);
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
        </div>
    );
}


export default Login;
