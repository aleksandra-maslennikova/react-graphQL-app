import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

// import formatMoney from '../lib/formatMoney';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id}){
            id
            title
            description 
            price
        }
    }
`

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $title: String,
        $description: String,
        $price: Int,
        $id: ID!
    ){
        updateItem(
            title: $title,
            description: $description,
            price: $price,
            id: $id
        ) {
            id
        }
    }
`

class UpdateItem extends Component {
    state = {}
    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = type === "number" ? parseFloat(value) : value;
        this.setState({ [name]: val })
    };

    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state
            }
        });
        console.log({ res });
    };

    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
                {({ data, loading }) => {
                    if (loading) return <p>Loading...</p>
                    if (!data.item) return <p>No item found for id {this.props.id}</p>
                    return (
                        <Mutation
                            mutation={UPDATE_ITEM_MUTATION}
                            variables={this.state}
                        >{(updateItem, { loading, error }) => (
                            <Form onSubmit={e => this.updateItem(e, updateItem)}>
                                <Error error={error} />
                                <fieldset disabled={loading} aria-busy={loading}>
                                    <label htmlFor="title">
                                        Title
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            placeholder="Title"
                                            defaultValue={data.item.title}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </label>

                                    <label htmlFor="price">
                                        Price
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            placeholder="Price"
                                            defaultValue={data.item.price}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </label>

                                    <label htmlFor="description">
                                        Description
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Enter a description"
                                            defaultValue={data.item.description}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </label>
                                    <button type="submit">Sav{loading ? 'ing' : 'e'} changes</button>
                                </fieldset>
                            </Form>)}
                        </Mutation>
                    )
                }}
            </Query>
        )
    }
}

export default UpdateItem;

export { UPDATE_ITEM_MUTATION };
