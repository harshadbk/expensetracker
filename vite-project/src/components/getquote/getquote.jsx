import React, { useEffect, useState } from 'react'
import remove_icon from '../../assets/remove.jpg'
import './getquote.css'

const GetQuote = () => {

    const [allQuote, setAllQuote] = useState([]);

    const fetchInfo = async () => {
        await fetch('http://127.0.0.1:5000/allquote')
            .then((resp) => resp.json())
            .then((data) => { setAllQuote(data) });
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    const removeTouch = async (id) => {
        await fetch('http://0.0.0.0/0:5000/removequote', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
        await fetchInfo();
    }

    return (
        <div className='listproducts'>
            <h1>All Quotes</h1>
            <br />
            <div className="listproducts-format-main">
                <p>Name</p>
                <p>Company</p>
                <p>Email</p>
                <p>Phone</p>
                <p>Services</p>
                <p>Budget</p>
                <p>Timeline</p>
                <p>Created At</p>
                <p>Description</p>
                <p>Remove</p>
            </div>
            <div className="listproducts-allproduct">
                <hr />
                {allQuote.map((product, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div className="listproducts-format-main listproduct-format">
                                <p>{product.name}</p>
                                <p>{product.company}</p>
                                <p>{product.email ? product.email : "None"}</p>
                                <p>{product.phone}</p>
                                <p>{product.services}</p>
                                <p>{product.budget}</p>
                                <p>{product.timeline}</p>
                                <p>
                                    {new Date(product.createdAt).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </p>

                                <p>{product.description}</p>
                                <img onClick={() => { removeTouch(product.id) }} className='listproducts-remove-icon' src={remove_icon} alt="Remove" />
                            </div>
                            <hr />
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default GetQuote;