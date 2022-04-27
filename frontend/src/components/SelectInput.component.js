import React, {useState} from "react";
import {Box} from "@mui/system";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";

// selection component based on mui
const SelectInputComponent = ({label, name, options, defaultOption, width="100%", onChange, helperText='', disabled=false}) =>{

    const [currSelected, setCurrSelected] = useState(defaultOption.value);

    const handleOnChange = e => {
        setCurrSelected(e.target.value); // update state
        onChange(e);                     // send event back to parent
    }

    return(
        <Box mt={1} component="div" sx={{ display: 'inline' }} width={width}>
        {/*<Box mt={3} width={width}>*/}
            <FormControl sx={{ m: 1, minWidth: 300 }}>
                <InputLabel>{label}</InputLabel>
                <Select name={name} value={currSelected} label={label} onChange={handleOnChange} autoWidth disabled={disabled}>
                    {options.map((item, index) => (
                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                    ))}
                </Select>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        </Box>
    );
}

export default SelectInputComponent;