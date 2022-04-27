import React, {useState} from "react";
import {FormControl, TextField} from "@mui/material";
import {Box} from "@mui/system";

// text component based on mui
const TextInputComponent = ({label, name, type="text", defaultValue="", onChange, error=false, errorText=""}) => {

    const [currentText, setCurrentText] = useState(defaultValue);

    const handleOnChange = e => {
        setCurrentText(e.target.value); // update state
        onChange(e);                    // send event back to parent
    }

    return(
        <Box mt={3} width="100%">
            <FormControl fullWidth size="small">
                <TextField
                    value={currentText}
                    name={name}
                    onChange={handleOnChange}
                    variant="outlined"
                    label={label}
                    type="text"
                    size="small"
                    error={error}
                    helperText={errorText}
                    inputProps={type === "number" ? { inputMode: 'numeric', pattern: '[0-9]*' } : {}}
                />
            </FormControl>
        </Box>
    );
}

export default TextInputComponent;