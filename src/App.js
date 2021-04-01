import React, { Component } from 'react';
import './App.css';

class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      newTask: '',
      list: []
    };
  }

  // incorporate local storage aka fake backend
  // Local Storage is a Web API native to modern web browsers
  // this will make the data available in future browser sessions
  componentDidMount(){
    this.hydrateStateWithLocalStorage();

    // save state to localStorage by adding an event listener
    // data will persist beyond the current session
    window.addEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    );
  }

  componentWillUnmount(){
    window.removeEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has a chance to unmout
    this.saveStateToLocalStorage();
  }

  hydrateStateWithLocalStorage(){
    // iterate over all items
    for (let key in this.state){
      // search for the key
      if (localStorage.hasOwnProperty(key)){
        // store the key's value from localStorage in a variable
        let value = localStorage.getTask(key);

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  saveStateToLocalStorage(){
    // iterate over all React state tasks:
    for (let key in this.state){
      // saving to localStorage:
      localStorage.setTask(key, JSON.stringify(this.state[key]));
    }
  }

  updateInput(key, value){
    // update react state:
    this.setState({ [key]: value });
  }

  addTask(){
    // create a new task with a unique ID:
    const newTask = {
      id: 1 + Math.random(),
      value: this.state.newTask.slice()
    };
    
    // copy of the current list of tasks (use spread operator):
    const list = [...this.state.list];

    // add a new task to this list:
    list.push(newTask);

    // update state with new list and reset newTask input:
    this.setState({
      list,
      newTask: ''
    });
  }

  deleteTask(id){
    // copy current list of tasks:
    const list = [...this.state.list];

    // filter out task to be deleted:
    const updatedList = list.filter(task => task.id !== id);

    this.setState({ list: updatedList });
  }

  render(){
    return (
      <div>

        <h1 className = 'app-title'>TODAY'S PRIORITIES</h1>

        <div className='container'>
        <div 
          style = {{
            padding: 30
          }}
          >
            It's a beautiful day for ...
            <br />
            <input 
              type = 'text'
              placeholder = 'Type a task here...'
              value = { this.state.newTask }
              onChange = { e => this.updateInput('newTask', e.target.value) }
              />
          <button className = 'add-btn btn-floating'
            onClick = { () => this.addTask() }
            disabled = { !this.state.newTask.length }
          >
            <i class = 'material-icons'>Add Task</i>
          </button>
          <br /> <br />
            <ol>
              { this.state.list.map(task => {
                return (
                  <li key = { task.id }>
                    { task.value }
                    <button className = 'btn btn-floating'
                      onClick = { () => this.deleteTask(task.id) }>
                      <i class = 'material-icons'>Delete</i>
                      </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
// React.DOM.render(<App />, document.getElementById('root'));