import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div> <div className="head">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/user">Navbar</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
                <Link to="/user" className="nav-item nav-link" >Home</Link>
                <Link to="/product" className="nav-item nav-link" >Product</Link>
                <Link to="/category" className="nav-item nav-link">Category</Link>
            </div>
        </div>
    </nav>
</div></div>
  )
}

export default Header