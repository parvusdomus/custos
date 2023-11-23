export async function RegularPJRoll(event)
{
    event.preventDefault();
    const dataset = event.currentTarget.dataset;
    console.log ("REGULAR PJ ROLL")
    console.log (dataset)
    return;
}

export function diceToFaces(value, content)
{
    switch (Number(value))
    {
        case 1:
            return "fa-dice-one";
        case 2:
            return "fa-dice-two";
        case 3:
            return "fa-dice-three";
        case 4:
            return "fa-dice-four";
        case 5:
            return "fa-dice-five";
        case 6:
            return "fa-dice-six";
    }

    return "fa-dice-d6";
}