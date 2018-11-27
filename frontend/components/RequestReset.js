import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!){
        requestReset(email:$email){
            message
        }
    }
`;

class RequestReset extends Component {
    state = {
        email: ''
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = async (e, reset) => {
        e.preventDefault();
        await reset();
        this.setState({ email: '' });
    }

    render() {
        return (
            <Mutation
                mutation={REQUEST_RESET_MUTATION}
                variables={this.state}
            >
                {(reset, { error, loading, called }) => (
                    <Form
                        method="post"
                        onSubmit={e => this.handleSubmit(e, reset)}
                    >
                        <h2>Request a password reset</h2>
                        <Error error={error} />
                        {!error && !loading && called && <p>Success! Check your email for a reset link</p>}
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="email">
                                Email
                                <input type="email" name="email" id="email" value={this.state.value} onChange={this.handleChange} />
                            </label>
                            <button type="submit">Reset password</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        )
    }
}


export default RequestReset
