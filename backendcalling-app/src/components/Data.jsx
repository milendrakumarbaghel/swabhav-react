import React from 'react'
import axios from 'axios'
import { readData } from '../services/Service'

function Data() {
  const [data, setData] = React.useState(null)

  const getData = async () => {
    console.log("Button Clicked")

    //fetch
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')

    console.log(response)
    const data = await response.json();
    console.log(data)

    //axios
    // const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1')
    // console.log(response.data)

  }
  return (
    <div>

      <button onClick={getData}>Get Data</button>
    </div>
  )
}

export default Data
