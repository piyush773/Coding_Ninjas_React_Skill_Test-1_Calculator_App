import React, { useState } from "react";

export const Calculator = () => {
  // State variables
  const [currentOperand, setCurrentOperand] = useState(null);
  const [previousOperand, setPreviousOperand] = useState(null);
  const [operation, setOperation] = useState(null);
  const [overwrite, setOverwrite] = useState(false);

  // Clear the calculator
  const clear = () => {
      setCurrentOperand(null);
      setPreviousOperand(null);
      setOperation(null);
      setOverwrite(false);
  };

  // Add a digit to the current operand
  const addDigit = (digit) => {
    if (overwrite) {
      setCurrentOperand(digit);
      setOverwrite(false);
    } else if (digit === "0" && currentOperand === "0") {
      return;
    } else if (digit === "." && currentOperand && currentOperand.includes(".")) {
      return;
    } else {
      setCurrentOperand(`${currentOperand || ""}${digit}`);
    }
  };

  // Choose an operation
  const chooseOperation = (op) => {
    if (currentOperand == null && previousOperand == null) {
      return;
    } else if (currentOperand == null) {
      setOperation(op);
    } else if (previousOperand == null) {
      setOperation(op);
      setPreviousOperand(currentOperand);
      setCurrentOperand(null);
    } else {
      setPreviousOperand(evaluate());
      setOperation(op);
      setCurrentOperand(null);
    }
  };

  // Delete the last digit from the current operand
  const deleteDigit = () => {
    if (overwrite) {
      setOverwrite(false);
      setCurrentOperand(null);
    } else if (currentOperand == null) {
      return;
    } else if (currentOperand.length === 1) {
      setCurrentOperand(null);
    } else {
      setCurrentOperand(currentOperand.slice(0, -1));
    }
  };

  // Toggle the sign of the current operand
  const toggleSign = () => {
      if (currentOperand == null) return;
      setCurrentOperand((parseFloat(currentOperand) * -1).toString());
  };

  // Evaluate the expression and return the result
  const evaluate = () => {
      const prev = parseFloat(previousOperand);
      const current = parseFloat(currentOperand);
      if (isNaN(prev) || isNaN(current)) {
        return "";
      }
      let computation = "";
      switch (operation) {
        case "+":
          computation = prev + current;
          break;
        case "-":
          computation = prev - current;
          break;
        case "*":
          computation = prev * current;
          break;
        case "÷":
          computation = prev / current;
          break;
        case "%":
          computation = prev % current;
          break;
        default:
          return "";
      }
      return computation.toString();
  };

  // Format the operand with commas for thousands separator
  const formatOperand = (operand) => {
      if (operand == null) return "";
      const [integer, decimal] = operand.split(".");
      if (decimal == null) return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(integer);
      return `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(integer)}.${decimal}`;
  };

  // JSX for the calculator UI
  return (
    <div className="calculator-grid">
      <div className="display-unit">
        <div className="prev-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="curr-operand">{formatOperand(currentOperand)}</div>
      </div>
      {/* 1st Row */}
      <button className="btn-clr" onClick={clear}>
        AC
      </button>
      {/* Clear button */}
      <button className="btn-clr" onClick={toggleSign}>
        +/-
      </button>
      {/* Toggle sign button */}
      <button className="btn-clr" onClick={() => chooseOperation("%")}>
        %
      </button>
      <button className="btn-clr" onClick={() => chooseOperation("÷")}>
        ÷
      </button>
      {/* 2nd Row */}
      <button onClick={() => addDigit("7")}>7</button>
      <button onClick={() => addDigit("8")}>8</button>
      <button onClick={() => addDigit("9")}>9</button>
      <button className="btn-clr" onClick={() => chooseOperation("*")}>
        *
      </button>
      {/* 3rd Row */}
      <button onClick={() => addDigit("4")}>4</button>
      <button onClick={() => addDigit("5")}>5</button>
      <button onClick={() => addDigit("6")}>6</button>
      <button className="btn-clr" onClick={() => chooseOperation("+")}>
        +
      </button>
      {/* 4th Row */}
      <button onClick={() => addDigit("1")}>1</button>
      <button onClick={() => addDigit("2")}>2</button>
      <button onClick={() => addDigit("3")}>3</button>
      <button className="btn-clr" onClick={() => chooseOperation("-")}>
        -
      </button>
      {/* 5th Row */}
      <button onClick={() => addDigit(".")}>.</button>
      <button onClick={() => addDigit("0")}>0</button>
      {/* Delete button */}
      <button onClick={deleteDigit}>x</button>
      {/* Evaluate button */}
      <button
        className="btn-clr"
        onClick={() => {
          setOverwrite(true);
          setPreviousOperand(null);
          setOperation(null);
          setCurrentOperand(evaluate());
        }}
      >
        =
      </button>
    </div>
  );
};

export default Calculator;