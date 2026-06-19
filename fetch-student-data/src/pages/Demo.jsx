import React from 'react'

export function Demo() {
    const [count, setCount] = React.useState(0);
    setCount(count + 1);

    return <h1>{count}</h1>;
}
