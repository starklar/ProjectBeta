import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { signOut, getSession } from "./AwsAuth"
import axios from "axios";

function Products() {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);

    const [gotItems, setGotItems] = useState(false);
    
    const getCart = async(id) => {
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
                let cartId = 0;
        
                if(res.data.cart.length > 0){
                    cartId = res.data.cart[res.data.cart.length - 1].cartID + 1;
                }

                let newCart = [
                    ...res.data.cart,
                    {
                        cartID: cartId,
                        itemID: id
                    }
                ];

                updateCart(newCart);
            });
        }
        catch(error){
            alert("Get Axios error: " + error);
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

    function getItems(){
        getItemList();
    }

    const updateCart = async(updatedCart) => {
        try{
            let session = await getSession();
            await axios.patch(
                'https://ybdifhdaol.execute-api.us-east-2.amazonaws.com/users/' + localStorage.getItem('Username'),
                {
                    username: localStorage.getItem("Username"),
                    cart: updatedCart
                },
                {
                    headers: {
                        'authorization': session.accessToken.jwtToken,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
        }
        catch(error){
            alert("Update Axios error: " + error);
        }
    }

    const addToCart = (id) =>{
        getCart(id);
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

    const listItems = items.map(item =>
        <li key={item.id}>
            <img
            style = {{width : 100, height : 140}}
            src={require("./" + item.name + ".jpg")}
            alt=""
            />
            <p>
            <i>{item.name}</i>
            </p>
            <p>
            <b>Cost:</b> ${item.cost}
            </p>
            <p>
                <b>Description:</b> {item.description}
            </p>
            <div>
                <button type = "submit" onClick={() => addToCart(item.id)}>BUY NOW!!!!</button>
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
                { gotItems ?
                    listItems : getItems()
                }
            </ul>
            <div>
                <button type = "submit" onClick={redirectToCheckout}>Checkout</button>
            </div>
        </div>
    );
}


export default Products;
