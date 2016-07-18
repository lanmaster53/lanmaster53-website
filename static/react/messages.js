var MessagesComponent = React.createClass({
    getInitialState() {
        return { messages: [] };
    },
    handleUserSubmit(user) {
        axios.get(
            "http://restmail.net/mail/"+user
        )
        .then(function(response) {
            this.setState({ messages: response.data });
        }.bind(this))
        .catch(function (error) {
            console.log(error);
        });
    },
    handleMailDelete(user) {
        axios.delete(
            "http://restmail.net/mail/"+user
        )
        .then(function(response) {
            this.setState({ messages: [] });
        }.bind(this))
        .catch(function (error) {
            console.log(error);
        });
    },
    render() {
        return (
            <div>
                <UserForm
                    onUserSubmit={this.handleUserSubmit}
                    onMailDelete={this.handleMailDelete}
                />
                <MessageList
                    messages={this.state.messages}
                    onMailDelete={this.handleMailDelete}
                />
            </div>
        );
    }
});

var UserForm = React.createClass({
    getInitialState() {
        return { user: "" };
    },
    handleFormSubmit(e) {
        e.preventDefault();
        if (this.props.onUserSubmit) {
            this.props.onUserSubmit(this.state.user);
        }
    },
    handleDeleteClick(e) {
        e.preventDefault();
        if (this.props.onMailDelete) {
            this.props.onMailDelete(this.state.user);
        }
    },
    onChange() {
        this.setState({ user: this.refs.inputElement.value });
    },
    render() {
        return (
            <div className="center-content">
                <form onSubmit={this.handleFormSubmit}>
                    <input
                        ref="inputElement"
                        type="text"
                        value={this.state.message}
                        placeholder="username"
                        onChange={this.onChange}
                    />
                    <input
                        type="submit"
                        value="get"
                    />
                    <input
                        type="button"
                        value="delete"
                        onClick={this.handleDeleteClick}
                    />
                </form>
            </div>
        );
    }
});

var MessageList = React.createClass({
    render() {
        let meat = <div className="center-content">
                        <p>no messages</p>
                    </div>;
        if (this.props.messages.length > 0) {
            meat = this.props.messages.map(
                        function(message, i) {
                            return (
                                <Message
                                    message={message}
                                    key={'1-'+i}
                                />
                            );
                        }, this
                    )
        }
        return (
            <div className="message-list">
                {meat}
            </div>
        );
    }
});

var Message = React.createClass({
    getMessageHTML(html) {
        var data = btoa(unescape(encodeURIComponent(html)));
        return "data:text/html;base64,"+data
    },
    render() {
        return (
            <div className="message">
                <hr/>
                <div>From: {this.props.message.from[0].name} &lt;{this.props.message.from[0].address}&gt;</div>
                <div>Time: {this.props.message.receivedAt}</div>
                <div>Subject: {this.props.message.subject}</div>
                <div>
                    <iframe
                        src={this.getMessageHTML(this.props.message.html)}
                        className="u-full-width"
                    />
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <MessagesComponent />,
    document.getElementById("react-container")
);
