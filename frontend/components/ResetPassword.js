import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';


const RESET_PASSWORD_MUTATION = gql`
    mutation RESET_PASSWORD_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!){
        resetPassword(resetToken:$resetToken, password: $password, confirmPassword: $confirmPassword){
            id,
            email
        }
    }
`;

class ResetPassword extends Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired
    }

    state = {
        password: '',
        confirmPassword: ''
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = async (e, resetPassword) => {
        e.preventDefault();
        await resetPassword();
        this.setState({ password: '', confirmPassword: '' });
    }

    render() {
        return (
            <Mutation
                mutation={RESET_PASSWORD_MUTATION}
                variables={{
                    resetToken: this.props.resetToken,
                    ...this.state
                }}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(resetPassword, { error, loading }) => (
                    <Form
                        method="post"
                        onSubmit={e => this.handleSubmit(e, resetPassword)}
                    >
                        <h2>Enter new password</h2>
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="password">
                                New password
                                <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
                            </label>
                            <label htmlFor="confirmPassword">
                                Confirm new password
                                <input type="password" name="confirmPassword" id="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} />
                            </label>
                            <button type="submit">Reset password</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        )
    }
}


export default ResetPassword
