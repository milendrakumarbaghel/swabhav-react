import React, { useRef, useState } from 'react';

function Form() {
    const [name, setName] = useState('');
    const city = useRef();

    function handleSubmit(event) {
        event.preventDefault();

        console.log("Name:", name);                  // from state
        console.log("City:", city.current.value);    // from ref
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Enter your city"
                    ref={city}
                />

                <br />
                <button type="submit">Click Me</button>

                <br />
                {name}
            </form>
        </div>
    );
}

export default Form;
