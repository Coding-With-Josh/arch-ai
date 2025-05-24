// NodeFactory.ts
import { v4 as uuidv4 } from 'uuid';
import { EnhancedFlowNode, NodeType } from '../flowTypes';
import { Position, XYPosition } from '@xyflow/react';

export class NodeFactory {
  static createNode(
    type: NodeType,
    position: XYPosition,
    overrideData: Partial<EnhancedFlowNode> = {}
  ): EnhancedFlowNode {
    const baseNode: Partial<EnhancedFlowNode> = {
      id: uuidv4(),
      type,
      position,
      dimensions: { width: 200, height: 100 },
      title: type.charAt(0).toUpperCase() + type.slice(1),
      style: {
        backgroundColor: '#ffffff',
        borderColor: '#000000',
        textColor: '#000000',
        borderWidth: 1,
        borderRadius: 5
      },
      metadata: {
        created: Date.now(),
        createdBy: 'user'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    // Add type-specific defaults
    const typeDefaults = this.getTypeDefaults(type);

    return {
      ...baseNode,
      ...typeDefaults,
      ...overrideData,
      data: {
        ...baseNode.data,
        ...(typeDefaults?.data || {}),
        ...(overrideData?.data || {})
      }
    } as EnhancedFlowNode;
  }

  private static getTypeDefaults(type: NodeType): Partial<EnhancedFlowNode> {
    switch (type) {
      case 'contract':
        return {
          dimensions: { width: 240, height: 120 },
          data: {
            type: 'contract',
            inputs: {
              "Contract Address": "",
              "ABI": "[]",
              "Chain": "Ethereum"
            },
            chain: 'ethereum',
            methods: [],
            events: []
          }
        };

      case 'wallet':
        return {
          dimensions: { width: 180, height: 80 },
          data: {
            type: 'wallet',
            inputs: {
              "Wallet Type": "EOA",
              "Sender Address": ""
            },
            chain: 'ethereum'
          }
        };

      case 'token':
        return {
          dimensions: { width: 200, height: 100 },
          data: {
            type: 'token',
            inputs: {
              "Token Address": "",
              "Standard": "ERC20",
              "Decimals": "18"
            },
            chain: 'ethereum'
          }
        };

      case 'nft':
        return {
          dimensions: { width: 220, height: 140 },
          data: {
            type: 'nft',
            inputs: {
              "Contract Address": "",
              "Token ID": "",
              "Standard": "ERC721"
            },
            chain: 'ethereum'
          }
        };

      case 'logic':
        return {
          dimensions: { width: 180, height: 100 },
          data: {
            type: 'logic',
            inputs: {
              "Condition": "",
              "Operator": "AND"
            },
            conditions: []
          }
        };

      case 'api':
        return {
          dimensions: { width: 220, height: 120 },
          data: {
            type: 'api',
            inputs: {
              "Endpoint": "",
              "Method": "GET",
              "Headers": "{}"
            }
          }
        };

      case 'data':
        return {
          dimensions: { width: 200, height: 100 },
          data: {
            type: 'data',
            inputs: {
              "Source": "ipfs",
              "Query": ""
            }
          }
        };

      case 'ui':
        return {
          dimensions: { width: 160, height: 80 },
          data: {
            type: 'ui',
            inputs: {
              "Component": "button",
              "Label": ""
            }
          }
        };

      case 'function':
        return {
          dimensions: { width: 240, height: 150 },
          data: {
            type: 'function',
            inputs: {
              "Code": "",
              "Language": "javascript",
              "Parameters": "[]"
            }
          }
        };

      case 'event':
        return {
          dimensions: { width: 180, height: 90 },
          data: {
            type: 'event',
            inputs: {
              "Event Name": "",
              "Payload": "{}"
            }
          }
        };

      case 'variable':
        return {
          dimensions: { width: 160, height: 70 },
          data: {
            type: 'variable',
            inputs: {
              "Name": "",
              "Value": "",
              "Type": "string"
            }
          }
        };

      default:
        return {
          data: {
            type,
            inputs: {}
          }
        };
    }
  }
}