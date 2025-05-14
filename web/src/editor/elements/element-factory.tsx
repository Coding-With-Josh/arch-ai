import { DesignElement, ElementAction } from '@/editor/types';
import {
  Box,
  Text,
  Container,
  Grid,
  Stack,
  Section,
  Button,
  Image,
  TextInput,
  Checkbox,
  Select,
  Carousel,
  Modal,
  Tabs,
} from '@/editor/elements/library';
import { dispatchAction } from './utils/dispatchAction';

import React from 'react';
import { useVariable } from '../useVariable';

interface ElementFactoryProps {
  element: DesignElement;
}

export const ElementFactory: React.FC<ElementFactoryProps> = ({ element }) => {
  const { componentType, props, children, dataBindings, eventBindings } = element;
  const processedProps = { ...props };

  // Handle data bindings
  if (dataBindings) {
    Object.entries(dataBindings).forEach(([propName, binding]) => {
      switch (binding.sourceType) {
        case 'variable':
          const [value] = useVariable(binding.sourceId);
          processedProps[propName] = value;
          break;
        case 'contractState':
        case 'content':
        case 'api':
          // Handle other binding types as needed
          break;
      }
    });
  }

  // Handle event bindings and action dispatching
  if (eventBindings) {
    Object.entries(eventBindings).forEach(([eventName, binding]) => {
      const originalHandler = processedProps[eventName];
      
      processedProps[eventName] = (...args: any[]) => {
        // Execute original handler if it exists
        if (originalHandler) {
          const result = originalHandler(...args);
          
          // If handler returns an action, dispatch it
          if (result && typeof result === 'object' && 'type' in result) {
            dispatchAction(result as ElementAction);
          }
        }
        
        // Execute bound event actions
        switch (binding.handlerType) {
          case 'flow':
            dispatchAction({
              type: 'triggerFlow',
              flowId: binding.handlerId,
              payload: args[0] // Pass event payload
            });
            break;
            
          case 'contract':
            dispatchAction({
              type: 'callContract',
              contractId: binding.handlerId,
              method: binding.transform?.inputMapping?.method || 'defaultMethod',
              args: args
            });
            break;
            
          case 'variable':
            dispatchAction({
              type: 'setVariable',
              variableId: binding.handlerId,
              value: args[0] // First argument as value
            });
            break;
        }
      };
    });
  }

  const commonProps = {
    ...processedProps,
    children: children?.map((child) => (
      <ElementFactory key={child.id} element={child} />
    )),
  };

  // Component rendering switch
  switch (componentType) {
    case 'box':
      return <Box {...commonProps} />;
    case 'text':
      return <Text {...commonProps} />;
    case 'container':
      return <Container {...commonProps} />;
    case 'grid':
      return <Grid {...commonProps} />;
    case 'stack':
      return <Stack {...commonProps} />;
    case 'section':
      return <Section {...commonProps} />;
    case 'button':
      return <Button {...commonProps} />;
    case 'image':
      return <Image {...commonProps} />;
    case 'text-input':
      return <TextInput {...commonProps} />;
    case 'checkbox':
      return <Checkbox {...commonProps} />;
    case 'select':
      return <Select {...commonProps} />;
    case 'carousel':
      return <Carousel {...commonProps} />;
    case 'modal':
      return <Modal {...commonProps} />;
    case 'tabs':
      return <Tabs {...commonProps} />;
    default:
      console.warn(`Unknown component type: ${componentType}`);
      return <Box {...commonProps} />;
  }
};
