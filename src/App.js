import React, {Component} from 'react';
import './App.css';
import Script from "./Script";
import GithubLogin from "./githubLogin";
import * as firebase from 'firebase';

class App extends Component {


    constructor(props) {
        super(props);
        this.state = {
            temp: [],
            eniroObjects: [
                {
                    name: '',
                    postArea: ''
                }
            ],
            searchInput: '',
            favorites: []
        };

        let config = {
            apiKey: "AIzaSyA930moeZzCRNqF7c7x0novuo674LKkhS8",
            authDomain: "fir-ajax-react-projekt.firebaseapp.com",
            databaseURL: "https://fir-ajax-react-projekt.firebaseio.com",
            projectId: "fir-ajax-react-projekt",
            storageBucket: "fir-ajax-react-projekt.appspot.com",
            messagingSenderId: "792291248306"
        };


        firebase.initializeApp(config);

        this.inputValue = this.inputValue.bind(this);
        this.getWeather = this.getWeather.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.getLocationAndWeather = this.getLocationAndWeather.bind(this);
        this.returnUl = this.returnUl.bind(this);
        this.loginWithGithub = this.loginWithGithub.bind(this);
        this.showLogOut = this.showLogOut.bind(this);
        this.returnFav = this.returnFav.bind(this);
    }

    componentDidMount() {
        this.returnFav();
    }

