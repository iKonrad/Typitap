import React from 'react';
import Autosuggest from 'react-autosuggest';
import {connect} from 'react-redux';
import Gravatar from 'components/user/Gravatar';
import {push} from 'react-router-redux';
import * as JsUtils from 'utils/jsUtils';

function getSuggestionValue(suggestion) {
    return suggestion.name;
}

function renderSuggestion(suggestion) {
    return (
        <span>
            <div className="suggestion-icon">
                <Gravatar email={ suggestion.email } size={40}/>
            </div>
            <div className="suggestion-user">
                <div className="suggestion-user__name">{ suggestion.name }</div>
                <div className="suggestion-user__username">#{ suggestion.username }</div>
            </div>
        </span>
    );
}

class UserSearch extends React.Component {

    /**
     * Constructor
     */
    constructor() {
        super();
        this.state = {
            value: '',
            suggestions: [],
            isLoading: false
        };
        this.lastRequestId = null;
    }

    /**
     * Schedule ajax request with timeout so the search gets performed after a delay
     * @param value
     */
    loadSuggestions({value}) {
        // Cancel the previous request
        if (this.lastRequestId !== null) {
            clearTimeout(this.lastRequestId);
        }

        this.setState({
            isLoading: true,
            suggestions: [],
        });

        this.lastRequestId = setTimeout(() => {
            this.fetchMatchingUsers(value)
        }, 600);
    }


    /**
     * Perform an ajax request to the server to fetch suggestions based on the provided query
     * @param value
     * @returns {Array}
     */
    fetchMatchingUsers(value) {
        const escapedValue = JsUtils.escapeRegexCharacters(value.trim());

        if (escapedValue === '') {
            return [];
        }
        let that = this;
        fetch(`/api/user/search/${value}`, {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                that.setState({
                    isLoading: false,
                    suggestions: response.data,
                });
            }
        });
    }

    /**
     * Handle clicking on the result (go to user profile)
     * @param event
     * @param data
     */
    onUserSelected(event, data) {
        this.props.dispatch(push('/u/' + data.suggestion.username));
    }

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({value}) => {
        this.loadSuggestions(value);
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };


    /**
     * Only perform the search if word has 3 or more characters
     * @param value
     * @returns {boolean}
     */
    shouldRenderSuggestions(value) {
        return value.trim().length > 2;
    }

    render() {
        const {value, suggestions, isLoading} = this.state;
        const inputProps = {
            placeholder: "Search...",
            value,
            onChange: this.onChange,
            className: `form-control ${ isLoading ? "form-control--loading" : "" }`,
        };

        return (
            <div>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.loadSuggestions.bind(this)}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={ this.onUserSelected.bind(this) }
                    shouldRenderSuggestions={ this.shouldRenderSuggestions }
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
};

export default connect(mapStateToProps)(UserSearch);