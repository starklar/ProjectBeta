import { useContext, useState } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import { UserProfile } from './UserProfile';
import { useCookies } from 'react-cookie';
import { signOut } from "./AwsAuth"

function Checkout() {
    const navigate = useNavigate();

    const {items} = useContext(UserProfile)

    const [boughtItems, setBoughtItems] = useState(false);

    const totalCost = JSON.parse(localStorage.getItem("Cart")).reduce((acc, current) => acc + items[current.itemID].price, 0);

    const buy = () =>{
        localStorage.setItem("Cart", "[]");
        localStorage.setItem("CartIdCounter", 0);
        setBoughtItems(true);
    }

    const removeItem = (cartId) =>{
        let cart = JSON.parse(localStorage.getItem("Cart")).filter((item) => {
                return item.cartID != cartId;
            });

        localStorage.setItem("Cart", JSON.stringify(cart));

        navigate('/Checkout', {replace:true});
    }

    const logout = async() =>{
        localStorage.clear();

        signOut();
        navigate('/', {replace:true});
    }

    function redirectToProducts(e) {
        e.preventDefault();

        navigate('/Products', {replace:true});
    }

    const listCartItems = JSON.parse(localStorage.getItem("Cart")).map(cartItem =>
        <li key={items[cartItem.itemID]}>
            <img
            style = {{width : 100, height : 140}}
            src={require("./" + items[cartItem.itemID].img)}
            />
            <p>
            <i>{items[cartItem.itemID].name}</i>
            </p>
            <p>
            <b>Price: {items[cartItem.itemID].price}</b>
            </p>
            <div>
                <button type = "submit" onClick={
                        () => { removeItem(cartItem.cartID); }
                    }>remove from cart</button>
            </div>
            <p></p>
        </li>
    );

    function checkAuthentication(e){
        return localStorage.getItem("AccessToken") == null;
    }

    return (
        <div className="Checkout">
            <header className="Checkout-header">
                YOUR SHOPPING CART
            </header>
            <div>
                { checkAuthentication() ?
                    <Navigate to="/" /> : <button type = "submit" onClick={logout}>Log Out</button>
                }
            </div>
            { JSON.parse(localStorage.getItem("Cart")).length > 0 ?
                <>
                    <ul>
                        {listCartItems}
                    </ul>
                    <div>
                        <p>Total cost: $ {totalCost} </p>
                        <button type = "submit" onClick={buy}>BUY!!!</button>
                    </div>
                </>
                :
                <>
                { boughtItems ?
                    <p>Thanks for buying.</p>
                    :
                    <p>You have nothing in your cart.</p>
                }
                </>
            }
            <div>
                <button type = "submit" onClick={redirectToProducts}>FIND MORE ITEMS</button>
            </div>
        </div>
    );
}


export default Checkout;
