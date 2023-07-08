import { useReducer } from "react";

// Define action types
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  TOGGLE_SIGN: "toggle-sign",
  EVALUATE: "evaluate",
};

// Reducer function to handle state updates based on actions
export function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      // Check conditions to determine the next state based on the digit being added
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      // Determine the next state when an operation is chosen
      console.log("CHOOSE_OPERATION")
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      // Clear the state when the Clear button is clicked
      return {};

    case ACTIONS.DELETE_DIGIT:
      // Remove the last digit from the current operand when the Delete button is clicked
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null){
        return state;
      }
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }else{
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        };
      }

    case ACTIONS.TOGGLE_SIGN:
        // Toggle the sign of the current operand
        if (state.currentOperand == null) return state;
        return {
          ...state,
          currentOperand: (parseFloat(state.currentOperand) * -1).toString(),
        };

    case ACTIONS.EVALUATE:
      // Evaluate the expression and update the state accordingly
      if (
          state.operation == null ||
          state.currentOperand == null ||
          state.previousOperand == null
      ) {
        return state;
      }else{
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        };
    }
    default:
      return state;
  }
}

// Helper function to evaluate the expression based on the operation
function evaluate({ currentOperand, previousOperand, operation }) {
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
}

// Formatter for integer operands
const INTEGER_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});
// Helper function to format the operand with commas for thousands separator
function formatOperand(operand) {
  if (operand == null) return "";
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function Calculator() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});
  return (
    <div className="calculator-grid">
      <div className="display-unit">
          <div className="prev-operand">{formatOperand(previousOperand)} {operation}</div>
          <div className="curr-operand">{formatOperand(currentOperand)}</div>
      </div>
{/* 1st Row */}
      <button className="btn-clr" onClick={() => dispatch({ type: ACTIONS.CLEAR })}> AC </button>          {/* Clear button */}
      <button className="btn-clr" onClick={() => dispatch({ type: ACTIONS.TOGGLE_SIGN })}>+/-</button>     {/* Toggle sign button */}
      <button className="btn-clr" onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "%" } })}> % </button>
      <button className="btn-clr" onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "÷" } })}> ÷ </button>
{/* 2nd Row */}
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "7" } })}> 7 </button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "8" } })}> 8 </button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "9" } })}> 9 </button>
      <button className="btn-clr" onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "*" } })}> * </button>
{/* 3rd Row */}
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "4" } })}> 4 </button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "5" } })}> 5 </button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "6" } })}> 6 </button>
      <button className="btn-clr" onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "+" } })}> + </button>
{/* 4th Row */}
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "1" } })}> 1 </button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "2" } })}> 2 </button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "3" } })}> 3 </button>
      <button className="btn-clr" onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "-" } })}> - </button>
{/* 5th Row */}
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "." } })}> . </button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "0" } })}> 0 </button>
      {/* Delete button */}
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}> x </button>
      {/* Evaluate button */}
      <button className="btn-clr" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}> = </button>
    </div>
  );
}

export default Calculator;





// 1st way...........-----------.............


// import React, { useState } from "react";

// export const Calculator = () => {
//   // State variables
//   const [currentOperand, setCurrentOperand] = useState(null);
//   const [previousOperand, setPreviousOperand] = useState(null);
//   const [operation, setOperation] = useState(null);
//   const [overwrite, setOverwrite] = useState(false);

//   // Clear the calculator
//   const clear = () => {
//       setCurrentOperand(null);
//       setPreviousOperand(null);
//       setOperation(null);
//       setOverwrite(false);
//   };

//   // Add a digit to the current operand
//   const addDigit = (digit) => {
//     if (overwrite) {
//       setCurrentOperand(digit);
//       setOverwrite(false);
//     } else if (digit === "0" && currentOperand === "0") {
//       return;
//     } else if (digit === "." && currentOperand && currentOperand.includes(".")) {
//       return;
//     } else {
//       setCurrentOperand(`${currentOperand || ""}${digit}`);
//     }
//   };

