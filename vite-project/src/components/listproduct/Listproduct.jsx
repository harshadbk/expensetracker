import React, { useEffect, useState } from 'react'
import remove_icon from '../../assets/remove.jpg'
import './listproduct.css'

const ListProduct = () => {

  const [allTouch, setAllTouch] = useState([]);

  const fetchInfo = async () => {
    await fetch('http://127.0.0.1:5000/gettouch')
      .then((resp) => resp.json())
      .then((data) => { setAllTouch(data) });
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  const removeTouch = async (id) => {
    await fetch('http://127.0.0.1:5000/removetouch', {
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
    <div className='listproduct'>
      <h1>All Get In Touch</h1>
      <br />
      <div className="listproduct-format-main">
        <p>Name</p>
        <p>Email</p>
        <p>Phone</p>
        <p>Subject</p>
        <p>Message</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproduct">
        <hr />
        {allTouch.map((product, index) => {
          return (
            <React.Fragment key={index}>
              <div className="listproduct-format-main listproduct-format">
                <p>{product.name}</p>
                <p>{product.email ? product.email : "None"}</p>
                <p>{product.phone}</p>
                <p>{product.subject}</p>
                <p>{product.message}</p>
                <img onClick={() => { removeTouch(product.id) }} className='listproduct-remove-icon' src={remove_icon} alt="Remove" />
              </div>
              <hr />
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default ListProduct;
