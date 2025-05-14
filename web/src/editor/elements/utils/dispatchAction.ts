// src/utils/dispatchAction.ts
import { ElementAction } from '@/editor/types';

export const dispatchAction = (action: ElementAction) => {
  switch (action.type) {
    case 'navigate':
      console.log('Navigating to:', action.target);
      // window.location.href = action.target;
      break;
      
    case 'callContract':
      console.log('Calling contract method:', action.method, 'with args:', action.args);
      break;
      
    case 'setVariable':
      console.log('Setting variable:', action.variableId, 'to:', action.value);
      break;
      
    case 'triggerFlow':
      console.log('Triggering flow:', action.flowId, 'with payload:', action.payload);
      break;
      
    case 'openUrl':
      console.log('Opening URL:', action.url, 'in target:', action.target);
      break;
      
    case 'custom':
      console.log('Custom handler:', action.handler);
      break;
      
    case 'emitEvent':
      console.log('Emitting event:', action.eventName, 'with payload:', action.payload);
      break;
      
    default:
      console.warn('Unknown action type:', action);
  }
};