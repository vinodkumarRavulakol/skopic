import React, { useEffect, useRef, useState } from "react";

import { Button } from "@mui/material";

// function usePrevious(value, initial) {
//     const ref = useRef();
//     useEffect(() => {
//         ref.current = value;
//     }, [value]);
//     if (ref.current === undefined && initial !== undefined) {
//         return initial;
//     }
//     return ref.current;
// }

const CustomControls = (props) => {
    const {
        onSubmitBoundary,
        removeBoundary,
        coords
    } = props

    const disabled = coords.length === 0;
    console.log(disabled);

    // const [disabled, setDisabled] = useState(false);

    // const prevCoords = usePrevious(coords,);
    // console.log(coords)
    // console.log(prevCoords)

    // useEffect(() => {
    //     if (prevCoords && prevCoords.length === 0) {
    //         console.log('dsfghj')
    //         setDisabled(true);
    //     }
    // }, [coords])

    return (
        <>
            <Button
                variant="contained"
                size="small"
                onClick={onSubmitBoundary}
                // disabled={disabled}
                style={{ marginLeft: "8px" }}
            >
                Submit Boundary
            </Button>
            <Button
                style={{ marginLeft: "8px" }}
                variant="contained"
                size="small"
                onClick={removeBoundary}
                // disabled={disabled}
            >
                Remove Boundary
            </Button>
        </>
    )
}

export default CustomControls;