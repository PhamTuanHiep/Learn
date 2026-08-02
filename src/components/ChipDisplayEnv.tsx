import { Chip } from "@mui/material"

const ChipDisplayEnv = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    return (
        <Chip
            color="primary"
            label={`VITE_API_URL: ${apiUrl || "not import env yet"}`}
            sx={{
                position: "fixed", // dính theo viewport, không trôi khi scroll
                bottom: 8,
                right: 8,
                zIndex: 9999,      // nổi lên trên các phần tử khác
            }}
        />
    );
}
export default ChipDisplayEnv;