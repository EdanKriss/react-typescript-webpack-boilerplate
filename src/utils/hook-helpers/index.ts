import * as React from 'react';

// Factory, produces FocusEventHandler for an input or textarea.
// 1. Execute, passing the SetStateAction from the 'useState' hook used to control the input
// 2. Pass the returned FocusEventHandler to the input's onBlur
export const trimInputOnBlur = (
    setState: React.Dispatch<React.SetStateAction<string>>
): React.FocusEventHandler<HTMLTextAreaElement | HTMLInputElement> => {
    return (e) => {
        const trimmed = e.target.value.trim();
        if (trimmed !== e.target.value) setState(trimmed);
    };
};