//   // Choose an operation
//   const chooseOperation = (op) => {
//     if (currentOperand == null && previousOperand == null) {
//       return;
//     } else if (currentOperand == null) {
//       setOperation(op);
//     } else if (previousOperand == null) {
//       setOperation(op);
//       setPreviousOperand(currentOperand);
//       setCurrentOperand(null);
//     } else {
//       setPreviousOperand(evaluate());
//       setOperation(op);
//       setCurrentOperand(null);
//     }
//   };

//   // Delete the last digit from the current operand
//   const deleteDigit = () => {
//     if (overwrite) {
//       setOverwrite(false);
//       setCurrentOperand(null);
//     } else if (currentOperand == null) {
//       return;
//     } else if (currentOperand.length === 1) {
//       setCurrentOperand(null);
//     } else {
//       setCurrentOperand(currentOperand.slice(0, -1));
//     }
//   };

//   // Toggle the sign of the current operand
//   const toggleSign = () => {
//       if (currentOperand == null) return;
//       setCurrentOperand((parseFloat(currentOperand) * -1).toString());
//   };

//   // Evaluate the expression and return the result
//   const evaluate = () => {
//       const prev = parseFloat(previousOperand);
//       const current = parseFloat(currentOperand);
//       if (isNaN(prev) || isNaN(current)) {
//         return "";
//       }
//       let computation = "";
//       switch (operation) {
//         case "+":
//           computation = prev + current;
//           break;
//         case "-":
//           computation = prev - current;
//           break;
//         case "*":
//           computation = prev * current;
//           break;
//         case "÷":
//           computation = prev / current;
//           break;
//         case "%":
//           computation = prev % current;
//           break;
//         default:
//           return "";
//       }
//       return computation.toString();
//   };

//   // Format the operand with commas for thousands separator
//   const formatOperand = (operand) => {
//       if (operand == null) return "";
//       const [integer, decimal] = operand.split(".");
//       if (decimal == null) return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(integer);
//       return `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(integer)}.${decimal}`;
//   };

//   // JSX for the calculator UI
//   return (
//     <div className="calculator-grid">
//       <div className="display-unit">
//         <div className="prev-operand">
//           {formatOperand(previousOperand)} {operation}
//         </div>
//         <div className="curr-operand">{formatOperand(currentOperand)}</div>
//       </div>
//       {/* 1st Row */}
//       <button className="btn-clr" onClick={clear}>
//         AC
//       </button>
//       {/* Clear button */}
//       <button className="btn-clr" onClick={toggleSign}>
//         +/-
//       </button>
//       {/* Toggle sign button */}
//       <button className="btn-clr" onClick={() => chooseOperation("%")}>
//         %
//       </button>
//       <button className="btn-clr" onClick={() => chooseOperation("÷")}>
//         ÷
//       </button>
//       {/* 2nd Row */}
//       <button onClick={() => addDigit("7")}>7</button>
//       <button onClick={() => addDigit("8")}>8</button>
//       <button onClick={() => addDigit("9")}>9</button>
//       <button className="btn-clr" onClick={() => chooseOperation("*")}>
//         *
//       </button>
//       {/* 3rd Row */}
//       <button onClick={() => addDigit("4")}>4</button>
//       <button onClick={() => addDigit("5")}>5</button>
//       <button onClick={() => addDigit("6")}>6</button>
//       <button className="btn-clr" onClick={() => chooseOperation("+")}>
//         +
//       </button>
//       {/* 4th Row */}
//       <button onClick={() => addDigit("1")}>1</button>
//       <button onClick={() => addDigit("2")}>2</button>
//       <button onClick={() => addDigit("3")}>3</button>
//       <button className="btn-clr" onClick={() => chooseOperation("-")}>
//         -
//       </button>
//       {/* 5th Row */}
//       <button onClick={() => addDigit(".")}>.</button>
//       <button onClick={() => addDigit("0")}>0</button>
//       {/* Delete button */}
//       <button onClick={deleteDigit}>x</button>
//       {/* Evaluate button */}
//       <button
//         className="btn-clr"
//         onClick={() => {
//           setOverwrite(true);
//           setPreviousOperand(null);
//           setOperation(null);
//           setCurrentOperand(evaluate());
//         }}
//       >
//         =
//       </button>
//     </div>
//   );
// };

// export default Calculator;