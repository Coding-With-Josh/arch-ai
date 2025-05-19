import { DesignElement, ElementAction } from '@/editor/types';
import {
  Box,
  Text,
  Container,
  Grid as GridElement,
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
import React, { forwardRef } from 'react';
import { useVariable } from '../useVariable';
import { cn } from '@/lib/utils';

interface ElementFactoryProps {
  element: DesignElement;
  style?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  className?: string;
  isSelected?: boolean;
}

// Define proper ref types for each component
type ComponentRefTypes = {
  box: HTMLDivElement;
  text: HTMLParagraphElement; // Changed from HTMLSpanElement to HTMLParagraphElement
  container: HTMLDivElement;
  grid: HTMLDivElement;
  stack: HTMLDivElement;
  section: HTMLDivElement;
  button: HTMLButtonElement;
  image: HTMLImageElement;
  'text-input': HTMLInputElement;
  checkbox: HTMLInputElement;
  select: HTMLSelectElement;
  carousel: HTMLDivElement;
  modal: HTMLDivElement;
  tabs: HTMLDivElement;
};

export const ElementFactory = forwardRef<HTMLDivElement, ElementFactoryProps>(
  ({ element, style, onMouseDown, onContextMenu, className, isSelected }, ref) => {
    const { componentType, props, children, dataBindings, eventBindings } = element;
    
    // Merge incoming style with element's own style
    const processedProps = { 
      ...props,
      style: {
        ...props?.style,
        ...style,
        position: 'absolute',
      },
      className: cn(props?.className, className),
      onMouseDown,
      onContextMenu,
    };

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
            break;
        }
      });
    }

    // Handle event bindings
    if (eventBindings) {
      Object.entries(eventBindings).forEach(([eventName, binding]) => {
        const originalHandler = processedProps[eventName];
        processedProps[eventName] = (...args: any[]) => {
          if (originalHandler) {
            const result = originalHandler(...args);
            if (result && typeof result === 'object' && 'type' in result) {
              dispatchAction(result as ElementAction);
            }
          }
          switch (binding.handlerType) {
            case 'flow':
              dispatchAction({ type: 'triggerFlow', flowId: binding.handlerId, payload: args[0] });
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
              dispatchAction({ type: 'setVariable', variableId: binding.handlerId, value: args[0] });
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

    // Component rendering switch with proper ref typing
    switch (componentType) {
      case 'box':
        return <Box {...commonProps} ref={ref as React.Ref<HTMLDivElement>} />;
      case 'text':
        return <Text {...commonProps} ref={ref as React.Ref<HTMLParagraphElement>} />;
      case 'container':
        return <Container {...commonProps} ref={ref as React.Ref<HTMLDivElement>} />;
      case 'grid':
        return <GridElement {...commonProps} ref={ref as React.Ref<HTMLDivElement>} />;
      case 'stack':
        return <Stack {...commonProps} ref={ref as React.Ref<HTMLDivElement>} />;
      case 'section':
        return <Section {...commonProps} ref={ref as React.Ref<HTMLDivElement>} />;
      case 'button':
        return <Button {...commonProps} />; // No ref forwarding for buttons
      case 'image':
        return <Image {...commonProps} />; // No ref forwarding for images
      case 'text-input':
        return <TextInput {...commonProps} />; // No ref forwarding for inputs
      case 'checkbox':
        return <Checkbox {...commonProps} />; // No ref forwarding for checkboxes
      case 'select':
        return <Select {...commonProps} />; // No ref forwarding for selects
      case 'carousel':
        return <Carousel {...commonProps} ref={ref as React.Ref<HTMLDivElement>} />;
      case 'modal':
        return <Modal {...commonProps} ref={ref as React.Ref<HTMLDivElement>} />;
      case 'tabs':
        return <Tabs {...commonProps} ref={ref as React.Ref<HTMLDivElement>} />;
      default:
        console.warn(`Unknown component type: ${componentType}`);
        return <Box {...commonProps} ref={ref as React.Ref<HTMLDivElement>} />;
    }
  }
);

ElementFactory.displayName = 'ElementFactory';