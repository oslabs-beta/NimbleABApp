import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export type SelectPathProps = {
  disabled: boolean;
  dirPaths: Array<string>;
};
export default function SelectPath({ disabled, dirPaths }: SelectPathProps) {
  console.log(disabled);
  //Store patch in redux

  return (
    <Autocomplete
      disablePortal
      disabled={disabled}
      id="combo-box-demo"
      options={dirPaths}
      sx={{
        '& .MuiOutlinedInput-root': {
          //   border: '1px solid white',
          borderRadius: '3',
          padding: '2',
        },
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
          border: '1px solid #eee',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          border: '1px solid #a991f7',
        },
      }} //   sx={{ width:  }}
      className="w-96  "
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            input: { color: 'white' },
            '& .MuiFormLabel-root ': {
              color: 'white',
            },
          }}
          label="Path"
        />
      )}
    />
  );
}
