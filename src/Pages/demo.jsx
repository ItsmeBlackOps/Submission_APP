// import * as React from 'react';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import Stack from '@mui/material/Stack';
// import axios from 'axios';

// export default function LocationAutocomplete() {
//   const [value, setValue] = React.useState(null);
//   const [options, setOptions] = React.useState([]);

//   const fetchSuggestions = async (text) => {
//     try {
//       const response = await axios.get(
//         `https://api.swiftcomplete.com/v1/places/?key=2f2893cb-4d5e-47c1-a4e8-0268843989fd&countries=gb&text=${text}&maxResults=5`
//       );
//       setOptions(response.data || []);
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//       setOptions([]);
//     }
//   };

//   const handleInputChange = (event, value) => {
//     fetchSuggestions(value);
//   };

//   return (
//     <Stack spacing={1} sx={{ width: 300 }}>
//       <Autocomplete
//         value={value}
//         onChange={(event, newValue) => {
//           setValue(newValue);
//         }}
//         inputValue={value}
//         onInputChange={handleInputChange}
//         options={options}
//         getOptionLabel={(option) => option.primary.text}
//         renderInput={(params) => (
//           <TextField {...params} label="Location (City, State)" variant="standard" />
//         )}
//       />
//     </Stack>
//   );
// }
