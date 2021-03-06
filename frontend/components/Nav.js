import React, { Fragment } from 'react';
import Link from 'next/link';
import User from './User';
import Signout from './Signout';
import NavStyles from './styles/NavStyles';


const Nav = () => {
    return (
        <User>{({ data: { me } }) => (
            <NavStyles>
                <Link href="/items">
                    <a>Shop</a>
                </Link>
                {
                    me ? (
                        <Fragment>
                            <Link href="/sell">
                                <a>Sell</a>
                            </Link>

                            <Link href="/orders">
                                <a>Orders</a>
                            </Link>
                            <Link href="/me">
                                <a>Account</a>
                            </Link>
                            <Signout />
                        </Fragment>
                    ) : (
                            <Link href="/signup">
                                <a>Signup</a>
                            </Link>
                        )
                }
            </NavStyles>
        )}</User>
    )
}

export default Nav;