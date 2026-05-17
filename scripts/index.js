const form = document.querySelector(".content-container");
console.log(form);

const inputs = form.querySelectorAll("input");
console.log(inputs);

const buttons = form.querySelectorAll(".tip-button");
console.log(buttons);

const reset = form.querySelector(".result-button");
console.log("reset",reset);

const tipAmount = form.querySelector(".tip-amount-row p:last-child");

const totalAmount = form.querySelector(".total-amount-row p:last-child")

const errorMessage = form.querySelector(".error-message");

function renderResult(number1, number2) {
    tipAmount.lastChild.nodeValue = String(number1);
    totalAmount.lastChild.nodeValue = String(number2);
}


let resultArray = [];
function calculateTipAmount(resultArray) {
    let [bill, tip, people] = [...resultArray];

    //Check on the tip if it has % remove it otherwise do nothing:
    if (tip && tip[tip.length - 1] === "%") {
        tip = tip.slice(0, tip.length - 1);
    }

    const result1 = (Number(bill) * (Number(tip)/100)) / Number(people);
    const result2 = (Number(bill) * (1 + (Number(tip) / 100))) / Number(people);
    console.log(result1, result2);
    if(result1 >= 0 && result2 >= 0) renderResult(result1.toFixed(2), result2.toFixed(2))
    console.log(bill, tip, people);
}

function renderErrorMessage() {
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
    "tip-button" : (value) => true,
    "people-input": (value) => Number(value) > 0 ? clearErrorMessage() : renderErrorMessage()
}

function isValue(key, value, validations) {
    if (validations[key](value)) return true;
    return false;
}

const handleInput = (e) => {
    const key = e.target.className.split(" ")[0];
    console.log(key);
    const value = e.target.value || e.target.innerText;

    reset.disabled = false;

    if (isValue(key, value, validations)) {
        if (key === "bill-input") resultArray[0] = value;
        if (key === "custom-tip-input" || key === "tip-button") resultArray[1] = value;
        if (key === "people-input") resultArray[2] = value;
    }

    console.log(key, typeof(value));
}
const handleClick = (e) => {
    e.preventDefault();
    //any click happen on a button make sure the custom tip input to be 0:
    inputs[1].value = "";
    handleInput(e);

    console.log(e.target.innerText);
};

inputs.forEach(input => input.addEventListener("change", handleInput));
buttons.forEach(button => button.addEventListener("click", handleClick));

//Add event listner on the form to run the calculateTipAmount function everytime a change to the form happen
form.addEventListener("change", () => calculateTipAmount(resultArray));
form.addEventListener("click", () => calculateTipAmount(resultArray));

const resetForm = (e) => {
    e.target.disabled = true;
    resultArray = [];
    console.log("The form is resetted!.");
    clearErrorMessage();
    renderResult("0.00", "0.00");
    form.reset();
}
reset.addEventListener("click", resetForm);
