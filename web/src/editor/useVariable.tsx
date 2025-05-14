import { useEffect, useState } from 'react';
import { useEditor } from './editor-provider';

export const useVariable = (variableId: string) => {
  const { state, dispatch } = useEditor();
  const [value, setValue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Find the variable in the editor state
  const variable = state.variables.variables.find(v => v.id === variableId);

  // Initialize value when variable is found
  useEffect(() => {
    if (variable) {
      setValue(variable.value);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [variable]);

  // Update function that dispatches to the editor state
  const setVariableValue = (newValue: any) => {
    if (!variable) {
      console.warn(`Variable with ID ${variableId} not found`);
      return;
    }

    // Dispatch the update to the editor state
    dispatch({
      type: 'UPDATE_VARIABLE',
      payload: {
        id: variableId,
        updates: {
          value: newValue
        }
      }
    });

    // Optimistically update local state
    setValue(newValue);
  };

  // Return the current value and setter function
  return [
    value,
    setVariableValue,
    {
      isLoading,
      variable, // The full variable object if needed
      scope: variable 
        ? state.variables.scopes.find(s => s.id === variable.scope) 
        : null
    }
  ] as const;
};