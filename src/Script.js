import React from 'react';

// api https://api.eniro.com/cs/proximity/basic?profile=Gordon&key=2292880410723272352&country=se&version=1.1.3  eniro
// AIzaSyAi5ki0bCAQqJYp6CQvURDvIE3K_AL0AoM  googleapi


//http://livescore-api.com/api-client/scores/live.json?key=xeP8FJYu62lNnwLx&secret=VpUbom5oVHAXbJaIY0REJQ8QTuDg0oOV


export default class Script extends React.Component {

    render(){
        return(
            <div>
                <p>Sökning via eniro & openweather</p>
                <p>Sök efter företag & få ut temperaturen på området</p>
                <input id="serach_input" className="search-input" type="text" onChange={this.props.inputValue} value={this.props.searchInput}/>
                <button type="button" id="serch_btn" className="search-btn" onClick={this.props.btn}>Sök</button>
                <div>{this.props.returnUl()}</div>
            </div>

        )
    }

}