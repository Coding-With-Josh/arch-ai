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
      ports: [],
      metadata: {
        created: Date.now(),
        createdBy: 'user'
      },
      data: {
        type,
        inputs: {}
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
            chain: 'ethereum',
            type: 'contract',
            address: '',
            abi: [],
            methods: [],
            inputs: {

            },
            events: []
          }
        };

      case 'wallet':
        return {
          dimensions: { width: 180, height: 80 },
          data: {
            walletType: 'EOA',
            address: '',
            type: 'wallet',
            inputs: [
              {
                name: "Wallet Type",
                type: "STRING",
                helperText: "Solana, Sui, Multichain, etc.",
                required: true,
                hideHandle: true
              },
              {
                name: "Sender Address",
                type: "STRING",
                helperText: "0x1234567890abcdef...",
                required: true,
                hideHandle: true
              }
            ],
            chain: 'ethereum'
          }
        };

      case 'token':
        return {
          dimensions: { width: 200, height: 100 },
          data: {
            standard: 'ERC20',
            address: '',
            type: 'token',
            symbol: '',
            decimals: 18,
            chain: 'ethereum'
          }
        };

      case 'nft':
        return {
          dimensions: { width: 220, height: 140 },
          data: {
            standard: 'ERC721',
            address: '',
            tokenId: '',
            type: 'nft',
            chain: 'ethereum'
          }
        };

      case 'logic':
        return {
          dimensions: { width: 180, height: 100 },
          data: {
            logicType: 'if',
            type: 'logic',
            conditions: []
          }
        };

      case 'api':
        return {
          dimensions: { width: 220, height: 120 },
          data: {
            method: 'GET',
            type: 'api',
            url: '',
            headers: {},
            params: {}
          }
        };

      case 'data':
        return {
          dimensions: { width: 200, height: 100 },
          data: {
            source: 'ipfs',
            type: 'data',
            cid: '',
            query: ''
          }
        };

      case 'ui':
        return {
          dimensions: { width: 160, height: 80 },
          data: {
            uiType: 'button',
            label: 'Click me',
            variant: 'primary',
            type: 'ui',
          }
        };

      case 'function':
        return {
          dimensions: { width: 240, height: 150 },
          data: {
            language: 'javascript',
            code: '',
            inputs: [],
            outputs: [],
            type: 'function',
          }
        };

      case 'event':
        return {
          dimensions: { width: 180, height: 90 },
          data: {
            eventName: '',
            payloadSchema: {},
            type: 'event',
          }
        };

      case 'variable':
        return {
          dimensions: { width: 160, height: 70 },
          data: {
            varType: 'string',
            value: '',
            isConstant: false,
            type: 'variable',
          }
        };

      default:
        return {};
    }
  }
}