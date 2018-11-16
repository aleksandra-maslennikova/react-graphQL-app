import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY {
        items {
            id
            title,
            price,
            description,
            image,
            largeImage
        }
    }
`

export default class Items extends Component {
    render() {
        return (
            <div>
                <Query query={ALL_ITEMS_QUERY}>
                    {({ data, error, loading }) => {
                        if (loading) return <div>Loading...</div>
                        if (error) return <div>Error: {error}</div>
                        return <h1>Hello, I found {data.items.length} items</h1>
                    }}
                </Query>
            </div>
        )
    }
}
