import React from "react";
import {Box} from "@mui/system";

// image component based on mui's Box component because they don't have a prebuilt one
const ImageComponent = ({src, alt="", height=233, width=350, maxHeight={ xs: 233, md: 167 }, maxWidth={ xs: 350, md: 250 }}) => {
    return(
        <Box
            component="img"
            sx={{
                height: height,
                width: width,
                maxHeight: maxHeight,
                maxWidth: maxWidth,
            }}
            alt={alt}
            src={src}
        />
    );
}

export default ImageComponent;