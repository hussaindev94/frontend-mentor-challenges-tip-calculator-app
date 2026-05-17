const form = document.querySelector(".content-container");
const inputs = form.querySelectorAll("input");
const buttons = form.querySelectorAll(".tip-button");
const reset = form.querySelector(".result-button");
const tipAmount = form.querySelector(".tip-amount-row p:last-child");
const totalAmount = form.querySelector(".total-amount-row p:last-child")
const errorMessage = form.querySelector(".error-message");

function renderResult(number1, number2) {
    tipAmount.lastChild.nodeValue = String(number1);
    totalAmount.lastChild.nodeValue = String(number2);
}

//A varaible to hold the value needed for calculations
/*We know that the item a 0 index is for the bill it is reserved
and at the 1 index for the tip
and at the 2 index for the people
[bill, tip, people]
*/
let resultArray = [];
function calculateTipAmount(resultArray) {
    let [bill, tip, people] = [...resultArray];

    //Check on the tip if it has % remove it otherwise do nothing:
    /*If the tip come from a button*/
    /*There is another apraoch by making two span elements inside the button
    and take the first nodesChild[0]
    */
    if (tip && tip[tip.length - 1] === "%") {
        tip = tip.slice(0, tip.length - 1);
    }

    const result1 = (Number(bill) * (Number(tip)/100)) / Number(people);
    const result2 = (Number(bill) * (1 + (Number(tip) / 100))) / Number(people);

    if(result1 >= 0 && result2 >= 0) renderResult(result1.toFixed(2), result2.toFixed(2))
}

function renderErrorMessage() {
    /*We know that the inputs are array
    and we know that they will be ordered as the JS reads them
    the first one will be at 0 index and so on
    So if the location of the input change for any reason we need to update the index number
    */
    inputs[2].classList.add("error-state");
    errorMessage.classList.remove("hide-error");
    errorMessage.classList.add("show-error");
}
function clearErrorMessage() {
    inputs[2].classList.remove("error-state");
    errorMessage.classList.remove("show-error");
    errorMessage.classList.add("hide-error");
    return true;
}
const validations = {
    "bill-input": (value) => Number(value) > 0? true:false,
    "custom-tip-input": (value) => Number(value) >= 0 ? true : false,
    /*This is the value return from the button, I think no need to check on it */
    "tip-button" : (value) => true,
    "people-input": (value) => Number(value) > 0 ? clearErrorMessage() : renderErrorMessage()
}

function isValue(key, value, validations) {
    if (validations[key](value)) return true;
    return false;
}

const handleInput = (e) => {
    /*I make a split here because
    When the error-message class is added to the element
    the returned class will be like this "people-input error-message"
    which will make an error in the validations object
    it does not have a key like this.
    */
    const key = e.target.className.split(" ")[0];

    /*I make the value to be an OR condition
    to handle the custom tip input and the tip button
    the input has .value while the button has .innerText
    */
    const value = e.target.value || e.target.innerText;
    //For any change or inyeraction from the user the disabled state will be turned off
    reset.disabled = false;

    if (isValue(key, value, validations)) {
        if (key === "bill-input") resultArray[0] = value;
        if (key === "custom-tip-input" || key === "tip-button") resultArray[1] = value;
        if (key === "people-input") resultArray[2] = value;
    }

}
const handleClick = (e) => {
    e.preventDefault();
    //any click happen on a button make sure the custom tip input to be 0:
    inputs[1].value = "";
    /*Calling handleInput in handleClick
    so we could get the value from the button
    and pass it to the validations
    following the DRY principle
    */
    handleInput(e);
};

inputs.forEach(input => input.addEventListener("change", handleInput));
buttons.forEach(button => button.addEventListener("click", handleClick));
//Adding two event listeners for the same element to make sure we captuer the user activities
form.addEventListener("change", () => calculateTipAmount(resultArray));
form.addEventListener("click", () => calculateTipAmount(resultArray));

const resetForm = (e) => {
    e.target.disabled = true;

    resultArray = [];

    clearErrorMessage();

    renderResult("0.00", "0.00");

    form.reset();
}
reset.addEventListener("click", resetForm);
