import React from 'react'
import { useState } from 'react'

export const Demo = () => {
    // let number = 10;
    const [number, setNumber] = useState(0);

    function increment(event) {
        event.preventDefault();
        console.log("Before increment: " + number);
        setNumber(number + 1);
        console.log("After increment: " + number);
    }

    let lineCount = 3;

    function generatePattern(event) {
        event.preventDefault();
        let result = '';
        for (let i = 1; i <= lineCount; i++) {
            for (let j = 1; j <= i; j++) {
                result += '*';
            }
            result += '\n';
        }
        document.getElementById("output").innerText = result;

    }

    return (

        <div>
            <form>
                <button onClick={(event) => {
                    event.preventDefault();
                    increment(event);
                }}>Incriment</button>
            </form>

            {/* <form>
        <button onClick={(event) => generatePattern(event)}>Generate Pattern</button>
      </form>
      <pre id="output"></pre> */}
        </div>

    )
}