    loginWithGithub() {

        let login_btn = document.getElementById('gh_btn');
        login_btn.style.visibility = 'hidden';

        let logout_btn = document.getElementById('gh_btn_out');
        logout_btn.style.visibility = 'visible';

        let provider = new firebase.auth.GithubAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            let token = result.credential.accessToken;
            // The signed-in user info.
            let user = result.user;
            this.setState({
                auth: true
            });
            console.log('inloggad');
            console.log(user);

            // ...

        }).catch(function (error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // The email of the user's account used.
            let email = error.email;
            // The firebase.auth.AuthCredential type that was used
            let credential = error.credential;
            // ...
        });


    }

    showLogOut() {
        let login_btn = document.getElementById('gh_btn');
        login_btn.style.visibility = 'visible';

        let logout_btn = document.getElementById('gh_btn_out');
        logout_btn.style.visibility = 'hidden';

        firebase.auth().signOut().then(function () {
            console.log('utloggad');
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.
        });
    }

    inputValue(event) {
        this.setState({searchInput: event.target.value})
    }

    getLocation() {
        let ul_list = document.getElementById('result_ul');
        ul_list.innerHTML = "";

        let inputValue = this.state.searchInput;


        let url = 'https://api.eniro.com/cs/search/basic?profile=Gordon&key=2292880410723272352&country=se&version=1.1.3&search_word=' + inputValue;
        fetch(url)
            .then(response => response.json())
            .then(json => {
                // console.log('func getLocation json',json);
                let newObjectsList = [];
                for (let obj in json.adverts) {
                    console.log('inside forloop getLocation');

                    let object = {
                        name: json.adverts[obj].companyInfo.companyName,
                        postArea: json.adverts[obj].address.postArea
                        //todo phoneNr?
                    };
                    newObjectsList.push(object);
                }

                this.setState({
                        eniroObjects: newObjectsList
                    },
                    () => {
                        this.getWeather();
                    });
            });
    }

    getWeather() {
        for (let areaObj in this.state.eniroObjects) {

            let areaString = this.state.eniroObjects[areaObj].postArea;
            let areaName = this.state.eniroObjects[areaObj].name;
            console.log('areaString=', areaString, 'enirobj=', this.state.eniroObjects);

            let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + areaString + '&appid=2595fb7107f846f987d02a10a692056d&units=metric&lang=sv';

            fetch(url)
                .then(response => response.json())
                .then(json => {
                    // console.log('func getWeater json',json);

                    let newList = this.state.temp;
                    let newObject = {
                        name: areaName,
                        area: areaString,
                        temp_max: json.main.temp_max,
                        temp_min: json.main.temp_min,
                        temp_now: json.main.temp
                    };
                    newList.push(newObject);
                    this.setState({
                        temp: newList
                    }, () => {
                        console.log('this.state.temp=', this.state.temp, 'this.state.eniroObj.postArea=', this.state.eniroObjects[areaObj].postArea);
                    });
                })
        }
    }

    getLocationAndWeather() {
        this.getLocation();

    }

    addToFavorites = event => {
        let parentElement = event.target.parentNode;
        let locationData = {
            locationName: parentElement.childNodes[0].innerText,
            tempNow: parentElement.childNodes[4].innerText,
            maxTemp: parentElement.childNodes[12].innerText,
            minTemp: parentElement.childNodes[20].innerText
        };
        let database = firebase.database();
        firebase.database().ref('locations').push(locationData);
        this.returnFav()
    };

    returnUl() {

        let finalObj = this.state.temp;
        let finalObjList = finalObj.map((obj, i) => <li className="search_result_li" key={i}>
            <span> {obj.name} - {obj.area} <br/></span>
            Temp nu: <span>{obj.temp_now}</span> <br/>
            Max-Temp: <span>{obj.temp_max}</span> <br/>
            Min-Temp: <span>{obj.temp_min}</span>
            <span className="block" onClick={this.addToFavorites}>Add to favorites</span>
        </li>);

        return <ul id="result_ul">{finalObjList}</ul>;
    }

    returnFav() {
        let that = this;
        let allFavorites = [];
        firebase.database().ref('/locations').once('value').then(function (snapshot) {
            console.log(snapshot.val())
            let data = snapshot.val();
            for (let obj in data) {
                console.log(data[obj], obj)
                let currentData = {
                    locationName: data[obj].locationName,
                    maxTemp: data[obj].maxTemp,
                    minTemp: data[obj].minTemp,
                    tempNow: data[obj].tempNow,
                    id: obj,
                };
                allFavorites.push(currentData);
            }
            that.setState({
                favorites: allFavorites
            })
        });

        this.removeFromFavorites = event => {
            let that = this;
            let locationId = event.target.parentNode.getAttribute('data-id');
            firebase.database().ref('locations/' + locationId).remove().then(function () {
                that.returnFav()
            });
        };

        this.toggleEditingMode = (id, location) => {
            this.setState({
                editing: id,
                editingValue: location
            })
        };

        this.updateTitle = (id) => {
            firebase.database().ref('locations/' + id).update({
                locationName: this.state.editingValue
            }).then(() => {
                this.returnFav();
                this.setState({
                    editing: "",
                    editingValue: ""
                })
            })
        }
    }


    render() {
        return (
            <div className="App">
                <GithubLogin gh_button={this.loginWithGithub} gh_button_out={this.showLogOut}/>
                <Script btn={this.getLocationAndWeather} inputValue={this.inputValue} returnUl={this.returnUl}/>
                <ul className="favorites">
                    {this.state.favorites.map((obj, i) => {
                        return (
                            <li key={i} data-id={obj.id}>
                                <span
                                    onClick={() => this.toggleEditingMode(obj.id, obj.locationName)}> {obj.locationName} (Klicka här för att byta namn)<br/></span>
                                {this.state.editing === obj.id &&
                                <div>
                                    <input type="text" onChange={(event) => this.setState({editingValue: event.target.value})}
                                           value={this.state.editingValue}/>
                                    <button onClick={() => this.updateTitle(obj.id)}>Uppdatera namn</button>
                                </div>}
                                Temp nu: <span>{obj.tempNow}</span> <br/>
                                Max-Temp: <span>{obj.maxTemp}</span> <br/>
                                Min-Temp: <span>{obj.minTemp}</span>
                                <span className="block" onClick={this.removeFromFavorites}>Remove from favorites</span>
                            </li>);
                    })}
                </ul>
            </div>
        );
    }
}

export default App;
