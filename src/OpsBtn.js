import { ACTIONS } from "./Calculator"

function OpsBtn({ dispatch, operation }) {

  return (
    <button className="btn-clr"
        onClick={() =>
            dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
        }>
        {operation}
    </button>
  )
}

export default OpsBtn;
