import React from 'react';
import { Redirect } from "react-router";
import PropTypes from 'prop-types';

export default class Redirection extends React.Component {
    render() {
        if(this.props.redirect)
            return <Redirect to={this.props.to} push={this.props.push} />

        return <></>;
    }
}

Redirection.propTypes = {
    redirect: PropTypes.bool,
    to: PropTypes.string.isRequired,
    push: PropTypes.bool
}