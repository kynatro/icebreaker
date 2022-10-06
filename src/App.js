import React, { Component } from 'react'
import store from 'store2'
import './App.css'
import questions from './questions.json'

function sample(arr) {
  return arr[Math.ceil(Math.random() * (arr.length - 1))]
}

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fetching: false,
            question: null
        }
    }

  componentDidMount() {
    document.addEventListener('keypress', (event) => {
      if (event.keyCode === 32) {
        this.setState({
            question: this.getQuestion()
        })
        }
    })

    this.getQuestion()
  }

  getQuestion = () => {
      const { type } = this.props

      return type === 'icebreaker' ? this.randomQuestion() : this.fetchTrivia()
  }

  fetchTrivia = () => {
    const { fetching } = this.state

    if (fetching) {
        return false;
    }

    this.setState({
        fetching: true
    }, () => {
        fetch('https://www.randomtriviagenerator.com/questions?limit=1&page=1')
        .then(res => res.text())
        .then(res => {
            const parsedRes = JSON.parse(res)
            const sampledQuestion = sample(parsedRes)
            const { question } = sampledQuestion

            console.log('\x1b[1mQ:' + question + '\x1b[0m');
            console.log('\x1b[1mA:\x1b[0m' + sampledQuestion.answer)

            this.setState({
                question,
                fetching: false
            })
        })
    })
  }

  randomQuestion = () => {
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
  
  render() {
    const { type = 'icebreaker' } = this.props
    const { question } = this.state
    const titles = {
        icebreaker: 'Ice Breaker',
        trivia: 'Trivia'
    }
    
    return (
      <div className="App">
        <header>
          <h1>{titles[type]} Question:</h1>
        </header>
        <section>
          {question}
        </section>
      </div>
    );
  }
}

export default App;
