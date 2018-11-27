import React from 'react';
import ResetPassword from '../components/ResetPassword';

const Reset = props => {
    return (
        <div>
           <ResetPassword resetToken={props.query.resetToken}/>
        </div>
    )
}

export default Reset;