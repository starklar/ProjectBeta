import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { signOut, getSession } from "./AwsAuth"
import axios from "axios";

function Checkout() {
    const navigate = useNavigate();

    const [boughtItems, setBoughtItems] = useState(false);

    const [gotCart, setGotCart] = useState(false);

    const [gotItems, setGotItems] = useState(false);

    const [items, setItems] = useState([]);

    const [cart, setCart] = useState([]);

    var totalCost = 0;

    const queryForCart = async() =>{
        if(gotCart == false){
            try{
                let session = await getSession();
                await axios.get(
                    'https://ybdifhdaol.execute-api.us-east-2.amazonaws.com/users/' + localStorage.getItem('Username'),
                    {
                        headers: {
                            'authorization': session.accessToken.jwtToken,
                            'Accept' : 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                ).then((res) => {
                    if(gotCart == false){
                        setCart([... cart, ... res.data.cart]);
                        setGotCart(true);
                    }
                });
            }
            catch(error){
                alert("Get Axios error: " + error);
            }
        }
    }

    const getItemList = async() => {
        try{
            let session = await getSession();
            await axios.get(
                'https://ybdifhdaol.execute-api.us-east-2.amazonaws.com/items',
                {
                    headers: {
                        'authorization': session.accessToken.jwtToken,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            ).then((res) => {
                if(gotItems == false){
                    setItems(res.data);
                    setGotItems(true);
                }
            });
        }
        catch(error){
            alert("Get Items Axios error: " + error);
        }
    }

    const updateCartQuery = async(newCart) =>{
        try{
            let session = await getSession();
            await axios.patch(
                'https://ybdifhdaol.execute-api.us-east-2.amazonaws.com/users/' + localStorage.getItem('Username'),
                {
                    username: localStorage.getItem("Username"),
                    cart: newCart
                },
                {
                    headers: {
                        'authorization': session.accessToken.jwtToken,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            ).then(() => {
                setCart(newCart);
            });
        }
        catch(error){
            alert("Update Axios error: " + error);
        }
    }

    function updateTotalCost(){
        if(items.length > 0){
            for(let i = 0; i < cart.length; i++){
                totalCost += items.filter(it => it.id == cart[i].itemID)[0].cost
            }
        }
    }

    const getCart = () =>{
        queryForCart();
    }

    function getItems(){
        getItemList();
    }

    const buy = () =>{
        updateCartQuery([]);
        setBoughtItems(true);
    }

    const removeItem = (cartId) =>{
        queryForCart();

        updateCartQuery(cart.filter((item) => {
            return item.cartID != cartId;
        }));

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

    return (
        <div className="Checkout">
            <header className="Checkout-header">
                YOUR SHOPPING CART
            </header>
            <div>
                <button type = "submit" onClick={logout}>Log Out</button>
            </div>
            { gotCart ?
                <></> : getCart()
            }
            { cart.length > 0 ?
                <>
                    <ul>
                        { gotItems ?
                            cart.map(cartItem => {
                                const currItem = items.filter(it => it.id == cartItem.itemID)[0];
                                return (<li key={cartItem.cartID}>
                                    <img
                                    style = {{width : 100, height : 140}}
                                    src={require("./" + currItem.name + ".jpg")}
                                    />
                                    <p>
                                    <i>{currItem.name}</i>
                                    </p>
                                    <p>
                                    <b>Cost: {currItem.cost}</b>
                                    </p>
                                    <div>
                                        <button type = "submit" onClick={
                                                () => { removeItem(cartItem.cartID); }
                                            }>remove from cart</button>
                                    </div>
                                </li>);
                            }) : getItems()
                        }
                    </ul>
                    <div>
                        {updateTotalCost()}
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
