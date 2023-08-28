import { useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserProfile } from './UserProfile';
import { signOut } from "./AwsAuth"

function Products() {
    const navigate = useNavigate();

    const { items } = useContext(UserProfile);

    const buyProduct = (id) =>{
        let newCart = JSON.parse(localStorage.getItem("Cart"));
        let cartId = JSON.parse(localStorage.getItem("CartIdCounter"));

        localStorage.setItem("Cart", JSON.stringify([
            ...newCart,
            {
                cartID: cartId,
                itemID: id
            }

        ]));

        localStorage.setItem("CartIdCounter", cartId + 1);
    }

    function redirectToCheckout(e) {
        e.preventDefault();

        navigate('/Checkout', {replace:true});
    }

    const logout = async() =>{
        localStorage.clear();

        signOut();
        navigate('/', {replace:true});
    }

    function checkAuthentication(e){
        return localStorage.getItem("AccessToken") == null;
    }

    const listItems = items.map(item =>
        <li key={item.id}>
            <img
            style = {{width : 100, height : 140}}
            src={require("./" + item.img)}
            alt=""
            />
            <p>
            <i>{item.name}</i>
            </p>
            <p>
            <b>Price:</b> ${item.price}
            </p>
            <p>
                <b>Description:</b> {item.description}
            </p>
            <div>
                <button type = "submit" onClick={() => buyProduct(item.id)}>BUY NOW!!!!</button>
            </div>
            <p></p>
        </li>
    );

    return (
        <div className="Products">
            <header className="Products-header">
                Welcome. PRODUCTS! BUY NOW!!!
            </header>
            <div>
                <button type = "submit" onClick={logout}>Log Out</button>
            </div>
            <ul>
                {listItems}
            </ul>
            <div>
                <button type = "submit" onClick={redirectToCheckout}>Checkout</button>
            </div>
            { checkAuthentication() ?
                <Navigate to="/" />: <></>
            }
        </div>
    );
}


export default Products;
