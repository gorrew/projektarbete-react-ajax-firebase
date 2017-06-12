import React from 'react';

export default class GithubLogin extends React.Component {
    render(){
        return(
            <div>
                <button type="button" id="gh_btn" className="gh-btn" onClick={this.props.gh_button}>Login</button>
                <button type="button" id="gh_btn_out" className="gh-btn-out" onClick={this.props.gh_button_out}>sign out</button>
            </div>

        )
    }
}