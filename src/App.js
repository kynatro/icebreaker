import React, { Component } from 'react'
import store from 'store2'
import './App.css'
import questions from './questions.json'

function randomQuestion() {
  let lastQuestions = store('lastQuestions') || []
  let questionSet = questions.filter(question => !lastQuestions.includes(question))

  if (!questionSet.length) {
    questionSet = questions
    lastQuestions = []
  }
  
  const question = sample(questionSet)

  store('lastQuestions', [...lastQuestions, question])

  return question
}

function sample(arr) {
  return arr[Math.ceil(Math.random() * (arr.length - 1))]
}

class App extends Component {
  static getDerivedStateFromProps(state) {
    if (!state.question) {
      return {
        question: randomQuestion()
      }
    }

    return null
  }

  componentDidMount() {
    document.addEventListener('keypress', (event) => {
      if (event.keyCode === 32) {
        this.setState({
          question: randomQuestion()
        })
      }
    })
  }

  render() {
    const { question } = this.state
    
    return (
      <div className="App">
        <header>
          <h1>Ice Breaker Question:</h1>
        </header>
        <section>
          {question}
        </section>
      </div>
    );
  }
}

export default App;
